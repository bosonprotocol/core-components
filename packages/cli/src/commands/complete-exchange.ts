import fs from "fs";
import { resolve } from "path";
import { EnvironmentType, ConfigId, MetaTxConfig } from "@bosonprotocol/common";
import { CoreSDK, getEnvConfigById, subgraph } from "@bosonprotocol/core-sdk";
import { EthersAdapter } from "@bosonprotocol/ethers-sdk";
import { Wallet, providers } from "ethers";
import { Command } from "commander";

// TODO: read real value from the diamond (IBosonConfigHandler::getMaxExchangesPerBatch())
const MAX_EXCHANGES_PER_BATCH = 140;
const MAX_EXCHANGES_PER_SELLER = 1000;

export const completeExchangeCommand = new Command("complete-exchange")
  .description(
    "Complete one or several exchanges that have passed their dispute period."
  )
  .argument(
    "<privateKey>",
    "Private key of the account issuing the transaction. Can also be set via PRIVATE_KEY env var."
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
  .option(
    "-m, --metaTx <metaTxConfig>",
    "Path to a JSON file with the meta-tx parameters (e.g. Biconomy config)"
  )
  .option(
    "--exchanges <exchanges>",
    "Comma-separated list of exchange IDs to complete"
  )
  .option(
    "--sellerId <sellerId>",
    "Id of the seller to complete all completable exchanges for"
  )
  .option("--dryRun", "Do not send the transaction, only list exchanges")
  .action(async (privateKey: string, opts) => {
    const envName: string = opts.env || process.env.ENV_NAME || "testing";
    const configId: string =
      opts.configId || process.env.ENV_CONFIG_ID || "testing-80002-0";
    const resolvedPrivateKey: string =
      privateKey || process.env.PRIVATE_KEY || "";

    const defaultConfig = getEnvConfigById(
      envName as EnvironmentType,
      configId as ConfigId
    );
    const wallet = new Wallet(resolvedPrivateKey);

    let metaTx: Partial<MetaTxConfig> | undefined = undefined;
    if (opts.metaTx) {
      const rawMetaTx = fs.readFileSync(resolve(process.cwd(), opts.metaTx));
      metaTx = JSON.parse(rawMetaTx.toString());
    }

    const coreSDK = CoreSDK.fromDefaultConfig({
      web3Lib: new EthersAdapter(
        new providers.JsonRpcProvider(defaultConfig.jsonRpcUrl),
        wallet
      ),
      envName: envName as EnvironmentType,
      metaTx,
      configId: configId as ConfigId
    });

    if (opts.metaTx && !coreSDK.isMetaTxConfigSet) {
      throw new Error(
        `Invalid metaTx configuration:\n${JSON.stringify(metaTx)}`
      );
    }

    const exchangeIds: string[] = opts.exchanges
      ? (opts.exchanges as string).split(",")
      : [];

    const exchanges = exchangeIds.length
      ? await coreSDK.getExchanges({
          exchangesFilter: {
            state_in: [subgraph.ExchangeState.REDEEMED],
            id_in: exchangeIds
          }
        })
      : [];

    let limitReached = false;
    if (opts.sellerId) {
      const sellerExchanges = await coreSDK.getExchanges({
        exchangesFirst: MAX_EXCHANGES_PER_SELLER,
        exchangesFilter: {
          seller: opts.sellerId as string,
          state_in: [subgraph.ExchangeState.REDEEMED],
          ...(exchangeIds.length ? { id_not_in: exchangeIds } : {})
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
      `${exchangesToComplete.length} exchanges to complete:${exchangesToComplete.map(
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
          `The command needs to be called again to complete all exchanges for this seller`
      );
    }

    let nbCompleted = 0;
    while (nbCompleted < exchangesToComplete.length) {
      const batchSize = Math.min(
        MAX_EXCHANGES_PER_BATCH,
        exchangesToComplete.length - nbCompleted
      );
      const exchangesToCompleteIds = exchangesToComplete
        .slice(nbCompleted, nbCompleted + batchSize)
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
  });
