import fs from "fs";
import { EnvironmentType } from "@bosonprotocol/common/src/types/configs";
import { providers, Wallet } from "ethers";
import { program } from "commander";
import { getEnvConfigById } from "@bosonprotocol/common/src";
import { CoreSDK } from "../packages/core-sdk/src";
import { EthersAdapter } from "../packages/ethers-sdk/src";

program
  .description("Create an Offer.")
  .argument(
    "<SELLER_PRIVATE_KEY>",
    "Private key of the Seller account (assistant role)."
  )
  .argument("<OFFER_DATA>", "JSON file with the Offer parameters")
  .option("-e, --env <ENV_NAME>", "Target environment", "testing")
  .option("-cid, --configId <CONFIG_ID>", "Config id", "testing-80001-0")
  .parse(process.argv);

async function main() {
  const [sellerPrivateKey, offerDataJsonFile] = program.args;

  const opts = program.opts();
  const envName = opts.env || "testing";
  const configId = opts.configId || "testing-80001-0";
  const defaultConfig = getEnvConfigById(envName as EnvironmentType, configId);
  const chainId = defaultConfig.chainId;
  const rawData = fs.readFileSync(offerDataJsonFile);
  const offerDataJson = JSON.parse(rawData.toString());

  console.log(`Create Offer with Data ${JSON.stringify(offerDataJson)}`);
  console.log("defaultConfig", defaultConfig);

  const sellerWallet = new Wallet(sellerPrivateKey);
  const coreSDK = CoreSDK.fromDefaultConfig({
    web3Lib: new EthersAdapter(
      new providers.JsonRpcProvider(defaultConfig.jsonRpcUrl),
      sellerWallet
    ),
    envName,
    configId
  });

  console.log(`Creating offer on env ${envName} on chain ${chainId}...`);
  const txResponse1 = await coreSDK.createOffer(offerDataJson);
  console.log(`Tx hash: ${txResponse1.hash}`);
  const receipt = await txResponse1.wait();
  const offerId = coreSDK.getCreatedOfferIdFromLogs(receipt.logs);
  console.log(`Offer with id ${offerId} created.`);
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
