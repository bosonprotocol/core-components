import {
  useWeb3React,
  Web3ReactHooks,
  Web3ReactProvider
} from "@web3-react/core";
import { Connector } from "@web3-react/types";
import React from "react";
import { ReactNode, useEffect } from "react";
import { usePrevious } from "../../../hooks/usePrevious";
import { useConnectedWallets } from "../../../state/wallets/hooks";
import useEagerlyConnect from "../../../hooks/connection/useEagerlyConnect";
import {
  ConnectionsProvider,
  ConnectionsProviderProps,
  getConnection,
  useConnections
} from "../../connection/ConnectionsProvider";
import {
  ConfigProvider,
  ConfigProviderProps
} from "../../config/ConfigProvider";
import { ReduxProvider } from "../../widgets/ReduxProvider";
import { BlockNumberProvider } from "../../../hooks/contracts/useBlockNumber";
import { FiatLinkProvider } from "../accountDrawer/fiatOnrampModal/FiatLink";

function InnerWeb3Provider({ children }: { children: ReactNode }) {
  useEagerlyConnect();
  const connections = Object.values(useConnections());
  const connectors = connections.map<[Connector, Web3ReactHooks]>(
    ({ hooks, connector }) => [connector, hooks]
  );

  return (
    <Web3ReactProvider connectors={connectors}>
      <Updater />
      {children}
    </Web3ReactProvider>
  );
}
export type Web3ProviderProps = ConnectionsProviderProps & {
  configProps: ConfigProviderProps;
};
export function Web3Provider({
  children,
  configProps,
  ...rest
}: Web3ProviderProps) {
  return (
    <ReduxProvider>
      <ConfigProvider {...configProps}>
        <BlockNumberProvider>
          <ConnectionsProvider {...rest}>
            <InnerWeb3Provider>
              <FiatLinkProvider>{children}</FiatLinkProvider>
            </InnerWeb3Provider>
          </ConnectionsProvider>
        </BlockNumberProvider>
      </ConfigProvider>
    </ReduxProvider>
  );
}

/** A component to run hooks under the Web3ReactProvider context. */
function Updater() {
  const { account } = useWeb3React();
  const connectionObj = useConnections();

  const { connector } = useWeb3React();

  const previousAccount = usePrevious(account);
  const [, addConnectedWallet] = useConnectedWallets();
  useEffect(() => {
    if (account && account !== previousAccount) {
      const walletType =
        getConnection(connector, connectionObj)?.getName() ?? "";

      addConnectedWallet({ account, walletType });
    }
  }, [account, addConnectedWallet, connectionObj, connector, previousAccount]);

  return null;
}
