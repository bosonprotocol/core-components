import fs from "fs";
import { EnvironmentType } from "@bosonprotocol/common/src/types/configs";
import { providers, Wallet } from "ethers";
import { program } from "commander";
import { getEnvConfigById } from "@bosonprotocol/common/src";
import { CoreSDK } from "../packages/core-sdk/src";
import { EthersAdapter } from "../packages/ethers-sdk/src";

const MAX_OFFERS_PER_BATCH = 10;

program
  .description("Create Offers (batch).")
  .argument(
    "<SELLER_PRIVATE_KEY>",
    "Private key of the Seller account (assistant role)."
  )
  .argument("<OFFER_DATA>", "JSON file with the Offers specific parameters")
  .option("-e, --env <ENV_NAME>", "Target environment", "testing")
  .option("-c, --configId <CONFIG_ID>", "Config id", "testing-80002-0")
  .option(
    "--template <TEMPLATE>",
    "JSON file with the Offers common parameters"
  )
  .parse(process.argv);

async function main() {
  const [sellerPrivateKey, offerDataJsonFile] = program.args;

  const opts = program.opts();
  const envName = opts.env || "testing";
  const configId = opts.configId || "testing-80002-0";
  const defaultConfig = getEnvConfigById(envName as EnvironmentType, configId);
  const chainId = defaultConfig.chainId;
  const offersRawData = fs.readFileSync(offerDataJsonFile);
  const offersDataJson = JSON.parse(offersRawData.toString());

  if (!Array.isArray(offersDataJson)) {
    throw `File '${offerDataJsonFile}' must define an array of offers`;
  }

  let offerTemplate = {};
  if (opts.template) {
    const templateRaw = fs.readFileSync(opts.template);
    offerTemplate = JSON.parse(templateRaw.toString());
  }

  const offersFullDataJson = offersDataJson.map((specData) => {
    const offerData = { ...offerTemplate, ...specData };
    if (offerData["validFromDateInMS"] === undefined) {
      offerData["validFromDateInMS"] = Date.now();
    }
    if (offerData["voucherRedeemableFromDateInMS"] === undefined) {
      offerData["voucherRedeemableFromDateInMS"] = Date.now();
    }
    return offerData;
  });

  console.log(`Create Offer with Data ${JSON.stringify(offersFullDataJson)}`);
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

  let done = 0;
  let batchOffers = offersFullDataJson.slice(
    done,
    done + Math.min(offersFullDataJson.length - done, MAX_OFFERS_PER_BATCH)
  );
  while (batchOffers.length > 0) {
    console.log(
      `Creating ${batchOffers.length} (${done}...${
        done + batchOffers.length - 1
      }/${
        offersFullDataJson.length
      }) offers on env ${envName} on chain ${chainId}...`
    );
    const txResponse1 = await coreSDK.createOfferBatch(batchOffers);
    console.log(`Tx hash: ${txResponse1.hash}`);
    const receipt = await txResponse1.wait();
    const offerId = coreSDK.getCreatedOfferIdFromLogs(receipt.logs);
    console.log(`Offer with id ${offerId} created.`);
    done += batchOffers.length;
    if (offersFullDataJson.length > done) {
      batchOffers = offersFullDataJson.slice(
        done,
        done + Math.min(offersFullDataJson.length - done, MAX_OFFERS_PER_BATCH)
      );
    } else {
      batchOffers = [];
    }
  }
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
