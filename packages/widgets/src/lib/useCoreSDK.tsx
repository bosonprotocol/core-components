import { useEffect, useState } from "react";
import { CoreSDK, getDefaultConfig } from "@bosonprotocol/core-sdk";
import { EthersAdapter } from "@bosonprotocol/ethers-sdk";
import { IpfsMetadata } from "@bosonprotocol/ipfs-storage";
import { hooks } from "./connectors/metamask";
import { ethers } from "ethers";
import { getURLParams } from "./parseUrlParams";

type Config = {
  chainId: number;
  protocolDiamond: string;
  subgraphUrl: string;
  jsonRpcUrl: string;
  theGraphIpfsUrl?: string;
  ipfsMetadataUrl: string;
};

export function useCoreSDK() {
  const [config] = useState(getConfig());
  const web3Provider = hooks.useProvider();
  const defaultProvider = getDefaultProvider(config.jsonRpcUrl);

  const [coreSDK, setCoreSDK] = useState<CoreSDK>(
    initCoreSDK(web3Provider || defaultProvider, config)
  );

  useEffect(() => {
    if (!web3Provider) return;

    setCoreSDK(initCoreSDK(web3Provider, config));
  }, [web3Provider, config]);

  return coreSDK;
}

function getConfig(): Config {
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
      configFromUrl.ipfsMetadataUrl || defaultConfig.ipfsMetadataUrl
  };
}

function getConfigFromUrl(): Partial<Config> {
  const urlParams = getURLParams();

  return {
    chainId: parseInt(urlParams["chainId"]),
    protocolDiamond: urlParams["protocolDiamond"],
    subgraphUrl: urlParams["subgraphUrl"],
    jsonRpcUrl: urlParams["jsonRpcUrl"],
    theGraphIpfsUrl: urlParams["theGraphIpfsUrl"],
    ipfsMetadataUrl: urlParams["ipfsMetadataUrl"]
  };
}

function getDefaultProvider(jsonRpcUrl: string) {
  return new ethers.providers.JsonRpcProvider(jsonRpcUrl);
}

function initCoreSDK(
  provider: ethers.providers.JsonRpcProvider,
  config: Config
) {
  return new CoreSDK({
    web3Lib: new EthersAdapter(provider),
    protocolDiamond: config.protocolDiamond,
    subgraphUrl: config.subgraphUrl,
    theGraphStorage: IpfsMetadata.fromTheGraphIpfsUrl(config.theGraphIpfsUrl),
    metadataStorage: new IpfsMetadata({
      url: config.ipfsMetadataUrl
    })
  });
}
