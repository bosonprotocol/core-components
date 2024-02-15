import { ChainId } from "@uniswap/sdk-core";
export const CHAIN_IDS_TO_NAMES = {
  [ChainId.MAINNET]: "mainnet",
  [ChainId.GOERLI]: "goerli",
  [ChainId.SEPOLIA]: "sepolia",
  [ChainId.POLYGON]: "polygon",
  [ChainId.POLYGON_MUMBAI]: "polygon_mumbai",
  [ChainId.CELO]: "celo",
  [ChainId.CELO_ALFAJORES]: "celo_alfajores",
  [ChainId.ARBITRUM_ONE]: "arbitrum",
  [ChainId.ARBITRUM_GOERLI]: "arbitrum_goerli",
  [ChainId.OPTIMISM]: "optimism",
  [ChainId.OPTIMISM_GOERLI]: "optimism_goerli",
  [ChainId.BNB]: "bnb",
  [ChainId.AVALANCHE]: "avalanche",
  [ChainId.BASE]: "base",
  [ChainId.BASE_GOERLI]: "base_goerli"
  // [LocalChainId]: "local"
} as const;
/**
 * All the chain IDs that are running the Ethereum protocol.
 */
export const L1_CHAIN_IDS = [
  ChainId.MAINNET,
  ChainId.GOERLI,
  // ChainId.SEPOLIA,
  ChainId.POLYGON,
  ChainId.POLYGON_MUMBAI
  // LocalChainId
  // ChainId.CELO,
  // ChainId.CELO_ALFAJORES
  // ChainId.BNB,
  // ChainId.AVALANCHE
] as const;

export type SupportedL1ChainId = typeof L1_CHAIN_IDS[number];

/**
 * Controls some L2 specific behavior, e.g. slippage tolerance, special UI behavior.
 * The expectation is that all of these networks have immediate transaction confirmation.
 */
export const L2_CHAIN_IDS = [
  // ChainId.ARBITRUM_ONE,
  // ChainId.ARBITRUM_GOERLI,
  // ChainId.OPTIMISM,
  // ChainId.OPTIMISM_GOERLI
  // ChainId.BASE,
  // ChainId.BASE_GOERLI
] as const;

export type SupportedL2ChainId = typeof L2_CHAIN_IDS[number];

export function isUniswapXSupportedChain(chainId: number) {
  return chainId === ChainId.MAINNET;
}
