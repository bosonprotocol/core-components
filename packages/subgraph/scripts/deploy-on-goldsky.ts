import { spawn } from "child_process";
import path from "path";
import { Option, program } from "commander";

program
  .description(
    "Deploy the subgraph on Goldsky, move the 'latest' tag onto the new version and remove the previously tagged one"
  )
  .addOption(
    new Option(
      "--env <ENV>",
      `Deployed environment (Boson env + chain): "testing_amoy", "testing_sepolia", ...`
    )
      .makeOptionMandatory(true)
      .choices([
        "testing_amoy",
        "testing_sepolia",
        "testing_base",
        "testing_optimism",
        "testing_arbitrum",
        "staging_amoy",
        "staging_sepolia",
        "staging_base",
        "staging_optimism",
        "staging_arbitrum",
        "production_polygon",
        "production_ethereum",
        "production_base",
        "production_optimism",
        "production_arbitrum"
      ])
  )
  .parse(process.argv);

const { env } = program.opts();

const subgraphTag = "latest";
const subgraphDir = path.join(__dirname, "..");
// `bin/goldsky` is a thin `require("../dist/index.js")` shim, so the CLI entry point can
// be run directly with the current node binary - which behaves the same way on win32.
const goldskyCli = require.resolve("@goldskycom/cli");

const requiredEnvVars = [
  "GOLDSKY_API_KEY", // should be set in GH pipeline from GH action secret depending on the env
  `npm_package_config_${env}`, // subgraphName
  "npm_package_version" // newVersion
];

/**
 * Syncing a freshly deployed version can take several hours, so waiting for it is opt-in:
 * - unset (default): the 'latest' tag is moved onto the new version straight after the
 *   deployment, which is the quickest way to get a new version served.
 * - truthy: the 'latest' tag is only moved - and the previously tagged version only
 *   deleted - once the new version is fully synced and healthy. If it never gets there,
 *   the script fails and both the 'latest' tag and the old version are left untouched.
 */
const waitForSync = isTruthy(process.env["GOLDSKY_WAIT_FOR_SYNC"]);
const syncTimeoutMinutes = Number(
  process.env["GOLDSKY_SYNC_TIMEOUT_MINUTES"] || 300
);
const syncPollSeconds = Number(process.env["GOLDSKY_SYNC_POLL_SECONDS"] || 60);

function isTruthy(value: string | undefined): boolean {
  return ["true", "1", "yes", "on"].includes(
    (value || "").trim().toLowerCase()
  );
}

