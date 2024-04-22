import fs from "fs";
import { EnvironmentType } from "@bosonprotocol/common/src/types/configs";
import { providers, Wallet } from "ethers";
import { program } from "commander";
import { getEnvConfigById } from "@bosonprotocol/common/src";
import { CoreSDK, offers } from "../packages/core-sdk/src";
import { EthersAdapter } from "../packages/ethers-sdk/src";

program
  .description("Create a Price Discovery Offer.")
  .argument(
    "<SELLER_PRIVATE_KEY>",
    "Private key of the Seller account (assistant role)."
  )
  .argument("<OFFER_DATA>", "JSON file with the Offer parameters")
  .option("-e, --env <ENV_NAME>", "Target environment", "testing")
  .option("-c, --configId <CONFIG_ID>", "Config id", "testing-80002-0")
  .parse(process.argv);

async function main() {
  const [sellerPrivateKey, offerDataJsonFile] = program.args;

  const opts = program.opts();
  const envName = opts.env || "testing";
  const configId = opts.configId || "testing-80002-0";
  const defaultConfig = getEnvConfigById(envName as EnvironmentType, configId);
  const chainId = defaultConfig.chainId;
  const rawData = fs.readFileSync(offerDataJsonFile);
  const offerDataJson = JSON.parse(
    rawData.toString()
  ) as offers.CreateOfferArgs;
  if (offerDataJson["validFromDateInMS"] === undefined) {
    offerDataJson["validFromDateInMS"] = Date.now();
  }
  if (offerDataJson["voucherRedeemableFromDateInMS"] === undefined) {
    offerDataJson["voucherRedeemableFromDateInMS"] = Date.now();
  }
  const WETH_ADDRESS = (defaultConfig.defaultTokens || []).find(
    (t) => t.symbol === "WETH"
  )?.address;

  console.log(`Create Offer with Data ${JSON.stringify(offerDataJson)}`);
  console.log("defaultConfig", defaultConfig);
  if (
    offerDataJson.exchangeToken.toLowerCase() !== WETH_ADDRESS?.toLowerCase()
  ) {
    throw new Error(
      `Exchange Token must be Wrapped Native Currency ${WETH_ADDRESS} for Price Discovery offers (Opensea req)`
    );
  }

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
  let txResponse1 = await coreSDK.createOffer(offerDataJson).catch((error) => {
    console.error(coreSDK.parseError(error));
    process.exit(1);
  });
  console.log(`Tx hash: ${txResponse1.hash}`);
  const receipt = await txResponse1.wait();
  const offerId = coreSDK.getCreatedOfferIdFromLogs(receipt.logs) as string;
  console.log(`Offer with id ${offerId} created.`);
  await coreSDK.waitForGraphNodeIndexing(receipt);
  console.log(`Reserve Range.`);
  txResponse1 = await coreSDK.reserveRange(
    offerId,
    offerDataJson.quantityAvailable,
    "seller"
  );
  console.log(`Tx hash: ${txResponse1.hash}`);
  await txResponse1.wait(3);
  console.log(`Premint ${offerDataJson.quantityAvailable} vouchers.`);
  txResponse1 = await coreSDK.preMint(offerId, offerDataJson.quantityAvailable);
  console.log(`Tx hash: ${txResponse1.hash}`);
  await coreSDK.waitForGraphNodeIndexing(txResponse1);
  const offer = await coreSDK.getOfferById(offerId);
  const rangeStartEx = offer.range?.start as string;
  const rangeStartTokenId = coreSDK.getExchangeTokenId(rangeStartEx, offerId);
  const rangeEndEx = offer.range?.end as string;
  const rangeEndTokenId = coreSDK.getExchangeTokenId(rangeEndEx, offerId);
  console.log(
    "Voucher rNFT Contract: ",
    offer.collection.collectionContract.address
  );
  console.log(
    `Preminted Tokens: ${rangeStartTokenId.toString()} --> ${rangeEndTokenId.toString()}`
  );
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
