import { useEffect, useState } from "react";
import { getDefaultConfig } from "@bosonprotocol/core-sdk";
import { IpfsMetadataStorage } from "@bosonprotocol/ipfs-storage";

/**
 * Hook that initializes an instance of `IpfsMetadataStorage` from the `@bosonprotocol/ipfs-storage`
 * package.
 * @param chainIdOrUrl - Chain ID to use default IPFS url or custom url.
 * @returns Instance of `IpfsMetadataStorage`.
 */
export function useIpfsMetadataStorage(chainIdOrUrl: number | string) {
  const [ipfsMetadataStorage, setIpfsMetadataStorage] =
    useState<IpfsMetadataStorage>(initIpfsMetadataStorage(chainIdOrUrl));

  useEffect(() => {
    setIpfsMetadataStorage(initIpfsMetadataStorage(chainIdOrUrl));
  }, [chainIdOrUrl]);

  return ipfsMetadataStorage;
}

function initIpfsMetadataStorage(chainIdOrUrl: number | string) {
  const url =
    typeof chainIdOrUrl === "number"
      ? getDefaultConfig({ chainId: chainIdOrUrl }).ipfsMetadataUrl
      : chainIdOrUrl;

  return new IpfsMetadataStorage({ url });
}
