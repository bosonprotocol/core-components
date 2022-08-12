import { useEffect, useState } from "react";
import { getDefaultConfig } from "@bosonprotocol/core-sdk";
import { IpfsMetadataStorage } from "@bosonprotocol/ipfs-storage";

/**
 * Hook that initializes an instance of `IpfsMetadataStorage` from the `@bosonprotocol/ipfs-storage`
 * package.
 * @param chainIdOrUrl - Chain ID to use default IPFS url or custom url.
 * @param headers - Optional IPFS http client headers.
 * @returns Instance of `IpfsMetadataStorage`.
 */
export function useIpfsMetadataStorage(
  chainIdOrUrl: number | string,
  headers?: Headers | Record<string, string>
) {
  const [ipfsMetadataStorage, setIpfsMetadataStorage] =
    useState<IpfsMetadataStorage>(
      initIpfsMetadataStorage(chainIdOrUrl, headers)
    );

  useEffect(() => {
    setIpfsMetadataStorage(initIpfsMetadataStorage(chainIdOrUrl, headers));
  }, [chainIdOrUrl, headers]);

  return ipfsMetadataStorage;
}

function initIpfsMetadataStorage(
  chainIdOrUrl: number | string,
  headers?: Headers | Record<string, string>
) {
  const url =
    typeof chainIdOrUrl === "number"
      ? getDefaultConfig({ chainId: chainIdOrUrl }).ipfsMetadataUrl
      : chainIdOrUrl;

  return new IpfsMetadataStorage({ url, headers });
}
