import { Option } from "commander";

/** Deployed environments (Boson env + chain) the deployment scripts accept */
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

/**
 * The `--env` option, shared by every script that acts on a deployed environment - the
 * Goldsky deployment and promotion, and the Ormi post-deployment. A fresh `Option` is
 * returned on every call, as commander binds one to the program it is added to.
 */
export function envOption(): Option {
  return new Option(
    "--env <ENV>",
    `Deployed environment (Boson env + chain): "testing_amoy", "testing_sepolia", ...`
  )
    .makeOptionMandatory(true)
    .choices(deployEnvs);
}
