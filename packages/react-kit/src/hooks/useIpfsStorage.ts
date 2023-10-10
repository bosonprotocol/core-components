import { useIpfsMetadataStorage } from "./";
import { useEnvContext } from "../components/environment/EnvironmentContext";
import { useIpfsContext } from "../components/ipfs/IpfsContext";

export function useIpfsStorage() {
  const { envName, configId } = useEnvContext();
  const { ipfsMetadataStorageUrl, ipfsMetadataStorageHeaders } =
    useIpfsContext();
  const storage = useIpfsMetadataStorage(
    envName,
    configId,
    ipfsMetadataStorageUrl,
    ipfsMetadataStorageHeaders
  );
  return storage;
}
