import { useEffect, useState } from "react";
import { CoreSDK, getDefaultConfig } from "@bosonprotocol/core-sdk";
import { EthersAdapter } from "@bosonprotocol/ethers-sdk";
import { IpfsMetadata } from "@bosonprotocol/ipfs-storage";
import { hooks } from "./connectors/metamask";
import { ethers } from "ethers";

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
  const urlSearchParams = Object.fromEntries(
    new URLSearchParams(window.location.hash.split("?")[1]).entries()
  );

  return {
    chainId: parseInt(urlSearchParams["chainId"]),
    protocolDiamond: urlSearchParams["protocolDiamond"],
    subgraphUrl: urlSearchParams["subgraphUrl"],
    jsonRpcUrl: urlSearchParams["jsonRpcUrl"],
    theGraphIpfsUrl: urlSearchParams["theGraphIpfsUrl"],
    ipfsMetadataUrl: urlSearchParams["ipfsMetadataUrl"]
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
