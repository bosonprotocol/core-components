import { useEffect, useState } from "react";
import { getDefaultConfig } from "@bosonprotocol/core-sdk";
import { IpfsMetadataStorage } from "@bosonprotocol/ipfs-storage";
import { EnvironmentType } from "@bosonprotocol/common/src/types";

/**
 * Hook that initializes an instance of `IpfsMetadataStorage` from the `@bosonprotocol/ipfs-storage`
 * package.
 * @param config - envName to use default IPFS url or custom url.
 * @param headers - Optional IPFS http client headers.
 * @returns Instance of `IpfsMetadataStorage`.
 */
export function useIpfsMetadataStorage(
  config: {
    envName?: EnvironmentType;
    url?: string;
  },
  headers?: Headers | Record<string, string>
) {
  const [ipfsMetadataStorage, setIpfsMetadataStorage] = useState<
    IpfsMetadataStorage | undefined
  >(initIpfsMetadataStorage(config, headers));

  useEffect(() => {
    setIpfsMetadataStorage(initIpfsMetadataStorage(config, headers));
  }, [config, headers]);

  return ipfsMetadataStorage;
}

function initIpfsMetadataStorage(
  config: {
    envName?: EnvironmentType;
    url?: string;
  },
  headers?: Headers | Record<string, string>
) {
  if (!config.envName && !config.url) {
    return undefined;
  }
  const url = config.envName
    ? getDefaultConfig(config.envName).ipfsMetadataUrl
    : config.url;

  return new IpfsMetadataStorage({ url, headers });
}
