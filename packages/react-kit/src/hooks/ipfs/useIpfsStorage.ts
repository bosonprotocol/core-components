import { validateMetadata } from "@bosonprotocol/core-sdk";
import { useConfigContext } from "../../components/config/ConfigContext";
import { useIpfsContext } from "../../components/ipfs/IpfsContext";
import { useIpfsMetadataStorage } from "../useIpfsMetadataStorage";

export function useIpfsStorage() {
  const { config } = useConfigContext();
  const { ipfsMetadataStorageHeaders, ipfsMetadataStorageUrl } =
    useIpfsContext();
  const storage = useIpfsMetadataStorage(
    config.envName,
    config.configId,
    validateMetadata,
    ipfsMetadataStorageUrl,
    ipfsMetadataStorageHeaders
  );
  return storage;
}
