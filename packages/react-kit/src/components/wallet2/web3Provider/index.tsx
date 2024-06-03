import { getChainIdFromConfigId } from "@bosonprotocol/common";
import React, { ReactNode } from "react";
import { BlockNumberProvider } from "../../../hooks/contracts/useBlockNumber";
import {
  ConfigProvider,
  ConfigProviderProps
} from "../../config/ConfigProvider";
import { ConnectionsProvider } from "../../connection/ConnectionsProvider";
import { ReduxProvider } from "../../widgets/ReduxProvider";
import { FiatLinkProvider } from "../accountDrawer/fiatOnrampModal/FiatLink";

export type Web3ProviderProps = {
  configProps: Omit<ConfigProviderProps, "children">;
  children: ReactNode;
};
export function Web3Provider({ children, configProps }: Web3ProviderProps) {
  const defaultChainId = getChainIdFromConfigId(
    configProps.envName,
    configProps.configId
  );
  return (
    <ReduxProvider withCustomContext={configProps.withCustomReduxContext}>
      <ConnectionsProvider
        defaultChainId={defaultChainId}
        infuraKey={configProps.infuraKey}
        walletConnectProjectId={configProps.walletConnectProjectId}
      >
        <ConfigProvider {...configProps}>
          <BlockNumberProvider>
            <FiatLinkProvider>{children}</FiatLinkProvider>
          </BlockNumberProvider>
        </ConfigProvider>
      </ConnectionsProvider>
    </ReduxProvider>
  );
}
