import { ChainId } from "@uniswap/sdk-core";
import EthereumLogo from "../../assets/svg/ethereum_square_logo.svg";
import MaticLogo from "../../assets/svg/matic-token-icon.svg";
import { ChainId_POLYGON_AMOY } from "../const/chainInfo";

export function getNativeLogoURI(
  chainId: ChainId | typeof ChainId_POLYGON_AMOY = ChainId.MAINNET
): string {
  switch (chainId) {
    case ChainId.POLYGON:
    case ChainId.POLYGON_MUMBAI:
    case ChainId_POLYGON_AMOY:
      return MaticLogo;
    default:
      return EthereumLogo;
  }
}
