import { spawn } from "child_process";
import { appendFileSync } from "fs";
import { EOL } from "os";
import path from "path";
import { Option } from "commander";

/**
 * The mutable tag every consumer queries: it points to the version currently served, and
 * is only moved onto a freshly deployed version once that version is fully indexed.
 */
export const subgraphTag = "latest";

const subgraphDir = path.join(__dirname, "..");
// `bin/goldsky` is a thin `require("../dist/index.js")` shim, so the CLI entry point can
// be run directly with the current node binary - which behaves the same way on win32.
const goldskyCli = require.resolve("@goldskycom/cli");

/** Deployed environments (Boson env + chain) the Goldsky scripts accept */
const deployEnvs = [
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
];

/** The `--env` option, shared by the deployment and the promotion scripts */
export function envOption(): Option {
  return new Option(
    "--env <ENV>",
    `Deployed environment (Boson env + chain): "testing_amoy", "testing_sepolia", ...`
  )
    .makeOptionMandatory(true)
    .choices(deployEnvs);
}

/**
 * Read the subgraph name and version out of the environment. Both are exposed by npm from
 * `packages/subgraph/package.json`, so these scripts must be run through an npm script.
 */
export function readSubgraphEnv(env: string): {
  subgraphName: string;
  subgraphVersion: string;
} {
  const requiredEnvVars = [
    "GOLDSKY_API_KEY", // should be set in GH pipeline from GH action secret depending on the env
    `npm_package_config_${env}`, // subgraphName
    "npm_package_version" // subgraphVersion
  ];
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing environment variable '${envVar}'`);
    }
  }
  return {
    subgraphName: process.env[`npm_package_config_${env}`] as string,
    subgraphVersion: process.env["npm_package_version"] as string
  };
}

/** Read a positive number out of the environment, falling back to `defaultValue` */
export function numberFromEnv(envVar: string, defaultValue: number): number {
  const value = Number(process.env[envVar] || defaultValue);
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(
      `Environment variable '${envVar}' must be a positive number`
    );
  }
  return value;
}

/**
 * Report a single-line value to the GitHub Actions step that runs this script, so that the
 * workflow can branch on it. A no-op outside of a workflow.
 */
export function setOutput(name: string, value: string): void {
  const outputFile = process.env["GITHUB_OUTPUT"];
  console.log(`${name}=${value}`);
  if (outputFile) {
    appendFileSync(outputFile, `${name}=${value}${EOL}`);
  }
}

export function sleep(ms: number): Promise<void> {
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
export async function goldsky(
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
export async function getTaggedVersion(
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

export type DeploymentStatus = {
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
export async function getDeploymentStatus(
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

/** A deployment Goldsky will never recover from on its own */
export function hasFailed(status: DeploymentStatus): boolean {
  return status.fatalError || status.health === "failed";
}
