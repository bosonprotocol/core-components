import { useEffect, useState } from "react";
import { CoreSDK, getDefaultConfig } from "@bosonprotocol/core-sdk";
import { EthersAdapter, Provider } from "@bosonprotocol/ethers-sdk";
import { IpfsMetadataStorage } from "@bosonprotocol/ipfs-storage";
import { providers } from "ethers";

export type CoreSdkConfig = {
  /**
   * Target chain.
   */
  chainId: number;
  /**
   * Ethers provider that will be passed to `CoreSDK`. Defaults to `JsonRpcProvider`
   * connected via default URL of respective chain ID.
   */
  web3Provider?: Provider;
  /**
   * Optional override for default `JsonRpcProvider` to use.
   */
  jsonRpcUrl?: string;
  /**
   * Optional override for subgraph API url to use.
   */
  subgraphUrl?: string;
  /**
   * Optional override for Diamond contract address to use.
   */
  protocolDiamond?: string;
  /**
   * Optional override for IPFS metadata storage to use.
   */
  ipfsMetadataStorageUrl?: string;
  /**
   * Optional override for IPFS metadata storage headers.
   */
  ipfsMetadataStorageHeaders?: Headers | Record<string, string>;
  /**
   * Optional override for The Graph IPFS storage to use.
   */
  theGraphIpfsUrl?: string;
  /**
   * Optional override for The Graph IPFS  storage headers.
   */
  theGraphIpfsStorageHeaders?: Headers | Record<string, string>;
};

/**
 * Hook that initializes an instance of `CoreSDK` from the `@bosonprotocol/core-sdk`
 * package. The instance will be reinitialized when the passed in `web3Provider`
 * changes.
 * @param config - Configuration arguments.
 * @returns Instance of `CoreSDK`.
 */
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
  const metadataStorageUrl =
    config.ipfsMetadataStorageUrl || defaultConfig.ipfsMetadataUrl;

  return new CoreSDK({
    web3Lib: new EthersAdapter(connectedProvider),
    protocolDiamond:
      config.protocolDiamond || defaultConfig.contracts.protocolDiamond,
    subgraphUrl: config.subgraphUrl || defaultConfig.subgraphUrl,
    theGraphStorage: new IpfsMetadataStorage({
      url:
        config.theGraphIpfsUrl ||
        defaultConfig.theGraphIpfsUrl ||
        metadataStorageUrl,
      headers:
        config.theGraphIpfsStorageHeaders || config.ipfsMetadataStorageHeaders
    }),
    metadataStorage: new IpfsMetadataStorage({
      url: metadataStorageUrl,
      headers: config.ipfsMetadataStorageHeaders
    })
  });
}
