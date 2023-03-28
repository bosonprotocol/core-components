import { getDefaultConfig } from "@bosonprotocol/core-sdk";
import React, { ReactNode } from "react";
import { useEnvContext } from "../environment/EnvironmentContext";
import { Context } from "./IpfsContext";

export type IpfsProviderProps = NonNullable<
  Parameters<typeof Context["Provider"]>[0]["value"]
>;
type Props = IpfsProviderProps & {
  children: ReactNode;
};
export function IpfsProvider({ children, ...rest }: Props) {
  const { envName } = useEnvContext();
  const { ipfsMetadataUrl } = getDefaultConfig(envName);
  const ipfsMetadataStorageUrl = rest.ipfsMetadataStorageUrl || ipfsMetadataUrl;
  return (
    <Context.Provider value={{ ...rest, ipfsMetadataStorageUrl }}>
      {children}
    </Context.Provider>
  );
}
