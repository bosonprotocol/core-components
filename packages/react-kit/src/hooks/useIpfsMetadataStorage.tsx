import { useEffect, useState } from "react";
import {
  getEnvConfigById,
  ConfigId,
  validateMetadata
} from "@bosonprotocol/core-sdk";
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
  configId: ConfigId,
  url?: string,
  headers?: Headers | Record<string, string>
) {
  const [ipfsMetadataStorage, setIpfsMetadataStorage] =
    useState<IpfsMetadataStorage>(
      initIpfsMetadataStorage(envName, configId, url, headers)
    );

  useEffect(() => {
    setIpfsMetadataStorage(
      initIpfsMetadataStorage(envName, configId, url, headers)
    );
  }, [envName, configId, url, headers]);

  return ipfsMetadataStorage;
}

function initIpfsMetadataStorage(
  envName: EnvironmentType,
  configId: ConfigId,
  url?: string,
  headers?: Headers | Record<string, string>
) {
  return new IpfsMetadataStorage(validateMetadata, {
    url: url || getEnvConfigById(envName, configId).ipfsMetadataUrl,
    headers
  });
}
