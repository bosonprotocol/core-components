import { IpfsMetadataStorage } from "./../packages/ipfs-storage/src/ipfs/metadata";
import { AddressZero } from "@ethersproject/constants";
import { erc20Iface } from "./../packages/core-sdk/src/erc20/interface";
import { providers, Contract } from "ethers";
import { program } from "commander";
import { abis } from "@bosonprotocol/common";
import { getDefaultConfig } from "../packages/common/src";
import {
  extractOfferData,
  extractOfferDataExtended
} from "../utils/helpers/offer";
import {
  ITokenInfo,
  NATIVE_TOKENS
} from "../packages/core-sdk/src/utils/tokenInfoManager";

program
  .description("Explore an on-chain Offer.")
  .argument("<OFFER_ID>", "Id of the Offer")
  .option("-c, --chain <CHAIN_ID>", "Target chain id", "1234")
  .parse(process.argv);

async function main() {
  const [offerId] = program.args;

  const opts = program.opts();
  const chainId = Number(opts.chain || "1234");
  const defaultConfig = getDefaultConfig({ chainId });

  const web3Provider = new providers.JsonRpcProvider(defaultConfig.jsonRpcUrl);

  console.log(`Explore Offer with Id ${offerId}`);
  console.log("defaultConfig", defaultConfig);

  const offerAbi = abis.IBosonOfferHandlerABI;

  const offerHandler = new Contract(
    defaultConfig.contracts.protocolDiamond,
    offerAbi,
    web3Provider
  );

  const offerDataRaw = await offerHandler.getOffer(offerId);
  const offerData = extractOfferData(offerDataRaw);
  const tokenInfo = await getTokenInfo(
    offerData.offer.exchangeToken,
    web3Provider,
    chainId
  );
  const extendedOfferData = extractOfferDataExtended(offerDataRaw, tokenInfo);
  console.log("extendedOfferData", extendedOfferData);

  const ipfsMetadataStorage = IpfsMetadataStorage.fromTheGraphIpfsUrl({
    url: defaultConfig.ipfsMetadataUrl
  });
  const metadata = await ipfsMetadataStorage.get(offerData.offer.metadataHash);
  console.log("metadata", metadata);
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

async function getTokenInfo(
  exchangeToken: string,
  web3Provider: providers.JsonRpcProvider,
  chainId: number
): Promise<ITokenInfo> {
  if (!NATIVE_TOKENS[chainId]) {
    throw new Error(`Unexpected chainId value '${chainId}'`);
  }
  if (exchangeToken === AddressZero) {
    return NATIVE_TOKENS[chainId];
  }
  const tokenContract = new Contract(exchangeToken, erc20Iface, web3Provider);
  const [decimals, name, symbol] = await Promise.all([
    tokenContract.getDecimals(),
    tokenContract.getName(),
    tokenContract.getSymbol()
  ]);
  return {
    decimals,
    name,
    symbol
  };
}
