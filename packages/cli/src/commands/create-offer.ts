import fs from "fs";
import { EnvironmentType, ConfigId } from "@bosonprotocol/common";
import { getEnvConfigById, CoreSDK } from "@bosonprotocol/core-sdk";
import { EthersAdapter } from "@bosonprotocol/ethers-sdk";
import { providers, Wallet } from "ethers";
import { Command } from "commander";

export const createOfferCommand = new Command("create-offer")
  .description("Create an Offer on the Boson Protocol.")
  .argument(
    "<privateKey>",
    "Private key of the Seller account (assistant role). Can also be set via SELLER_PRIVATE_KEY env var."
  )
  .argument(
    "<offerData>",
    "Path to a JSON file with the Offer parameters. Can also be set via OFFER_DATA env var."
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
  .action(async (privateKey: string, offerDataJsonFile: string, opts) => {
    const envName: string = opts.env || process.env.ENV_NAME || "testing";
    const configId: string =
      opts.configId || process.env.ENV_CONFIG_ID || "testing-80002-0";
    const resolvedPrivateKey: string =
      privateKey || process.env.SELLER_PRIVATE_KEY || "";
    const resolvedOfferDataFile: string =
      offerDataJsonFile || process.env.OFFER_DATA || "";

    const defaultConfig = getEnvConfigById(
      envName as EnvironmentType,
      configId as ConfigId
    );
    const chainId = defaultConfig.chainId;
    const rawData = fs.readFileSync(resolvedOfferDataFile);
    const offerDataJson = JSON.parse(rawData.toString());

    console.log(`Create Offer with Data ${JSON.stringify(offerDataJson)}`);

    const sellerWallet = new Wallet(resolvedPrivateKey);
    const coreSDK = CoreSDK.fromDefaultConfig({
      web3Lib: new EthersAdapter(
        new providers.JsonRpcProvider(defaultConfig.jsonRpcUrl),
        sellerWallet
      ),
      envName: envName as EnvironmentType,
      configId: configId as ConfigId
    });

    console.log(`Creating offer on env ${envName} on chain ${chainId}...`);
    const txResponse = await coreSDK.createOffer(offerDataJson);
    console.log(`Tx hash: ${txResponse.hash}`);
    const receipt = await txResponse.wait();
    const offerId = coreSDK.getCreatedOfferIdFromLogs(receipt.logs);
    console.log(`Offer with id ${offerId} created.`);
  });
