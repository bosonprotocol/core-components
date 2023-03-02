import { program } from "commander";
import { Wallet, providers } from "ethers";
import {
  getDefaultConfig,
  EnvironmentType,
  CoreSDK
} from "../packages/core-sdk/src";
import { ExchangeState } from "../packages/core-sdk/src/subgraph";
import { EthersAdapter } from "../packages/ethers-sdk/src";

// TODO: read real value in the diamond (IBosonConfigHandler::getMaxExchangesPerBatch())
const MAX_EXCHANGES_PER_BATCH = 140;

program
  .description("Complete one or several exchanges.")
  .argument(
    "<PRIVATE_KEY>",
    "Private key of the account issuing the transaction."
  )
  .option("-e, --env <ENV_NAME>", "Target environment", "testing")
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
  .parse(process.argv);

async function main() {
  const [privateKey] = program.args;

  const opts = program.opts();
  const envName = (opts.env as EnvironmentType) || "testing";
  const defaultConfig = getDefaultConfig(envName);
  const wallet = new Wallet(privateKey);
  const coreSDK = CoreSDK.fromDefaultConfig({
    web3Lib: new EthersAdapter(
      new providers.JsonRpcProvider(defaultConfig.jsonRpcUrl),
      wallet
    ),
    envName
  });
  const exchangeIds = opts.exchanges
    ? (opts.exchanges as string).split(",")
    : [];

  const exchanges = await coreSDK.getExchanges({
    exchangesFilter: {
      state_in: [ExchangeState.Redeemed],
      id_in: exchangeIds
    }
  });
  if (opts.sellerId) {
    exchanges.push(
      ...(await coreSDK.getExchanges({
        exchangesFirst: 1000,
        exchangesFilter: {
          seller: opts.sellerId as string,
          state_in: [ExchangeState.Redeemed],
          id_not_in: exchangeIds
        }
      }))
    );
  }
  const now = Math.floor(Date.now() / 1000);
  console.log("Now", now);
  const exchangesToComplete = exchanges.filter(
    (e) =>
      parseInt(e.redeemedDate as string) +
        parseInt(e.offer.disputePeriodDuration) <
      now
  );
  console.log(
    `Exchanges to complete:${exchangesToComplete.map(
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
  console.log("Nb exchanges to complete:", exchangesToComplete.length);
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
    const tx = await coreSDK.completeExchangeBatch(exchangesToCompleteIds);
    console.log(`Transaction ${tx.hash} sent`);
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
