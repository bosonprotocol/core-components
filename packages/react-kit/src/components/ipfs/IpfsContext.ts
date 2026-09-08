import { createContext, useContext } from "react";

export type IpfsContextProps = {
  ipfsMetadataStorageUrl: string;
  ipfsMetadataStorageHeaders: Record<string, string> | Headers;
  ipfsGateway: string;
  /**
   * Token for a dedicated Pinata gateway (`*.mypinata.cloud`). Those gateways
   * answer 403 without one, and they do NOT accept the API JWT.
   */
  ipfsGatewayToken?: string;
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

/**
 * The IPFS configuration when an `IpfsProvider` is mounted above, and `null`
 * otherwise. For hooks that are also used outside the provider - `IpfsProvider`
 * sits well inside the widget provider stack - and can do without it.
 */
export const useIpfsContextIfAvailable = () => useContext(Context);
