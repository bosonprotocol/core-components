import { EnvironmentType } from "@bosonprotocol/common/src/types/configs";
import { providers } from "ethers";
import { program } from "commander";
import { getEnvConfigById } from "@bosonprotocol/common/src";
import { CoreSDK } from "../packages/core-sdk/src";
import { EthersAdapter } from "../packages/ethers-sdk/src";

program
  .description("Get Buyers data from buyer Ids.")
  .argument("<BUYER_IDS>", "Comma-separated list of of seller Ids")
  .option("-e, --env <ENV_NAME>", "Target environment", "testing")
  .option("-c, --configId <CONFIG_ID>", "Config id", "testing-80001-0")
  .parse(process.argv);

async function main() {
  const [buyerIdsArg] = program.args;
  const buyerIds = buyerIdsArg.split(",");

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

  let result;
  if (buyerIds.length === 1) {
    result = await coreSDK.getBuyerById(buyerIds[0], { includeLogs: true });
  } else {
    result = await coreSDK.getBuyers({
      buyersFilter: { id_in: buyerIds },
      includeLogs: true
    });
  }
  console.log(result);
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
