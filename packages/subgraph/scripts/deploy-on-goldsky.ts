import { program } from "commander";
import {
  DeploymentStatus,
  envOption,
  getDeploymentStatus,
  goldsky,
  hasFailed,
  numberFromEnv,
  readSubgraphEnv,
  setOutput,
  sleep,
  subgraphTag
} from "./goldsky";

program
  .description(
    "Deploy the subgraph on Goldsky and watch its indexing status long enough to catch a deployment that fails straight away. Fully indexing a version can take several hours, so this script does not wait for it: moving the '" +
      subgraphTag +
      "' tag onto the new version - and deleting the previously tagged one - is left to 'promote-on-goldsky.ts', which a separate job runs once this one has succeeded."
  )
  .addOption(envOption())
  .parse(process.argv);

const { env } = program.opts();

async function deploySubgraph(subgraphName: string, subgraphVersion: string) {
  // `goldsky subgraph deploy` uploads the ./build directory, it does not build anything
  await goldsky([
    "subgraph",
    "deploy",
    `${subgraphName}/${subgraphVersion}`,
    "--path",
    "."
  ]);
}

/**
 * Poll the indexing status of a freshly deployed version for `watchMinutes`, so that a
 * deployment which cannot index at all - a bad manifest, a broken handler - fails the
 * deployment job rather than a watching job hours later. Returning without an error only
 * means that nothing has gone wrong yet, not that the version is indexed.
 */
async function watchForFatalError(
  subgraphName: string,
  subgraphVersion: string,
  watchMinutes: number,
  pollSeconds: number
): Promise<void> {
  console.log(
    `Watching the indexing status of ${subgraphName}/${subgraphVersion} for ${watchMinutes} minutes`
  );
  const deadline = Date.now() + watchMinutes * 60 * 1000;
  for (;;) {
    let status: DeploymentStatus | undefined;
    try {
      status = await getDeploymentStatus(subgraphName, subgraphVersion);
    } catch (e) {
      // Goldsky may not report the deployment right after it has been created: keep
      // polling until the deadline rather than failing on a transient error.
      console.warn(
        `Could not read the status of ${subgraphName}/${subgraphVersion}`,
        e
      );
    }
    if (status && hasFailed(status)) {
      throw new Error(
        `${subgraphName}/${subgraphVersion} failed to index - the '${subgraphTag}' tag has not been moved`
      );
    }
    if (status?.synced) {
      console.log(
        `${subgraphName}/${subgraphVersion} is already synced (status: ${status.health})`
      );
      return;
    }
    if (Date.now() >= deadline) {
      console.log(
        `${subgraphName}/${subgraphVersion} has not hit any fatal error in ${watchMinutes} minutes and is still indexing (${status?.progress}) - leaving the '${subgraphTag}' tag on the version currently served`
      );
      return;
    }
    await sleep(pollSeconds * 1000);
  }
}

async function main() {
  /**
   * 1. deploy the new version - the "latest" tag keeps pointing to the version currently
   *    served, so the API stays on it while the new one indexes
   * 2. watch the indexing status for a few minutes to catch a deployment that fails
   *    straight away, then hand over to 'promote-on-goldsky.ts'
   */
  const watchMinutes = numberFromEnv("GOLDSKY_FATAL_ERROR_WATCH_MINUTES", 5);
  const pollSeconds = numberFromEnv("GOLDSKY_FATAL_ERROR_POLL_SECONDS", 30);
  const { subgraphName, subgraphVersion } = readSubgraphEnv(env);

  await deploySubgraph(subgraphName, subgraphVersion);

  await watchForFatalError(
    subgraphName,
    subgraphVersion,
    watchMinutes,
    pollSeconds
  );

  // The workflow hands this over to the 'Promote deployed subgraphs' schedule, which tags
  // the version '<subgraphTag>' once it is indexed
  setOutput("version", subgraphVersion);
  console.log(
    `${subgraphName}/${subgraphVersion} deployed and indexing - run 'promote-on-goldsky.ts' to tag it '${subgraphTag}' once it is synced`
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
