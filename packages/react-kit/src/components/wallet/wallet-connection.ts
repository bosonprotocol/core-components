import { Chain, connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  walletConnectWallet,
  coinbaseWallet
} from "@rainbow-me/rainbowkit/wallets";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { configureChains, createConfig } from "wagmi";
import * as wagmiChains from "wagmi/chains";
import { useMemo } from "react";
import { useConfigContext } from "../config/ConfigContext";

function getChain(
  chainId: number
): [(typeof wagmiChains)[keyof typeof wagmiChains]] {
  const chain = Object.values(wagmiChains).find(
    (chain) => chain.id === chainId
  );
  if (!chain) {
    if (chainId === 80002) {
      // Amoy config, from https://github.com/wevm/viem/pull/1787
      return [
        {
          id: 80_002,
          name: "Polygon Amoy",
          nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
          rpcUrls: {
            default: {
              http: ["https://rpc-amoy.polygon.technology"]
            }
          },
          blockExplorers: {
            default: {
              name: "OK LINK",
              url: "https://www.oklink.com/amoy"
            }
          },
          testnet: true
        } as unknown as (typeof wagmiChains)[keyof typeof wagmiChains] // Force casting
      ];
    }
    throw new Error(`Cannot find a chain with id ${chainId} in wagmiChains`);
  }
  return [chain];
}

export function getConnectors(chainId: number, walletConnectProjectId: string) {
  const { publicClient, chains } = configureChains(getChain(chainId), [
    jsonRpcProvider({
      rpc: (chain: Chain) => {
        return {
          http: chain.rpcUrls.default.http[0],
          webSocket: chain.rpcUrls.default.webSocket?.[0]
        };
      }
    })
  ]);

  const projectId = walletConnectProjectId;
  const connectors = connectorsForWallets([
    {
      groupName: "Popular",
      wallets: [
        metaMaskWallet({
          chains,
          projectId,
          shimDisconnect: true,
          UNSTABLE_shimOnConnectSelectAccount: true
          // shimDisconnect and UNSTABLE_shimOnConnectSelectAccount options required
          // to really disconnect metamask if the connected wallet if not the expected one,
          // and let the user chose another account
        }),
        walletConnectWallet({ chains, projectId }),
        coinbaseWallet({
          appName: "Boson Widgets",
          chains
        })
      ]
    }
  ]);
  return { connectors, publicClient, chains };
}

export const useWagmiConfig = (walletConnectProjectId: string) => {
  const { config } = useConfigContext();
  return useMemo(() => {
    const { connectors, publicClient, chains } = getConnectors(
      config.chainId,
      walletConnectProjectId
    );
    const wagmiConfig = createConfig({
      autoConnect: true,
      connectors,
      publicClient
    });
    return { wagmiConfig, chains };
  }, [config.chainId, walletConnectProjectId]);
};
