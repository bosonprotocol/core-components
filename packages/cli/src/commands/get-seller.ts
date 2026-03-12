import { Command } from "commander";
import { buildReadOnlyCoreSDK, getEnvName, getConfigId } from "../utils";

export const getSellerCommand = new Command("get-seller")
  .description("Get a Seller by address from the Boson Protocol.")
  .argument(
    "<address>",
    "Address of the Seller to look up. Can also be set via SELLER_ADDRESS env var."
  )
  .option(
    "-e, --env <envName>",
    "Target environment (testing|staging|production). Overrides ENV_NAME env var.",
    "testing"
  )
  .option(
    "-c, --configId <configId>",
    "Config id. Overrides ENV_CONFIG_ID env var.",
    "testing-80002-0"
  )
  .action(async (address: string, opts) => {
    const envName = getEnvName(opts);
    const configId = getConfigId(opts);
    const resolvedAddress = address || process.env.SELLER_ADDRESS || "";

    const coreSDK = buildReadOnlyCoreSDK(envName, configId);
    const seller = await coreSDK.getSellersByAddress(resolvedAddress);
    console.log(`Seller: ${JSON.stringify(seller)}`);
  });
