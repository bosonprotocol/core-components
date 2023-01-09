import { AddressZero } from "@ethersproject/constants";
import fs from "fs";
import { EnvironmentType } from "@bosonprotocol/common/src/types/configs";
import { providers, Contract, Wallet } from "ethers";
import { program } from "commander";
import { getDefaultConfig, UpdateSellerArgs } from "@bosonprotocol/common/src";
import { CoreSDK } from "../packages/core-sdk/src";
import { EthersAdapter } from "../packages/ethers-sdk/src";
import { abis, TransactionResponse } from "@bosonprotocol/common";
import { extractSellerData } from "./utils/account";

program
  .description("Update a Seller.")
  .argument(
    "<SELLER_PRIVATE_KEY>",
    "Private key of the Seller account (admin role)."
  )
  .option("-d, --data <SELLER_DATA>", "JSON file with the Seller parameters")
  .option("-e, --env <ENV_NAME>", "Target environment", "testing")
  .option("--id <SELLER_ID>", "SellerId")
  .option("--admin <ADMIN>", "New admin address")
  .option("--treasury <TREASURY>", "New treasury address")
  .option("--clerk <CLERK>", "New clerk address")
  .option("--operator <OPERATOR>", "New operator address")
  .option("--authTokenId <AUTH_TOKEN_ID>", "New Auth Token Id")
  .option("--authTokenType <AUTH_TOKEN_TYPE>", "New Auth Token Type")
  .option(
    "--privateKeys <PRIVATE_KEYS>",
    "Comma-separated list of private keys used for opting in the update"
  )
  .parse(process.argv);

async function main() {
  const [sellerPrivateKey] = program.args;

  const opts = program.opts();
  const envName = opts.env || "testing";
  const defaultConfig = getDefaultConfig(envName as EnvironmentType);
  const chainId = defaultConfig.chainId;
  const web3Provider = new providers.JsonRpcProvider(defaultConfig.jsonRpcUrl);
  const sellerWallet = new Wallet(sellerPrivateKey);

  let sellerDataJson = {} as UpdateSellerArgs;
  if (opts.data) {
    const rawData = fs.readFileSync(opts.data);
    sellerDataJson = JSON.parse(rawData.toString());
  }
  const sellerId = opts.id || sellerDataJson.id;
  if (sellerId === undefined) {
    throw `Seller ID is required`;
  }

  const optInSigners = new Map<
    string,
    {
      sdk: CoreSDK;
      fields: {
        admin: boolean;
        operator: boolean;
        clerk: boolean;
        authToken: boolean;
      };
    }
  >();
  if (opts.privateKeys) {
    const defaultFields = {
      admin: false,
      operator: false,
      clerk: false,
      authToken: false
    };
    (opts.privateKeys as string).split(",").forEach((privKey) => {
      const wallet = new Wallet(privKey);
      const sdk = CoreSDK.fromDefaultConfig({
        web3Lib: new EthersAdapter(
          new providers.JsonRpcProvider(defaultConfig.jsonRpcUrl),
          wallet
        ),
        envName
      });
      optInSigners.set(wallet.address.toLowerCase(), {
        sdk,
        fields: { ...defaultFields } // clone the structure
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

  console.log("defaultConfig", defaultConfig);

  console.log("current Seller data", JSON.stringify(sellerData));

  sellerDataJson = {
    id: opts.id || sellerDataJson.id,
    operator:
      opts.operator || sellerDataJson.operator || sellerData.seller.operator,
    admin: opts.admin || sellerDataJson.admin || sellerData.seller.admin,
    clerk: opts.clerk || sellerDataJson.clerk || sellerData.seller.clerk,
    treasury:
      opts.treasury || sellerDataJson.treasury || sellerData.seller.treasury,
    authTokenId:
      opts.authTokenId ||
      sellerDataJson.authTokenId ||
      sellerData.authToken.tokenId,
    authTokenType:
      opts.authTokenType ||
      sellerDataJson.authTokenType ||
      sellerData.authToken.tokenType
  };

  let modif = false;
  for (const key of ["operator", "clerk", "treasury", "admin"]) {
    if (sellerDataJson[key] !== sellerData.seller[key]) {
      modif = true;
      break;
    }
  }
  modif =
    modif ||
    sellerDataJson.authTokenId !== sellerData.authToken.tokenId ||
    sellerDataJson.authTokenType !== sellerData.authToken.tokenType;

  if (!modif) {
    throw `No updated value specified`;
  }

  console.log(`Update Seller with Data ${JSON.stringify(sellerDataJson)}`);

  const coreSDK = CoreSDK.fromDefaultConfig({
    web3Lib: new EthersAdapter(
      new providers.JsonRpcProvider(defaultConfig.jsonRpcUrl),
      sellerWallet
    ),
    envName
  });

  console.log(`Updating seller on env ${envName} on chain ${chainId}...`);
  const txResponse1 = await coreSDK.updateSellerAndOptIn(sellerDataJson);
  console.log(`Tx hash: ${txResponse1.hash}`);
  const txReceipt1 = await txResponse1.wait();
  const pendingSellerUpdate = coreSDK.getPendingSellerUpdateFromLogs(
    txReceipt1.logs
  );
  let updateComplete = true;
  console.log(`Pending Seller Updates: ${JSON.stringify(pendingSellerUpdate)}`);
  for (const key of ["operator", "clerk", "admin", "tokenType"]) {
    if (pendingSellerUpdate[key] && pendingSellerUpdate[key] !== AddressZero) {
      const address = pendingSellerUpdate[key].toLowerCase();
      if (optInSigners.has(address)) {
        (optInSigners.get(address) as any).fields[key] = true;
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
      optInSigner.fields.operator ||
      optInSigner.fields.clerk ||
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
