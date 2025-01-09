import { getChainIdFromConfigId } from "@bosonprotocol/common";
import { EnvironmentType, ConfigId } from "@bosonprotocol/core-sdk";
import React, { ReactNode } from "react";
import { ConnectionsProvider } from "../../connection/ConnectionsProvider";
import { FiatLinkProvider } from "../accountDrawer/fiatOnrampModal/FiatLink";

export type Web3ProviderProps = {
  envName: EnvironmentType;
  configId: ConfigId;
  infuraKey: string;
  walletConnectProjectId: string;
  children: ReactNode;
};
export function Web3Provider({ children, ...rest }: Web3ProviderProps) {
  const defaultChainId = getChainIdFromConfigId(rest.envName, rest.configId);
  return (
    <ConnectionsProvider
      defaultChainId={defaultChainId}
      infuraKey={rest.infuraKey}
      walletConnectProjectId={rest.walletConnectProjectId}
    >
      <FiatLinkProvider>{children}</FiatLinkProvider>
    </ConnectionsProvider>
  );
}
