import { Option, program } from "commander";
import { envOption } from "./deploy-envs";
import {
  getDeploymentStatus,
  getTaggedVersion,
  goldsky,
  hasFailed,
  readSubgraphEnv,
  setOutput,
  subgraphTag
} from "./goldsky";

program
  .description(
    "Check whether the version deployed by 'deploy-on-goldsky.ts' is fully indexed and, if it is, move the '" +
      subgraphTag +
      "' tag onto it and delete the version the tag was pointing to. Indexing a version can take hours, so this makes a single check and reports what it found on the 'outcome' step output - 'promoted', 'pending' or 'failed'. The 'Promote deployed subgraphs' workflow runs it every 30 minutes until it is done."
  )
  .addOption(envOption())
  .addOption(
    new Option(
      "--deployed-version <VERSION>",
      "The deployed version to promote. Defaults to the version of packages/subgraph/package.json, which is only the deployed one when this runs off the very commit that was deployed."
    )
  )
  .parse(process.argv);

const { env, deployedVersion } = program.opts();

/**
 * Goldsky tags are mutable pointers keyed by tag name, so creating a tag that already
 * exists simply repoints it onto the given version - no intermediate tag is needed.
 */
async function createTag(
  subgraphName: string,
  subgraphVersion: string,
  tag: string
) {
  await goldsky([
    "subgraph",
    "tag",
    "create",
    `${subgraphName}/${subgraphVersion}`,
    "--tag",
    tag
  ]);
}

async function removeSubgraph(subgraphName: string, subgraphVersion: string) {
  await goldsky([
    "subgraph",
    "delete",
    `${subgraphName}/${subgraphVersion}`,
    "--force"
  ]);
}

async function main() {
  /**
   * 1. read the indexing status of the deployed version, and stop there unless it is
   *    synced and healthy - a version that is still indexing is checked again on the next
   *    run, one that failed is reported so that the deployment can be fixed
   * 2. get the version the "latest" tag currently points to - the deployment left the tag
   *    alone, so it is still the version being served, and reading it again on every run
   *    is what makes this script safe to run over and over
   * 3. move the "latest" tag onto the new version
   * 4. if the old version has been found (and is different from the new version), and the
   *    "latest" tag does point to the new version, delete the old version
   */
  const { subgraphName, subgraphVersion } = readSubgraphEnv(env);
  const newVersion: string = deployedVersion || subgraphVersion;

  // A transient failure throws here: nothing is reported on the 'outcome' output, so the
  // workflow keeps the deployment flagged and checks it again on the next run - until it
  // has waited long enough to give up on it
  const status = await getDeploymentStatus(subgraphName, newVersion);

  if (hasFailed(status)) {
    setOutput("outcome", "failed");
    throw new Error(
      `${subgraphName}/${newVersion} failed to index - the '${subgraphTag}' tag has not been moved`
    );
  }

  if (!status.synced) {
    setOutput("outcome", "pending");
    console.log(
      `${subgraphName}/${newVersion} is still indexing (${status.progress}) - leaving the '${subgraphTag}' tag on the version currently served`
    );
    return;
  }

  if (status.health !== "healthy") {
    setOutput("outcome", "failed");
    throw new Error(
      `${subgraphName}/${newVersion} is synced but not healthy (status: ${status.health}) - the '${subgraphTag}' tag has not been moved`
    );
  }
  console.log(`${subgraphName}/${newVersion} is synced and healthy`);

  const oldVersion = await getTaggedVersion(subgraphName, subgraphTag);

  await createTag(subgraphName, newVersion, subgraphTag);

  if (oldVersion && oldVersion !== newVersion) {
    // Never delete the old version unless the tag has really been moved over
    const taggedVersion = await getTaggedVersion(subgraphName, subgraphTag);
    if (taggedVersion !== newVersion) {
      throw new Error(
        `'${subgraphTag}' points to '${taggedVersion}' instead of '${newVersion}' - not deleting ${subgraphName}/${oldVersion}`
      );
    }
    await removeSubgraph(subgraphName, oldVersion);
  }

  setOutput("outcome", "promoted");
  console.log(
    `${subgraphName}/${newVersion} is indexed and tagged '${subgraphTag}'`,
    { oldVersion }
  );
}

main()
  .then(() => {
    console.log("OK");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
