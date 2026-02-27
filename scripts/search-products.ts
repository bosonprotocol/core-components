import { EnvironmentType } from "@bosonprotocol/common/src/types/configs";
import { providers } from "ethers";
import { program } from "commander";
import { getEnvConfigById } from "@bosonprotocol/common/src";
import { CoreSDK } from "../packages/core-sdk/src";
import { EthersAdapter } from "../packages/ethers-sdk/src";

program
  .description("Search for products.")
  .argument(
    "<KEYWORDS>",
    "Comma-separated list of keywords to search for in product metadata"
  )
  .option("-e, --env <ENV_NAME>", "Target environment", "testing")
  .option("-c, --configId <CONFIG_ID>", "Config id", "testing-80002-0")
  .parse(process.argv);

async function main() {
  const [keywordsArg] = program.args;
  if (!keywordsArg) {
    console.error(
      "Error: KEYWORDS argument is required. Provide a comma-separated list of keywords."
    );
    process.exit(1);
  }
  const keywords = keywordsArg.split(",");

  const opts = program.opts();
  const envName = opts.env || "testing";
  const configId = opts.configId || "testing-80002-0";
  const defaultConfig = getEnvConfigById(envName as EnvironmentType, configId);

  const coreSDK = CoreSDK.fromDefaultConfig({
    web3Lib: new EthersAdapter(
      new providers.JsonRpcProvider(defaultConfig.jsonRpcUrl)
    ),
    envName,
    configId
  });

  const result = await coreSDK.searchProducts(keywords);
  console.log(`Found ${result.length} products:`);
  result.forEach((product, index) => {
    console.log(`${index + 1}. ${product.title}`);
  });
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
