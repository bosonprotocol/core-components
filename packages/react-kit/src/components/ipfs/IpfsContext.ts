import { createContext, useContext } from "react";

export const Context = createContext<{
  ipfsMetadataStorageUrl: string;
  ipfsMetadataStorageHeaders: Record<string, string> | Headers;
  ipfsGateway: string;
  ipfsImageGateway: string;
} | null>(null);

export const useIpfsContext = () => {
  const contextValue = useContext(Context);
  if (!contextValue) {
    throw new Error("You need to use IpfsProvider before using useIpfsContext");
  }
  return contextValue;
};
