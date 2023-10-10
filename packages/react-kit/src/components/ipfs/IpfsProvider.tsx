import { Optional } from "utility-types";
import { getEnvConfigById } from "@bosonprotocol/core-sdk";
import React, { ReactNode } from "react";
import { useEnvContext } from "../environment/EnvironmentContext";
import { Context, IpfsContextProps } from "./IpfsContext";
import { getIpfsHeaders } from "../../hooks/ipfs/getIpfsHeaders";

export type IpfsProviderProps = Omit<
  Optional<
    IpfsContextProps,
    "ipfsImageGateway" | "ipfsGateway" | "ipfsMetadataStorageUrl"
  >,
  "ipfsMetadataStorageHeaders"
> & {
  ipfsProjectId?: string;
  ipfsProjectSecret?: string;
  children: ReactNode;
};

export function IpfsProvider({ children, ...rest }: IpfsProviderProps) {
  const { envName, configId } = useEnvContext();
  const { ipfsMetadataUrl } = getEnvConfigById(envName, configId);
  const ipfsMetadataStorageUrl = rest.ipfsMetadataStorageUrl || ipfsMetadataUrl;
  const ipfsGateway = rest.ipfsGateway || "https://ipfs.io/ipfs";
  const ipfsMetadataStorageHeaders = getIpfsHeaders(
    rest.ipfsProjectId,
    rest.ipfsProjectSecret
  );
  return (
    <Context.Provider
      value={{
        ...rest,
        ipfsMetadataStorageHeaders,
        ipfsMetadataStorageUrl,
        ipfsGateway,
        ipfsImageGateway: rest.ipfsImageGateway || ipfsGateway
      }}
    >
      {children}
    </Context.Provider>
  );
}
