import { ChainId } from "@bosonprotocol/common";
import { Chain as OSChain } from "opensea-js";

export function getOpenSeaChain(chainId: ChainId): OSChain {
  switch (chainId) {
    case 1: {
      return OSChain.Mainnet;
    }
    case 137: {
      return OSChain.Polygon;
    }
    case 80002: {
      return OSChain.Amoy;
    }
    case 11155111: {
      return OSChain.Sepolia;
    }
    case 31337: {
      return "hardhat" as OSChain;
    }
    default: {
      throw new Error(`Chain ${chainId} not supported`);
    }
  }
}
