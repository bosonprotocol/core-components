import { useEffect, useState } from "react";
import { getDefaultConfig } from "@bosonprotocol/core-sdk";
import { IpfsMetadataStorage } from "@bosonprotocol/ipfs-storage";
import { EnvironmentType } from "@bosonprotocol/common/src/types";

/**
 * Hook that initializes an instance of `IpfsMetadataStorage` from the `@bosonprotocol/ipfs-storage`
 * package.
 * @param envName - envName to use default IPFS url.
 * @param url - optional custom url.
 * @param headers - Optional IPFS http client headers.
 * @returns Instance of `IpfsMetadataStorage`.
 */
export function useIpfsMetadataStorage(
  envName: EnvironmentType,
  url?: string,
  headers?: Headers | Record<string, string>
) {
  const [ipfsMetadataStorage, setIpfsMetadataStorage] =
    useState<IpfsMetadataStorage>(
      initIpfsMetadataStorage(envName, url, headers)
    );

  useEffect(() => {
    setIpfsMetadataStorage(initIpfsMetadataStorage(envName, url, headers));
  }, [envName, url, headers]);

  return ipfsMetadataStorage;
}

function initIpfsMetadataStorage(
  envName: EnvironmentType,
  url?: string,
  headers?: Headers | Record<string, string>
) {
  return new IpfsMetadataStorage({
    url: url || getDefaultConfig(envName).ipfsMetadataUrl,
    headers
  });
}
