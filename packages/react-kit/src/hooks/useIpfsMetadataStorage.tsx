import { useEffect, useState } from "react";
import {
  getEnvConfigById,
  ConfigId,
  AnyMetadata
} from "@bosonprotocol/core-sdk";
import { IpfsMetadataStorage } from "@bosonprotocol/ipfs-storage";
import { EnvironmentType } from "@bosonprotocol/common/src/types";

/**
 * Hook that initializes an instance of `IpfsMetadataStorage` from the `@bosonprotocol/ipfs-storage`
 * package.
 * @param envName - envName to use default IPFS url.
 * @param url - optional custom url.
 * @param headers - Optional IPFS http client headers.
 * @param gatewayUrl - Optional IPFS gateway to read through. Only used when
 * `url` is an upload-only endpoint, such as Pinata's; a `url` that is a real
 * IPFS HTTP API is read through directly.
 * @param gatewayToken - Optional token for a dedicated Pinata gateway.
 * @returns Instance of `IpfsMetadataStorage`.
 */
export function useIpfsMetadataStorage(
  envName: EnvironmentType,
  configId: ConfigId,
  validateMetadata: (metadata: AnyMetadata) => void,
  url?: string,
  headers?: Headers | Record<string, string>,
  gatewayUrl?: string,
  gatewayToken?: string
) {
  const [ipfsMetadataStorage, setIpfsMetadataStorage] =
    useState<IpfsMetadataStorage>(
      initIpfsMetadataStorage(
        envName,
        configId,
        validateMetadata,
        url,
        headers,
        gatewayUrl,
        gatewayToken
      )
    );

  useEffect(() => {
    setIpfsMetadataStorage(
      initIpfsMetadataStorage(
        envName,
        configId,
        validateMetadata,
        url,
        headers,
        gatewayUrl,
        gatewayToken
      )
    );
  }, [
    envName,
    configId,
    validateMetadata,
    url,
    headers,
    gatewayUrl,
    gatewayToken
  ]);

  return ipfsMetadataStorage;
}

function initIpfsMetadataStorage(
  envName: EnvironmentType,
  configId: ConfigId,
  validateMetadata: (metadata: AnyMetadata) => void,
  url?: string,
  headers?: Headers | Record<string, string>,
  gatewayUrl?: string,
  gatewayToken?: string
) {
  return new IpfsMetadataStorage(validateMetadata, {
    url: url || getEnvConfigById(envName, configId).ipfsMetadataUrl,
    headers,
    gatewayUrl,
    gatewayToken
  });
}
