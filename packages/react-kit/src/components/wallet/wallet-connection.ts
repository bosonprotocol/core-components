import { EnvironmentType } from "@bosonprotocol/core-sdk";
import { Chain, connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  walletConnectWallet
} from "@rainbow-me/rainbowkit/wallets";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { configureChains, createConfig } from "wagmi";
import { polygon, polygonMumbai } from "wagmi/chains";

const chainPerEnviromnent: Record<EnvironmentType, Chain> = {
  local: polygonMumbai,
  testing: polygonMumbai,
  staging: polygonMumbai,
  production: polygon
};

function getChainForEnvironment(envName: EnvironmentType): Array<Chain> {
  const chain = chainPerEnviromnent[envName];
  return [chain];
}

const getConfigureChains = (envName: EnvironmentType) =>
  configureChains(getChainForEnvironment(envName), [
    jsonRpcProvider({
      rpc: (chain: Chain) => {
        return {
          http: chain.rpcUrls.default.http[0],
          webSocket: chain.rpcUrls.default.webSocket?.[0]
        };
      }
    })
  ]);

export const _getWagmiConfig = (
  envName: EnvironmentType,
  projectId: string
) => {
  const { publicClient, chains } = getConfigureChains(envName);
  const connectors = connectorsForWallets([
    {
      groupName: "Popular",
      wallets: [
        metaMaskWallet({ chains, projectId }),
        walletConnectWallet({ chains, projectId })
      ]
    }
  ]);
  return {
    wagmiConfig: createConfig({
      autoConnect: true,
      connectors,
      publicClient
    }),
    chains
  };
};
