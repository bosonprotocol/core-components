import { MetaTxConfig } from "@bosonprotocol/common";
import fs from "fs";
import { resolve } from "path";
import { program } from "commander";
import { Wallet, providers } from "ethers";
import {
  getEnvConfigById,
  EnvironmentType,
  CoreSDK
} from "../packages/core-sdk/src";
import { ExchangeState } from "../packages/core-sdk/src/subgraph";
import { EthersAdapter } from "../packages/ethers-sdk/src";

// TODO: read real value in the diamond (IBosonConfigHandler::getMaxExchangesPerBatch())
const MAX_EXCHANGES_PER_BATCH = 140;

const MAX_EXCHANGES_PER_SELLER = 1000;

program
  .description("Complete one or several exchanges.")
  .argument(
    "<PRIVATE_KEY>",
    "Private key of the account issuing the transaction."
  )
  .option("-e, --env <ENV_NAME>", "Target environment", "testing")
  .option("-c, --configId <CONFIG_ID>", "Config id", "testing-80002-0")
  .option(
    "-m, --metaTx <META_TX_CONFIG>",
    "JSON file with the meta tx parameters"
  )
  .option(
    "--exchanges <EXCHANGES>",
    "Comma separated list of exchanges to complete"
  )
  .option(
    "--sellerId <SELLER_ID>",
    "Id of the seller to complete all completable exchanges for"
  )
  .option("--dryRun", "do not send the transaction")
  .parse(process.argv);

async function main() {
  const [privateKey] = program.args;

  const opts = program.opts();
  const envName = (opts.env as EnvironmentType) || "testing";
  const configId = opts.configId || "testing-80002-0";
  const defaultConfig = getEnvConfigById(envName, configId);
  const wallet = new Wallet(privateKey);
  let metaTx: Partial<MetaTxConfig> | undefined = undefined;
  if (opts.metaTx) {
    //
    // JSON file example: see ./metaTx.example.json
    // Where:
    //  - <BICONOMY_API_KEY>: is the ApiKEy of the Biconomy Project
    //  - <DIAMOND_ADDRESS>: in the Boson Protocol diamond contract address in the targeted environment
    //  - <BICONOMY_API_ID> : is the ApiId for Boson Diamond "executeMetaTransaction" method
    //
    const rawMetaTx = fs.readFileSync(resolve(__dirname, opts.metaTx));
    metaTx = JSON.parse(rawMetaTx.toString());
  }
  const coreSDK = CoreSDK.fromDefaultConfig({
    web3Lib: new EthersAdapter(
      new providers.JsonRpcProvider(defaultConfig.jsonRpcUrl),
      wallet
    ),
    envName,
    metaTx,
    configId
  });
  if (opts.metaTx && !coreSDK.isMetaTxConfigSet) {
    throw `Invalid metaTx configuration:\n${JSON.stringify(metaTx)}`;
  }

  const exchangeIds = opts.exchanges
    ? (opts.exchanges as string).split(",")
    : [""];

  const exchanges = await coreSDK.getExchanges({
    exchangesFilter: {
      state_in: [ExchangeState.REDEEMED],
      id_in: exchangeIds
    }
  });
  let limitReached = false;
  if (opts.sellerId) {
    const sellerExchanges = await coreSDK.getExchanges({
      exchangesFirst: MAX_EXCHANGES_PER_SELLER,
      exchangesFilter: {
        seller: opts.sellerId as string,
        state_in: [ExchangeState.REDEEMED],
        id_not_in: exchangeIds
      }
    });
    limitReached = sellerExchanges.length === MAX_EXCHANGES_PER_SELLER;
    exchanges.push(...sellerExchanges);
  }
  const now = Math.floor(Date.now() / 1000);
  const exchangesToComplete = exchanges.filter(
    (e) =>
      parseInt(e.redeemedDate as string) +
        parseInt(e.offer.disputePeriodDuration) <
      now
  );
  console.log(
    `${
      exchangesToComplete.length
    } exchanges to complete:${exchangesToComplete.map(
      (e) =>
        `\n${e.id}:${e.state}:${new Date(
          1000 * parseInt(e.redeemedDate as string)
        ).toDateString()}:${new Date(
          1000 *
            (parseInt(e.redeemedDate as string) +
              parseInt(e.offer.disputePeriodDuration))
        ).toDateString()}`
    )}`
  );
  if (limitReached) {
    console.warn(
      `WARNING: Reached limit of ${MAX_EXCHANGES_PER_SELLER} exchanges for seller ${opts.sellerId}.\n` +
        `The script needs to be called again to complete all exchanges for this seller`
    );
  }
  let nbCompleted = 0;
  while (nbCompleted < exchangesToComplete.length) {
    const exchangesToCompleteIds = exchangesToComplete
      .slice(
        nbCompleted,
        nbCompleted +
          Math.min(
            MAX_EXCHANGES_PER_BATCH,
            exchangesToComplete.length - nbCompleted
          )
      )
      .map((e) => e.id);
    console.log("Nb exchanges in batch:", exchangesToCompleteIds.length);
    nbCompleted += exchangesToCompleteIds.length;
    if (opts.dryRun) {
      continue;
    }
    let tx;
    if (opts.metaTx && coreSDK.isMetaTxConfigSet) {
      console.log(`Preparing meta-transaction...`);
      const nonce = Date.now();
      const { functionName, functionSignature, r, s, v } =
        await coreSDK.signMetaTxCompleteExchangeBatch({
          exchangeIds: exchangesToCompleteIds,
          nonce
        });
      tx = await coreSDK.relayMetaTransaction({
        functionName,
        functionSignature,
        sigR: r,
        sigS: s,
        sigV: v,
        nonce
      });
      console.log(`Meta-transaction ${tx.hash} sent`);
    } else {
      console.log(`Preparing transaction...`);
      tx = await coreSDK.completeExchangeBatch(exchangesToCompleteIds);
      console.log(`Transaction ${tx.hash} sent`);
    }
    await tx.wait();
    console.log(`Transaction ${tx.hash} completed`);
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
