import fs from "fs";
import { AddressZero } from "@ethersproject/constants";
import {
  EnvironmentType,
  ConfigId,
  UpdateSellerArgs,
  abis,
  TransactionResponse
} from "@bosonprotocol/common";
import { getEnvConfigById, CoreSDK } from "@bosonprotocol/core-sdk";
import { EthersAdapter } from "@bosonprotocol/ethers-sdk";
import { providers, Contract, Wallet } from "ethers";
import { Command } from "commander";
import { extractSellerData } from "../utils/account";

export const updateSellerCommand = new Command("update-seller")
  .description("Update a Seller on the Boson Protocol.")
  .argument(
    "<privateKey>",
    "Private key of the Seller account (admin role). Can also be set via SELLER_PRIVATE_KEY env var."
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
  .option("--id <sellerId>", "Seller ID")
  .option("--admin <admin>", "New admin address")
  .option("--treasury <treasury>", "New treasury address")
  .option("--assistant <assistant>", "New assistant address")
  .option("--authTokenId <authTokenId>", "New Auth Token Id")
  .option("--authTokenType <authTokenType>", "New Auth Token Type")
  .option("--metadataUri <metadataUri>", "New metadata URI")
  .option(
    "--privateKeys <privateKeys>",
    "Comma-separated list of private keys used for opting in the update"
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
    const web3Provider = new providers.JsonRpcProvider(
      defaultConfig.jsonRpcUrl
    );
    const sellerWallet = new Wallet(resolvedPrivateKey);

    let sellerDataJson = {} as UpdateSellerArgs;
    if (opts.data) {
      const rawData = fs.readFileSync(opts.data);
      sellerDataJson = JSON.parse(rawData.toString());
    }

    const sellerId = opts.id || sellerDataJson.id;
    if (sellerId === undefined) {
      throw new Error("Seller ID is required");
    }

    const optInSigners = new Map<
      string,
      {
        sdk: CoreSDK;
        fields: {
          admin: boolean;
          assistant: boolean;
          authToken: boolean;
        };
      }
    >();

    if (opts.privateKeys) {
      const defaultFields = {
        admin: false,
        assistant: false,
        authToken: false
      };
      (opts.privateKeys as string).split(",").forEach((privKey: string) => {
        const wallet = new Wallet(privKey.trim());
        const sdk = CoreSDK.fromDefaultConfig({
          web3Lib: new EthersAdapter(
            new providers.JsonRpcProvider(defaultConfig.jsonRpcUrl),
            wallet
          ),
          envName: envName as EnvironmentType,
          configId: configId as ConfigId
        });
        optInSigners.set(wallet.address.toLowerCase(), {
          sdk,
          fields: { ...defaultFields }
        });
      });
    }

    const accountAbi = abis.IBosonAccountHandlerABI;
    const accountHandler = new Contract(
      defaultConfig.contracts.protocolDiamond,
      accountAbi,
      web3Provider
    );
    const sellerDataRaw = await accountHandler.getSeller(sellerId);
    const sellerData = extractSellerData(sellerDataRaw);

    console.log("Current Seller data", JSON.stringify(sellerData));

    sellerDataJson = {
      id: opts.id || sellerDataJson.id,
      assistant:
        opts.assistant ||
        sellerDataJson.assistant ||
        sellerData.seller.assistant,
      admin: opts.admin || sellerDataJson.admin || sellerData.seller.admin,
      treasury:
        opts.treasury || sellerDataJson.treasury || sellerData.seller.treasury,
      authTokenId:
        opts.authTokenId ||
        sellerDataJson.authTokenId ||
        sellerData.authToken.tokenId,
      authTokenType:
        opts.authTokenType ||
        sellerDataJson.authTokenType ||
        sellerData.authToken.tokenType,
      metadataUri:
        opts.metadataUri ||
        sellerDataJson.metadataUri ||
        sellerData.seller.metadataUri
    };

    let modif = false;
    for (const key of ["assistant", "treasury", "admin"]) {
      if (sellerDataJson[key] !== sellerData.seller[key]) {
        modif = true;
        break;
      }
    }
    modif =
      modif ||
      sellerDataJson.authTokenId !== sellerData.authToken.tokenId ||
      sellerDataJson.authTokenType !== sellerData.authToken.tokenType ||
      sellerDataJson.metadataUri !== sellerData.seller.metadataUri;

    if (!modif) {
      throw new Error("No updated value specified");
    }

    console.log(`Update Seller with Data ${JSON.stringify(sellerDataJson)}`);

    const coreSDK = CoreSDK.fromDefaultConfig({
      web3Lib: new EthersAdapter(
        new providers.JsonRpcProvider(defaultConfig.jsonRpcUrl),
        sellerWallet
      ),
      envName: envName as EnvironmentType,
      configId: configId as ConfigId
    });

    console.log(`Updating seller on env ${envName} on chain ${chainId}...`);
    const txResponse1 = await coreSDK.updateSellerAndOptIn(sellerDataJson);
    console.log(`Tx hash: ${txResponse1.hash}`);
    const txReceipt1 = await txResponse1.wait();
    const pendingSellerUpdate = coreSDK.getPendingSellerUpdateFromLogs(
      txReceipt1.logs
    );
    let updateComplete = true;
    console.log(
      `Pending Seller Updates: ${JSON.stringify(pendingSellerUpdate)}`
    );
    for (const key of ["assistant", "admin", "tokenType"]) {
      if (
        pendingSellerUpdate[key] &&
        pendingSellerUpdate[key] !== AddressZero
      ) {
        const address = (pendingSellerUpdate[key] as string).toLowerCase();
        // Map contract key "tokenType" to the fieldsToUpdate key "authToken"
        const fieldKey = key === "tokenType" ? "authToken" : key;
        if (optInSigners.has(address)) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          optInSigners.get(address)!.fields[fieldKey] = true;
        } else {
          console.warn(
            `No private key found to optIn for account ${address}. Update won't be complete`
          );
          updateComplete = false;
        }
      }
    }
    const txOptIns: TransactionResponse[] = [];
    for (const [account, optInSigner] of optInSigners.entries()) {
      if (
        optInSigner.fields.admin ||
        optInSigner.fields.assistant ||
        optInSigner.fields.authToken
      ) {
        console.log(
          `OptIn with account ${account} for fields ${JSON.stringify(
            optInSigner.fields
          )}`
        );
        txOptIns.push(
          await optInSigner.sdk.optInToSellerUpdate({
            id: sellerDataJson.id,
            fieldsToUpdate: optInSigner.fields
          })
        );
      }
    }
    await Promise.all(txOptIns.map((txOptIn) => txOptIn.wait()));
    if (updateComplete) {
      console.log(`Seller with id ${sellerId} updated.`);
    } else {
      console.warn(
        `Seller with id ${sellerId} incomplete (you need to opt in for some accounts).`
      );
    }
  });
