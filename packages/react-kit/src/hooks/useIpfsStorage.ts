import { useIpfsMetadataStorage } from "./";
import { useEnvContext } from "../components/environment/EnvironmentContext";
import { useIpfsContext } from "../components/ipfs/IpfsContext";
import { validateMetadata } from "@bosonprotocol/core-sdk";

export function useIpfsStorage() {
  const { envName, configId } = useEnvContext();
  const { ipfsMetadataStorageUrl, ipfsMetadataStorageHeaders } =
    useIpfsContext();
  const storage = useIpfsMetadataStorage(
    envName,
    configId,
    validateMetadata,
    ipfsMetadataStorageUrl,
    ipfsMetadataStorageHeaders
  );
  return storage;
}
