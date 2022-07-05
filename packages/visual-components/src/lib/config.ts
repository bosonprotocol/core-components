import { getDefaultConfig } from "@bosonprotocol/core-sdk";
import { getURLParams } from "./parseUrlParams";

export type Config = {
  chainId: number;
  protocolDiamond: string;
  subgraphUrl: string;
  jsonRpcUrl: string;
  theGraphIpfsUrl?: string;
  ipfsMetadataUrl: string;
  metaTransactionsApiKey?: string;
};

export function getConfig(): Config {
  const configFromUrl = getConfigFromUrl();
  const defaultConfig = getDefaultConfig({
    chainId: configFromUrl.chainId || 1
  });

  return {
    chainId: configFromUrl.chainId || defaultConfig.chainId,
    protocolDiamond:
      configFromUrl.protocolDiamond || defaultConfig.contracts.protocolDiamond,
    subgraphUrl: configFromUrl.subgraphUrl || defaultConfig.subgraphUrl,
    jsonRpcUrl: configFromUrl.jsonRpcUrl || defaultConfig.jsonRpcUrl,
    theGraphIpfsUrl:
      configFromUrl.theGraphIpfsUrl || defaultConfig.theGraphIpfsUrl,
    ipfsMetadataUrl:
      configFromUrl.ipfsMetadataUrl || defaultConfig.ipfsMetadataUrl,
    metaTransactionsApiKey: configFromUrl.metaTransactionsApiKey
  };
}

export function getConfigFromUrl(): Partial<Config> {
  const urlParams = getURLParams();

  return {
    chainId: parseInt(urlParams["chainId"]),
    protocolDiamond: urlParams["protocolDiamond"],
    subgraphUrl: urlParams["subgraphUrl"],
    jsonRpcUrl: urlParams["jsonRpcUrl"],
    theGraphIpfsUrl: urlParams["theGraphIpfsUrl"],
    ipfsMetadataUrl: urlParams["ipfsMetadataUrl"],
    metaTransactionsApiKey: urlParams["metaTransactionsApiKey"]
  };
}
