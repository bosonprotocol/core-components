import { ChainId } from "@uniswap/sdk-core";
import { CoinbaseWallet } from "@web3-react/coinbase-wallet";
import { initializeConnector } from "@web3-react/core";
import { GnosisSafe } from "@web3-react/gnosis-safe";
import { MetaMask } from "@web3-react/metamask";
import { Network } from "@web3-react/network";
import { Actions } from "@web3-react/types";
import GNOSIS_ICON from "../../assets/gnosis.png";
import UNISWAP_LOGO from "../../assets/svg/uniswaplogo.svg";
import COINBASE_ICON from "../../assets/wallets/coinbase-icon.svg";
import WALLET_CONNECT_ICON from "../../assets/wallets/walletconnect-icon.svg";

import { useSyncExternalStore } from "react";

import { Connection, ConnectionType } from "./types";
import {
  getInjection,
  getIsCoinbaseWallet,
  getIsInjected,
  getIsMetaMaskWallet
} from "./utils";
import { WalletConnectV2 } from "./WalletConnectV2";
import { RPC_PROVIDERS } from "../../lib/const/providers";
import { isMobile } from "../../lib/userAgent/userAgent";
import { getRpcUrls } from "../../lib/const/networks";

function onError(error: Error) {
  console.debug(`web3-react error: ${error}`);
}

export const getNetworkConnection = ({
  defaultChainId
}: {
  defaultChainId: number;
}): Connection => {
  const [web3Network, web3NetworkHooks] = initializeConnector<Network>(
    (actions) =>
      new Network({
        actions,
        urlMap: RPC_PROVIDERS,
        defaultChainId: defaultChainId
      })
  );
  return {
    getName: () => "Network",
    connector: web3Network,
    hooks: web3NetworkHooks,
    type: ConnectionType.NETWORK,
    shouldDisplay: () => false
  };
};

const getIsCoinbaseWalletBrowser = () => isMobile && getIsCoinbaseWallet();
const getIsMetaMaskBrowser = () => isMobile && getIsMetaMaskWallet();
const getIsInjectedMobileBrowser = () =>
  getIsCoinbaseWalletBrowser() || getIsMetaMaskBrowser();

const getShouldAdvertiseMetaMask = () =>
  !getIsMetaMaskWallet() &&
  !isMobile &&
  (!getIsInjected() || getIsCoinbaseWallet());
const getIsGenericInjector = () =>
  getIsInjected() && !getIsMetaMaskWallet() && !getIsCoinbaseWallet();

const [web3Injected, web3InjectedHooks] = initializeConnector<MetaMask>(
  (actions) => new MetaMask({ actions, onError })
);

export const injectedConnection: Connection = {
  getName: () => getInjection().name,
  connector: web3Injected,
  hooks: web3InjectedHooks,
  type: ConnectionType.INJECTED,
  getIcon: (isDarkMode: boolean) => getInjection(isDarkMode).icon,
  shouldDisplay: () =>
    getIsMetaMaskWallet() ||
    getShouldAdvertiseMetaMask() ||
    getIsGenericInjector(),
  // If on non-injected, non-mobile browser, prompt user to install Metamask
  overrideActivate: () => {
    if (getShouldAdvertiseMetaMask()) {
      const windowToUse = window.top || window.parent;
      windowToUse.open("https://metamask.io/", "inst_metamask");
      return true;
    }
    return false;
  }
};
const [web3GnosisSafe, web3GnosisSafeHooks] = initializeConnector<GnosisSafe>(
  (actions) => new GnosisSafe({ actions })
);
export const gnosisSafeConnection: Connection = {
  getName: () => "Gnosis Safe",
  connector: web3GnosisSafe,
  hooks: web3GnosisSafeHooks,
  type: ConnectionType.GNOSIS_SAFE,
  getIcon: () => GNOSIS_ICON,
  shouldDisplay: () => false
};

