import { EnvironmentType } from "@bosonprotocol/common/src/types/configs";
import { providers } from "ethers";
import { program } from "commander";
import { getEnvConfigById } from "@bosonprotocol/common/src";
import { CoreSDK } from "../packages/core-sdk/src";
import { EthersAdapter } from "../packages/ethers-sdk/src";
import rulesTesting from "../packages/core-sdk/tests/exchangePolicy/exchangePolicyRules.testing.json";
import rulesStaging from "../packages/core-sdk/tests/exchangePolicy/exchangePolicyRules.staging.json";
import rulesProduction from "../packages/core-sdk/tests/exchangePolicy/exchangePolicyRules.production.json";

const rules = {
  testing: rulesTesting,
  staging: rulesStaging,
  production: rulesProduction
};

program
  .description("Check Exchange policy of an Offer.")
  .argument("<OFFER_ID>", "Id of the offer to check")
  .option("-e, --env <ENV_NAME>", "Target environment", "testing")
  .option("-c, --configId <CONFIG_ID>", "Config id", "testing-80002-0")
  .parse(process.argv);

async function main() {
  const [offerId] = program.args;

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

  const result = await coreSDK.checkExchangePolicy(offerId, rules[envName]);
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
