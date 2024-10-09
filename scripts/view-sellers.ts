import {
  ConfigId,
  EnvironmentType
} from "@bosonprotocol/common/src/types/configs";
import { providers, Contract } from "ethers";
import { abis } from "@bosonprotocol/common";
import { extractSellerData, SellerData } from "./utils/account";
import { getEnvConfigById } from "@bosonprotocol/common/src/configs";
import { EthersAdapter } from "../packages/ethers-sdk/src";
import { CoreSDK } from "../packages/core-sdk/src";

async function main() {
  const envName: EnvironmentType = "staging";
  const configId: ConfigId = "staging-11155111-0";
  const defaultConfig = getEnvConfigById(envName, configId);
  const web3Provider = new providers.JsonRpcProvider(defaultConfig.jsonRpcUrl);

  const accountAbi = abis.IBosonAccountHandlerABI;
  const accountHandler = new Contract(
    defaultConfig.contracts.protocolDiamond,
    accountAbi,
    web3Provider
  );
  console.log("environment: " + envName);
  const lastSellerId = 100;
  const sellerDatas: SellerData[] = [];
  for (let i = 1; i < lastSellerId; i++) {
    const sellerDataRaw = await accountHandler.getSeller(i);
    if (!sellerDataRaw.exists) {
      continue;
    }
    const sellerData = extractSellerData(sellerDataRaw);
    sellerDatas.push(sellerData);
    console.log(`${i} - current Seller data`, JSON.stringify(sellerData));
  }
  const coreSDK = CoreSDK.fromDefaultConfig({
    web3Lib: new EthersAdapter(
      new providers.JsonRpcProvider(defaultConfig.jsonRpcUrl)
    ),
    envName,
    configId
  });
  for (const sellerData of sellerDatas) {
    try {
      const seller = await coreSDK.getSellerById(sellerData.seller.id);
      console.log(`${JSON.stringify(seller)}`);
    } catch (e) {
      console.error(e);
    }
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
