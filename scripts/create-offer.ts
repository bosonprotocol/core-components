import fs from "fs";
import { EnvironmentType } from "@bosonprotocol/common/src/types/configs";
import { providers, Wallet } from "ethers";
import { program } from "commander";
import { getEnvConfigById } from "@bosonprotocol/common/src";
import { CoreSDK } from "../packages/core-sdk/src";
import { EthersAdapter } from "../packages/ethers-sdk/src";
import { BaseIpfsStorage } from "../packages/ipfs-storage/src/ipfs/base";

const ONE_MONTH_FROM_NOW = () => {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  return date.getTime();
};

/**
 * Read an "until" date from the offer JSON. `0` is the protocol's "not set"
 * sentinel - `voucherRedeemableUntilDateInMS` is 0 whenever the offer uses
 * `voucherValidDurationInMS` instead - so it is left alone rather than treated
 * as a date in the past.
 */
const normalizeUntilDate = (value: unknown): number | undefined => {
  if (value === undefined || value === null) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed !== 0 ? parsed : undefined;
};

program
  .description("Create an Offer.")
  .argument(
    "<SELLER_PRIVATE_KEY>",
    "Private key of the Seller account (assistant role)."
  )
  .argument("<OFFER_DATA>", "JSON file with the Offer parameters")
  .option("-e, --env <ENV_NAME>", "Target environment", "testing")
  .option("-c, --configId <CONFIG_ID>", "Config id", "testing-11155111-0")
  .option("--metadata <FILEPATH>", "Metadata file to upload to IPFS")
  .option(
    "--pinata <PINATA_JWT>",
    "JWT required to address Pinata IPFS gateway"
  )
  .parse(process.argv);

async function main() {
  const [sellerPrivateKey, offerDataJsonFile] = program.args;

  const opts = program.opts();
  const envName = opts.env || "testing";
  const configId = opts.configId || "testing-11155111-0";
  const metadataFilePath = opts.metadata as string | undefined;
  const pinataJwt = opts.pinata as string | undefined;
  const defaultConfig = getEnvConfigById(envName as EnvironmentType, configId);
  const chainId = defaultConfig.chainId;
  const rawData = fs.readFileSync(offerDataJsonFile);
  const offerDataJson = JSON.parse(rawData.toString());

  const now = Date.now();
  const validUntilDateInMS = normalizeUntilDate(
    offerDataJson.validUntilDateInMS
  );
  if (validUntilDateInMS !== undefined && validUntilDateInMS < now) {
    offerDataJson.validUntilDateInMS = ONE_MONTH_FROM_NOW();
  }

  const voucherRedeemableUntilDateInMS = normalizeUntilDate(
    offerDataJson.voucherRedeemableUntilDateInMS
  );
  if (
    voucherRedeemableUntilDateInMS !== undefined &&
    voucherRedeemableUntilDateInMS < now
  ) {
    offerDataJson.voucherRedeemableUntilDateInMS = ONE_MONTH_FROM_NOW();
  }

  // voucherRedeemableUntilDateInMS has to be at or after validUntilDateInMS, on
  // chain and in the SDK's own offer validation. Bumping the two dates
  // independently above can turn a consistent pair into one that is not, so
  // re-align them here rather than reverting on chain after the metadata has
  // already been uploaded and paid for.
  const normalizedValidUntil = normalizeUntilDate(
    offerDataJson.validUntilDateInMS
  );
  const normalizedRedeemableUntil = normalizeUntilDate(
    offerDataJson.voucherRedeemableUntilDateInMS
  );
  if (
    normalizedValidUntil !== undefined &&
    normalizedRedeemableUntil !== undefined &&
    normalizedRedeemableUntil < normalizedValidUntil
  ) {
    console.warn(
      `voucherRedeemableUntilDateInMS (${normalizedRedeemableUntil}) is before validUntilDateInMS (${normalizedValidUntil}); raising it to match`
    );
    offerDataJson.voucherRedeemableUntilDateInMS = normalizedValidUntil;
  }

  if (metadataFilePath) {
    console.log(`Uploading metadata file ${metadataFilePath} to IPFS...`);
    const storage = new BaseIpfsStorage({
      url: pinataJwt
        ? "https://uploads.pinata.cloud/v3/files"
        : defaultConfig.ipfsMetadataUrl,
      headers: pinataJwt ? { Authorization: `Bearer ${pinataJwt}` } : undefined
    });

    const metadataRawData = fs.readFileSync(metadataFilePath);
    const metadataHash = await storage.add(metadataRawData);
    offerDataJson.metadataHash = metadataHash;
    offerDataJson.metadataUri = `ipfs://${metadataHash}`;
    console.log(`Uploaded metadata CID: ${metadataHash}`);
  }

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
