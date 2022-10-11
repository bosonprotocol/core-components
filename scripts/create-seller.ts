import fs from "fs";
import { EnvironmentType } from "@bosonprotocol/common/src/types/configs";
import { providers, Contract, Wallet } from "ethers";
import { program } from "commander";
import { getDefaultConfig } from "@bosonprotocol/common/src";
import { CoreSDK } from "../packages/core-sdk/src";
import { EthersAdapter } from "../packages/ethers-sdk/src";

program
  .description("Create a Seller.")
  .argument(
    "<SELLER_PRIVATE_KEY>",
    "Private key of the Seller account (operator role)."
  )
  .option("-d, --data <SELLER_DATA>", "JSON file with the Seller parameters")
  .option("-e, --env <ENV_NAME>", "Target environment", "testing")
  .parse(process.argv);

async function main() {
  const [sellerPrivateKey] = program.args;

  const opts = program.opts();
  const envName = opts.env || "testing";
  const defaultConfig = getDefaultConfig(envName as EnvironmentType);
  const chainId = defaultConfig.chainId;
  const sellerWallet = new Wallet(sellerPrivateKey);

  let sellerDataJson;
  if (opts.data) {
    const rawData = fs.readFileSync(opts.data);
    sellerDataJson = JSON.parse(rawData.toString());
  } else {
    sellerDataJson = {
      operator: sellerWallet.address,
      admin: sellerWallet.address,
      clerk: sellerWallet.address,
      treasury: sellerWallet.address,
      contractUri: "",
      royaltyPercentage: "0",
      authTokenId: "0",
      authTokenType: "0"
    };
  }

  console.log(`Create Seller with Data ${JSON.stringify(sellerDataJson)}`);
  console.log("defaultConfig", defaultConfig);

  const coreSDK = CoreSDK.fromDefaultConfig({
    web3Lib: new EthersAdapter(
      new providers.JsonRpcProvider(defaultConfig.jsonRpcUrl),
      sellerWallet
    ),
    envName
  });

  console.log(`Creating seller on env ${envName} on chain ${chainId}...`);
  const txResponse1 = await coreSDK.createSeller(sellerDataJson);
  console.log(`Tx hash: ${txResponse1.hash}`);
  const receipt = await txResponse1.wait();
  const sellerId = coreSDK.getCreatedSellerIdFromLogs(receipt.logs);
  console.log(`Seller with id ${sellerId} created.`);
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
