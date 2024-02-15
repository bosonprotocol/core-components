import { ChainId } from "@uniswap/sdk-core";
import EthereumLogo from "../../assets/svg/ethereum_square_logo.svg";
import AvaxLogo from "../../assets/svg/avax_logo.svg";
import BnbLogo from "../../assets/svg/bnb-logo.svg";
import CeloLogo from "../../assets/svg/celo_logo.svg";
import MaticLogo from "../../assets/svg/matic-token-icon.svg";

export function getNativeLogoURI(chainId: ChainId = ChainId.MAINNET): string {
  switch (chainId) {
    case ChainId.POLYGON:
    case ChainId.POLYGON_MUMBAI:
      return MaticLogo;
    case ChainId.BNB:
      return BnbLogo;
    case ChainId.CELO:
    case ChainId.CELO_ALFAJORES:
      return CeloLogo;
    case ChainId.AVALANCHE:
      return AvaxLogo;
    default:
      return EthereumLogo;
  }
}
