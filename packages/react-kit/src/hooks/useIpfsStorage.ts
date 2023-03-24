import { useIpfsMetadataStorage } from "./";
import { useEnvContext } from "../components/environment/EnvironmentContext";
import { useIpfsContext } from "../components/ipfs/IpfsContext";

export function useIpfsStorage() {
  const { envName } = useEnvContext();
  const { ipfsMetadataStorageUrl, ipfsMetadataStorageHeaders } =
    useIpfsContext();
  const storage = useIpfsMetadataStorage(
    envName,
    ipfsMetadataStorageUrl,
    ipfsMetadataStorageHeaders
  );
  return storage;
}
