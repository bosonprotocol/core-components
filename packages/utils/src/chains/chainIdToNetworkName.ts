import { ChainId } from "@uniswap/sdk-core";

type Network =
  | "ethereum"
  | "arbitrum"
  | "optimism"
  | "polygon"
  | "smartchain"
  | "celo"
  | "avalanchec";

export function chainIdToNetworkName(networkId: ChainId): Network {
  switch (networkId) {
    case ChainId.MAINNET:
      return "ethereum";
    case ChainId.ARBITRUM_ONE:
      return "arbitrum";
    case ChainId.OPTIMISM:
      return "optimism";
    case ChainId.POLYGON:
      return "polygon";
    case ChainId.BNB:
      return "smartchain";
    case ChainId.CELO:
      return "celo";
    case ChainId.AVALANCHE:
      return "avalanchec";
    default:
      return "ethereum";
  }
}
