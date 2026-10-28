import fs from "fs";
import { EnvironmentType, ConfigId } from "@bosonprotocol/common";
import { getEnvConfigById, CoreSDK } from "@bosonprotocol/core-sdk";
import { EthersAdapter } from "@bosonprotocol/ethers-sdk";
import { providers, Wallet } from "ethers";
import { Command } from "commander";

export const createSellerCommand = new Command("create-seller")
  .description("Create a Seller on the Boson Protocol.")
  .argument(
    "<privateKey>",
    "Private key of the Seller account (assistant role). Can also be set via SELLER_PRIVATE_KEY env var."
  )
  .option("-d, --data <sellerData>", "JSON file with the Seller parameters")
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
  .action(async (privateKey: string, opts) => {
    const envName: string = opts.env || process.env.ENV_NAME || "testing";
    const configId: string =
      opts.configId || process.env.ENV_CONFIG_ID || "testing-80002-0";
    const resolvedPrivateKey: string =
      privateKey || process.env.SELLER_PRIVATE_KEY || "";

    const defaultConfig = getEnvConfigById(
      envName as EnvironmentType,
      configId as ConfigId
    );
    const chainId = defaultConfig.chainId;
    const sellerWallet = new Wallet(resolvedPrivateKey);

    let sellerDataJson;
    if (opts.data) {
      const rawData = fs.readFileSync(opts.data);
      sellerDataJson = JSON.parse(rawData.toString());
    } else {
      sellerDataJson = {
        assistant: sellerWallet.address,
        admin: sellerWallet.address,
        treasury: sellerWallet.address,
        contractUri: "",
        royaltyPercentage: "0",
        authTokenId: "0",
        authTokenType: "0",
        metadataUri: ""
      };
    }

    console.log(`Create Seller with Data ${JSON.stringify(sellerDataJson)}`);

    const coreSDK = CoreSDK.fromDefaultConfig({
      web3Lib: new EthersAdapter(
        new providers.JsonRpcProvider(defaultConfig.jsonRpcUrl),
        sellerWallet
      ),
      envName: envName as EnvironmentType,
      configId: configId as ConfigId
    });

    console.log(`Creating seller on env ${envName} on chain ${chainId}...`);
    const txResponse = await coreSDK.createSeller(sellerDataJson);
    console.log(`Tx hash: ${txResponse.hash}`);
    const receipt = await txResponse.wait();
    const sellerId = coreSDK.getCreatedSellerIdFromLogs(receipt.logs);
    console.log(`Seller with id ${sellerId} created.`);
  });
