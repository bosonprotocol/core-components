import { EnvironmentType } from "@bosonprotocol/common/src/types/configs";
import { providers, Contract } from "ethers";
import { getDefaultConfig } from "@bosonprotocol/common/src";
import { abis } from "@bosonprotocol/common";
import { extractSellerData } from "./utils/account";

async function main() {
  const envName: EnvironmentType = "staging";
  const defaultConfig = getDefaultConfig(envName);
  const web3Provider = new providers.JsonRpcProvider(defaultConfig.jsonRpcUrl);

  const accountAbi = abis.IBosonAccountHandlerABI;
  const accountHandler = new Contract(
    defaultConfig.contracts.protocolDiamond,
    accountAbi,
    web3Provider
  );
  console.log("environment: " + envName);
  const lastSellerId = 100;
  for (let i = 1; i < lastSellerId; i++) {
    const sellerDataRaw = await accountHandler.getSeller(i);
    if (!sellerDataRaw.exists) {
      continue;
    }
    const sellerData = extractSellerData(sellerDataRaw);
    console.log(`${i} - current Seller data`, JSON.stringify(sellerData));
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
