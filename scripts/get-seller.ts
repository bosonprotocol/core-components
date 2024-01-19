import fs from "fs";
import { EnvironmentType } from "@bosonprotocol/common/src/types/configs";
import { providers, Contract, Wallet } from "ethers";
import { program } from "commander";
import { getEnvConfigById } from "@bosonprotocol/common/src";
import { CoreSDK } from "../packages/core-sdk/src";
import { EthersAdapter } from "../packages/ethers-sdk/src";

program
  .description("Get a Seller.")
  .argument("<SELLER_ADDRESS>", "Address of the Seller to look after.")
  .option("-e, --env <ENV_NAME>", "Target environment", "testing")
  .option("-c, --configId <CONFIG_ID>", "Config id", "testing-80001-0")
  .parse(process.argv);

async function main() {
  const [sellerAddress] = program.args;

  const opts = program.opts();
  const envName = opts.env || "testing";
  const configId = opts.configId || "testing-80001-0";
  const defaultConfig = getEnvConfigById(envName as EnvironmentType, configId);

  const coreSDK = CoreSDK.fromDefaultConfig({
    web3Lib: new EthersAdapter(
      new providers.JsonRpcProvider(defaultConfig.jsonRpcUrl)
    ),
    envName,
    configId
  });

  const seller = await coreSDK.getSellersByAddress(sellerAddress);
  console.log(`Seller: ${JSON.stringify(seller)}`);
}

main()
  .then(() => {
    console.log("success");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