function checkEnvVars() {
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing environment variable '${envVar}'`);
    }
  }
  const numericEnvVars: [string, number][] = [
    ["GOLDSKY_SYNC_TIMEOUT_MINUTES", syncTimeoutMinutes],
    ["GOLDSKY_SYNC_POLL_SECONDS", syncPollSeconds]
  ];
  for (const [envVar, value] of numericEnvVars) {
    if (!Number.isFinite(value) || value <= 0) {
      throw new Error(
        `Environment variable '${envVar}' must be a positive number`
      );
    }
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Run the Goldsky CLI. The API key is passed with the global `--token` option so that no
 * credentials get persisted in `~/.goldsky/auth_token`, and colors are disabled so that
 * the captured output stays parsable.
 */
async function goldsky(
  args: string[],
  options: { capture?: boolean } = {}
): Promise<string> {
  const apiKey = process.env["GOLDSKY_API_KEY"] as string;
  console.log(`goldsky ${args.join(" ")}`);
  return new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [goldskyCli, ...args, "--token", apiKey, "--no-color"],
      {
        cwd: subgraphDir,
        stdio: ["ignore", options.capture ? "pipe" : "inherit", "inherit"]
      }
    );
    let stdout = "";
    child.stdout?.setEncoding("utf8");
    child.stdout?.on("data", (chunk: string) => {
      stdout += chunk;
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(
          new Error(`'goldsky ${args.join(" ")}' exited with code ${code}`)
        );
      }
    });
  });
}

/**
 * Ask Goldsky which version a tag currently points to. `goldsky subgraph list` prints one
 * line per tag, formatted as "* <subgraphName>/<tag> -> <subgraphName>/<targetVersion>".
 */
async function getTaggedVersion(
  subgraphName: string,
  tag: string
): Promise<string | undefined> {
  let stdout: string;
  try {
    stdout = await goldsky(
      ["subgraph", "list", subgraphName, "--filter", "tags", "--summary"],
      { capture: true }
    );
  } catch (e) {
    // Either the subgraph does not exist yet (first deployment on Goldsky), or the
    // listing failed. Either way we know of no previous version, which only means that
    // no old version will be deleted.
    console.warn(`Could not list the tags of '${subgraphName}'`, e);
    return undefined;
  }
  const pattern = new RegExp(
    `^\\*\\s+${escapeRegExp(`${subgraphName}/${tag}`)}\\s+->\\s+${escapeRegExp(
      subgraphName
    )}/(\\S+)\\s*$`,
    "m"
  );
  const version = stdout.match(pattern)?.[1];
  console.log(`getTaggedVersion(${subgraphName}, ${tag})`, { version });
  return version;
}

type DeploymentStatus = {
  health: string | undefined;
  synced: boolean;
  progress: string | undefined;
  fatalError: boolean;
};

/**
 * Read the indexing status of a deployed version out of `goldsky subgraph list`, which
 * prints "Status: <health>", "Synced: <check mark>|<percentage>%" and, when the
 * deployment failed, a "Fatal error:" line.
 */
async function getDeploymentStatus(
  subgraphName: string,
  subgraphVersion: string
): Promise<DeploymentStatus> {
  const stdout = await goldsky(
    ["subgraph", "list", `${subgraphName}/${subgraphVersion}`],
    { capture: true }
  );
  const health = stdout.match(/^\s*Status:\s*(\S+)/m)?.[1];
  const syncState = stdout.match(/^\s*Synced:\s*(.+?)\s*$/m)?.[1];
  const progress = syncState?.endsWith("%") ? syncState : undefined;
  const status = {
    health,
    // The CLI prints a check mark once Goldsky flags the deployment as synced, and the
    // indexing progress until then. That flag is not reliable - a fully indexed, healthy
    // deployment can sit at "100%" for weeks - so a reported 100% counts as synced too.
    // The CLI rounds the progress to 3 significant digits, so "100%" means ">= 99.95%".
    synced: !!syncState && (!progress || progress === "100%"),
    progress,
    fatalError: /^\s*Fatal error:/m.test(stdout)
  };
  console.log(
    `getDeploymentStatus(${subgraphName}, ${subgraphVersion})`,
    status
  );
  return status;
}

async function waitUntilSynced(
  subgraphName: string,
  subgraphVersion: string
): Promise<void> {
  console.log(
    `Waiting for ${subgraphName}/${subgraphVersion} to be synced (timeout: ${syncTimeoutMinutes} minutes)`
  );
  const deadline = Date.now() + syncTimeoutMinutes * 60 * 1000;
  for (;;) {
    let status: DeploymentStatus | undefined;
    try {
      status = await getDeploymentStatus(subgraphName, subgraphVersion);
    } catch (e) {
      // Goldsky may not report the deployment right after it has been created: keep
      // polling until the timeout rather than failing on a transient error.
      console.warn(
        `Could not read the status of ${subgraphName}/${subgraphVersion}`,
        e
      );
    }
    const { health, synced, progress, fatalError } = status || {
      health: undefined,
      synced: false,
      progress: undefined,
      fatalError: false
    };
    if (fatalError || health === "failed") {
      throw new Error(
        `${subgraphName}/${subgraphVersion} failed to index - the '${subgraphTag}' tag has not been moved`
      );
    }
    if (synced) {
      if (health !== "healthy") {
        throw new Error(
          `${subgraphName}/${subgraphVersion} is synced but not healthy (status: ${health}) - the '${subgraphTag}' tag has not been moved`
        );
      }
      console.log(`${subgraphName}/${subgraphVersion} is synced and healthy`);
      return;
    }
    if (Date.now() >= deadline) {
      throw new Error(
        `${subgraphName}/${subgraphVersion} is still not synced (${progress}) after ${syncTimeoutMinutes} minutes - the '${subgraphTag}' tag has not been moved`
      );
    }
    await sleep(syncPollSeconds * 1000);
  }
}

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
   * 1. get the version the "latest" tag currently points to - this has to be done before
   *    deploying, as moving the tag is what makes that information unrecoverable
   * 2. deploy the new version
   * 3. if GOLDSKY_WAIT_FOR_SYNC is set, wait for the new version to be synced and healthy
   * 4. move the "latest" tag onto the new version
   * 5. if the old version has been found (and is different from the new version), and the
   *    "latest" tag does point to the new version, delete the old version
   */
  checkEnvVars();
  const subgraphName = process.env[`npm_package_config_${env}`] as string;
  const newVersion = process.env["npm_package_version"] as string;

  const oldVersion = await getTaggedVersion(subgraphName, subgraphTag);

  await deploySubgraph(subgraphName, newVersion);

  if (waitForSync) {
    await waitUntilSynced(subgraphName, newVersion);
  } else {
    console.log(
      `Not waiting for ${subgraphName}/${newVersion} to be synced - set GOLDSKY_WAIT_FOR_SYNC=true to only tag and clean up once it is`
    );
  }

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

  console.log(
    `${subgraphName}/${newVersion} deployed and tagged '${subgraphTag}'`,
    { oldVersion, waitForSync }
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
