import { ChainId } from "@uniswap/sdk-core";
import EthereumLogo from "../../assets/svg/ethereum_square_logo.svg";
import MaticLogo from "../../assets/svg/matic-token-icon.svg";

export function getNativeLogoURI(chainId: ChainId = ChainId.MAINNET): string {
  switch (chainId) {
    case ChainId.POLYGON:
    case ChainId.POLYGON_MUMBAI:
      return MaticLogo;
    default:
      return EthereumLogo;
  }
}
