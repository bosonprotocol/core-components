import { useEffect, useState } from "react";
import { CoreSDK, getDefaultConfig } from "@bosonprotocol/core-sdk";
import { EthersAdapter, Provider } from "@bosonprotocol/ethers-sdk";
import { IpfsMetadataStorage } from "@bosonprotocol/ipfs-storage";
import { providers } from "ethers";

export type CoreSdkConfig = {
  web3Provider?: Provider;
  chainId: number;
  jsonRpcUrl?: string;
  subgraphUrl?: string;
  protocolDiamond?: string;
  ipfsMetadataStorageUrl?: string;
  theGraphIpfsUrl?: string;
};

export function useCoreSdk(config: CoreSdkConfig) {
  const [coreSdk, setCoreSdk] = useState<CoreSDK>(initCoreSdk(config));

  useEffect(() => {
    const newCoreSdk = initCoreSdk(config);
    setCoreSdk(newCoreSdk);
  }, [config.web3Provider]);

  return coreSdk;
}

function initCoreSdk(config: CoreSdkConfig) {
  const defaultConfig = getDefaultConfig({ chainId: config.chainId });
  const defaultProvider = new providers.JsonRpcProvider(
    config.jsonRpcUrl || defaultConfig.jsonRpcUrl
  );
  const connectedProvider = config.web3Provider || defaultProvider;

  return new CoreSDK({
    web3Lib: new EthersAdapter(connectedProvider),
    protocolDiamond:
      config.protocolDiamond || defaultConfig.contracts.protocolDiamond,
    subgraphUrl: config.subgraphUrl || defaultConfig.subgraphUrl,
    theGraphStorage: IpfsMetadataStorage.fromTheGraphIpfsUrl(
      config.theGraphIpfsUrl || defaultConfig.theGraphIpfsUrl
    ),
    metadataStorage: new IpfsMetadataStorage({
      url: config.ipfsMetadataStorageUrl || defaultConfig.ipfsMetadataUrl
    })
  });
}
