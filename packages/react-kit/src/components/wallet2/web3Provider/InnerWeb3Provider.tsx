import {
  useWeb3React,
  Web3ReactHooks,
  Web3ReactProvider
} from "@web3-react/core";
import { Connector } from "@web3-react/types";
import React, { ReactNode, useEffect } from "react";
import useEagerlyConnect from "../../../hooks/connection/useEagerlyConnect";
import { usePrevious } from "../../../hooks/usePrevious";
import { useConnectedWallets } from "../../../state/wallets/hooks";
import {
  getConnection,
  useConnections
} from "../../connection/ConnectionsProvider";

export function InnerWeb3Provider({ children }: { children: ReactNode }) {
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

/** A component to run hooks under the Web3ReactProvider context. */
function Updater() {
  const { account, connector } = useWeb3React();
  const connectionObj = useConnections();

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