export const getWalletConnectV2Connection = ({
  infuraKey,
  walletConnectProjectId,
  defaultChainId: argDefaultChainId
}: {
  infuraKey: string;
  walletConnectProjectId: string;
  defaultChainId: number;
}): Connection =>
  new (class implements Connection {
    private initializer = (
      actions: Actions,
      defaultChainId = argDefaultChainId
    ) =>
      new WalletConnectV2({
        actions,
        defaultChainId,
        onError,
        infuraKey,
        walletConnectProjectId
      });

    type = ConnectionType.WALLET_CONNECT_V2;
    getName = () => "WalletConnect";
    getIcon = () => WALLET_CONNECT_ICON;
    getProviderInfo = () => ({
      name: "WalletConnect",
      icon: WALLET_CONNECT_ICON
    });
    shouldDisplay = () => !getIsInjectedMobileBrowser();

    private activeConnector = initializeConnector<WalletConnectV2>(
      this.initializer
    );
    // The web3-react Provider requires referentially stable connectors, so we use proxies to allow lazy connections
    // whilst maintaining referential equality.
    private proxyConnector = new Proxy(
      {},
      {
        get: (target, p, receiver) =>
          Reflect.get(this.activeConnector[0], p, receiver),
        getOwnPropertyDescriptor: (target, p) =>
          Reflect.getOwnPropertyDescriptor(this.activeConnector[0], p),
        getPrototypeOf: () => WalletConnectV2.prototype,
        set: (target, p, receiver) =>
          Reflect.set(this.activeConnector[0], p, receiver)
      }
    ) as (typeof this.activeConnector)[0];
    private proxyHooks = new Proxy(
      {},
      {
        get: (target, p, receiver) => {
          return () => {
            // Because our connectors are referentially stable (through proxying), we need a way to trigger React renders
            // from outside of the React lifecycle when our connector is re-initialized. This is done via 'change' events
            // with `useSyncExternalStore`:
            const hooks = useSyncExternalStore(
              (onChange) => {
                this.onActivate = onChange;
                return () => (this.onActivate = undefined);
              },
              () => this.activeConnector[1]
            );
            return Reflect.get(hooks, p, receiver)();
          };
        }
      }
    ) as (typeof this.activeConnector)[1];

    private onActivate?: () => void;

    overrideActivate = (chainId?: ChainId) => {
      // Always re-create the connector, so that the chainId is updated.
      this.activeConnector = initializeConnector((actions) =>
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.initializer(actions, chainId)
      );
      this.onActivate?.();
      return false;
    };

    get connector() {
      return this.proxyConnector;
    }
    get hooks() {
      return this.proxyHooks;
    }
  })();

export const getCoinbaseWalletConnection = ({
  infuraKey,
  defaultChainId
}: {
  infuraKey: string;
  defaultChainId: ChainId;
}): Connection => {
  const RPC_URLS = getRpcUrls(infuraKey);
  const rpcUrl = RPC_URLS[defaultChainId as keyof typeof RPC_URLS];
  if (!rpcUrl) {
    throw new Error(
      `chain id is not supported!! ${defaultChainId}, check RPC_URLS keys:${Object.keys(RPC_URLS)}`
    );
  }
  const [web3CoinbaseWallet, web3CoinbaseWalletHooks] =
    initializeConnector<CoinbaseWallet>(
      (actions) =>
        new CoinbaseWallet({
          actions,
          options: {
            url: rpcUrl[0],
            appName: "Uniswap",
            appLogoUrl: UNISWAP_LOGO,
            reloadOnDisconnect: false
          },
          onError
        })
    );
  return {
    getName: () => "Coinbase Wallet",
    connector: web3CoinbaseWallet,
    hooks: web3CoinbaseWalletHooks,
    type: ConnectionType.COINBASE_WALLET,
    getIcon: () => COINBASE_ICON,
    shouldDisplay: () =>
      Boolean(
        (isMobile && !getIsInjectedMobileBrowser()) ||
          !isMobile ||
          getIsCoinbaseWalletBrowser()
      ),
    // If on a mobile browser that isn't the coinbase wallet browser, deeplink to the coinbase wallet app
    overrideActivate: () => {
      if (isMobile && !getIsInjectedMobileBrowser()) {
        const windowToUse = window.top || window.parent;
        windowToUse.open("https://go.cb-w.com/mtUDhEZPy1", "cbwallet");
        return true;
      }
      return false;
    }
  };
};
