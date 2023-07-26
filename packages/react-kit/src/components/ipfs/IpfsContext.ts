import { createContext, useContext } from "react";

export type IpfsContextProps = {
  ipfsMetadataStorageUrl: string;
  ipfsMetadataStorageHeaders: Record<string, string> | Headers;
  ipfsGateway: string;
  ipfsImageGateway: string;
};

export const Context = createContext<IpfsContextProps | null>(null);

export const useIpfsContext = () => {
  const contextValue = useContext(Context);
  if (!contextValue) {
    throw new Error("You need to use IpfsProvider before using useIpfsContext");
  }
  return contextValue;
};
