import { useEffect, useState } from "react";
import {
  CoreSDK,
  getEnvConfigById,
  ConfigId,
  EnvironmentType,
  MetaTxConfig,
  validateMetadata
} from "@bosonprotocol/core-sdk";
import { EthersAdapter, Provider } from "@bosonprotocol/ethers-sdk";
import { IpfsMetadataStorage } from "@bosonprotocol/ipfs-storage";
import { LensContracts, Web3LibAdapter } from "@bosonprotocol/common";
import { providers } from "ethers";

export type CoreSdkConfig = {
  /**
   * Target Environment
   */
  envName: EnvironmentType;
  /**
   * Config id of the chosen environment
   */
  configId: ConfigId;
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
  /**
   * Optional override for the MetaTx configuration
   */
  metaTx?: Partial<MetaTxConfig>;
  /**
   * Optional override for the Lens contracts addresses
   */
  lensContracts?: LensContracts;
};

type CoreSdkOverrides = { web3Lib?: Web3LibAdapter };

/**
 * Hook that initializes an instance of `CoreSDK` from the `@bosonprotocol/core-sdk`
 * package. The instance will be reinitialized when the passed in `web3Provider`
 * changes.
 * @param config - Configuration arguments.
 * @returns Instance of `CoreSDK`.
 */
export function useCoreSdk(
  config: CoreSdkConfig,
  overrides?: CoreSdkOverrides
): CoreSDK {
  const [coreSdk, setCoreSdk] = useState<CoreSDK>(
    initCoreSdk(config, overrides)
  );

  useEffect(() => {
    const newCoreSdk = initCoreSdk(config, overrides);
    setCoreSdk(newCoreSdk);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.web3Provider, config.configId, overrides]);

  return coreSdk;
}

function initCoreSdk(config: CoreSdkConfig, overrides?: CoreSdkOverrides) {
  const defaultConfig = getEnvConfigById(config.envName, config.configId);
  const getConnectedProvider = () =>
    config.web3Provider ||
    createDefaultProvider(config.jsonRpcUrl || defaultConfig.jsonRpcUrl);
  const metadataStorageUrl =
    config.ipfsMetadataStorageUrl || defaultConfig.ipfsMetadataUrl;
  const theGraphStorageUrl =
    config.theGraphIpfsUrl ||
    defaultConfig.theGraphIpfsUrl ||
    metadataStorageUrl;
  const metaTx = config.metaTx || defaultConfig.metaTx;

  const instance = new CoreSDK({
    ...defaultConfig,
    web3Lib: overrides?.web3Lib ?? new EthersAdapter(getConnectedProvider()),
    protocolDiamond:
      config.protocolDiamond || defaultConfig.contracts.protocolDiamond,
    subgraphUrl: config.subgraphUrl || defaultConfig.subgraphUrl,
    theGraphStorage: new IpfsMetadataStorage(validateMetadata, {
      url: theGraphStorageUrl,
      headers:
        config.theGraphIpfsStorageHeaders ||
        theGraphStorageUrl === metadataStorageUrl
          ? config.ipfsMetadataStorageHeaders
          : undefined
    }),
    metadataStorage: new IpfsMetadataStorage(validateMetadata, {
      url: metadataStorageUrl,
      headers: config.ipfsMetadataStorageHeaders
    }),
    chainId: defaultConfig.chainId,
    metaTx,
    lens: config.lensContracts || defaultConfig.lens
  });
  Object.setPrototypeOf(instance, CoreSDK.prototype);
  return instance;
}

function createDefaultProvider(jsonRpcUrl: string): Provider {
  const key = jsonRpcUrl.toLowerCase();
  if (!providersCache.has(key)) {
    providersCache.set(key, new providers.StaticJsonRpcProvider(jsonRpcUrl));
  }
  return providersCache.get(key) as Provider;
}

const providersCache = new Map<string, Provider>();
