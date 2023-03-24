import { Chain, connectorsForWallets, wallet } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

type EnvironmentType = "local" | "testing" | "staging" | "production"; // TODO: export EnvironmentType in react-kit

const chainPerEnviromnent: Record<EnvironmentType, Chain> = {
  local: chain.polygonMumbai,
  testing: chain.polygonMumbai,
  staging: chain.polygonMumbai,
  production: chain.polygon
};

function getChainForEnvironment(envName: EnvironmentType): Array<Chain> {
  const chain = chainPerEnviromnent[envName];
  return [chain];
}

const getConfigureChains = (envName: EnvironmentType) =>
  configureChains(getChainForEnvironment(envName), [
    jsonRpcProvider({
      rpc: (chain: Chain) => ({ http: chain.rpcUrls.default })
    })
  ]);

export const getWagmiClient = (envName: EnvironmentType) => {
  const { provider, chains } = getConfigureChains(envName);
  const connectors = connectorsForWallets([
    {
      groupName: "Popular",
      wallets: [wallet.metaMask({ chains }), wallet.walletConnect({ chains })]
    }
  ]);
  return {
    wagmiClient: createClient({
      autoConnect: true,
      connectors,
      provider
    }),
    chains
  };
};
