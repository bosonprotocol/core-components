import { Connector } from "@web3-react/types";
import React, { ReactNode, createContext, useContext, useMemo } from "react";
import {
  getCoinbaseWalletConnection,
  getNetworkConnection,
  getWalletConnectV2Connection,
  gnosisSafeConnection,
  injectedConnection
} from ".";
import { Connection, ConnectionType } from "./types";

export type ConnectionsProviderProps = {
  infuraKey: string;
  walletConnectProjectId: string;
  defaultChainId: number;

  children: ReactNode;
};

const MISSING_PROVIDER = Symbol();
type ConnectionsValue = {
  injectedConnection: Connection;
  gnosisSafeConnection: Connection;
  walletConnectV2Connection: Connection;
  coinbaseWalletConnection: Connection;
  networkConnection: Connection;
};
const Context = createContext<ConnectionsValue | typeof MISSING_PROVIDER>(
  MISSING_PROVIDER
);

export const ConnectionsProvider = ({
  children,
  defaultChainId,
  infuraKey,
  walletConnectProjectId
}: ConnectionsProviderProps) => {
  const walletConnectV2Connection = useMemo(() => {
    return getWalletConnectV2Connection({
      infuraKey,
      walletConnectProjectId,
      defaultChainId
    });
  }, [infuraKey, walletConnectProjectId, defaultChainId]);
  const coinbaseWalletConnection = useMemo(() => {
    return getCoinbaseWalletConnection({ infuraKey, defaultChainId });
  }, [infuraKey, defaultChainId]);
  const networkConnection = useMemo(() => {
    return getNetworkConnection({ defaultChainId });
  }, [defaultChainId]);
  const value = useMemo(() => {
    return {
      injectedConnection,
      gnosisSafeConnection,
      walletConnectV2Connection,
      coinbaseWalletConnection,
      networkConnection
    };
  }, [walletConnectV2Connection, coinbaseWalletConnection, networkConnection]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useConnections = () => {
  const connections = useContext(Context);
  if (connections === MISSING_PROVIDER) {
    throw new Error("You need to wrap this component with ConnectionsProvider");
  }
  return connections;
};

export function getConnection(
  c: Connector | ConnectionType,
  connectionObj: ConnectionsValue
) {
  if (c instanceof Connector) {
    const connections = Object.values(connectionObj);
    const connection = connections.find(
      (connection) => connection.connector === c
    );
    if (!connection) {
      throw Error("unsupported connector");
    }
    return connection;
  } else {
    switch (c) {
      case ConnectionType.INJECTED:
        return connectionObj.injectedConnection;
      case ConnectionType.COINBASE_WALLET:
        return connectionObj.coinbaseWalletConnection;
      case ConnectionType.WALLET_CONNECT_V2:
        return connectionObj.walletConnectV2Connection;
      case ConnectionType.NETWORK:
        return connectionObj.networkConnection;
      case ConnectionType.GNOSIS_SAFE:
        return connectionObj.gnosisSafeConnection;
      default:
        throw new Error("Connection not supported in getConnection");
    }
  }
}
