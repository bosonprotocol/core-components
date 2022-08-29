import { useEffect, useState } from "react";
import { CoreSDK } from "@bosonprotocol/core-sdk";
import { EthersAdapter } from "@bosonprotocol/ethers-sdk";
import { IpfsMetadataStorage } from "@bosonprotocol/ipfs-storage";
import { hooks } from "./connectors/metamask";
import { providers } from "ethers";
import { getConfig, Config } from "./config";

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

function getDefaultProvider(jsonRpcUrl: string) {
  return new providers.JsonRpcProvider(jsonRpcUrl);
}

function initCoreSDK(provider: providers.JsonRpcProvider, config: Config) {
  return new CoreSDK({
    web3Lib: new EthersAdapter(provider),
    protocolDiamond: config.protocolDiamond,
    subgraphUrl: config.subgraphUrl,
    theGraphStorage: new IpfsMetadataStorage({
      url: config.theGraphIpfsUrl || config.ipfsMetadataUrl
    }),
    metadataStorage: new IpfsMetadataStorage({
      url: config.ipfsMetadataUrl
    })
  });
}
