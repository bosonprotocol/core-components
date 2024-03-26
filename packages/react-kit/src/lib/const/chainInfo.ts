import { ChainId } from "@uniswap/sdk-core";
import ethereumLogoUrl from "../../assets/ethereum-logo.png";
import polygonCircleLogoUrl from "../../assets/polygonCircle.png";
import polygonMaticLogo from "../../assets/svg/polygon-matic-logo.svg";
import polygonSquareLogoUrl from "../../assets/svg/polygon_square_logo.svg";
import ms from "ms";

import { SupportedL1ChainId, SupportedL2ChainId } from "./chains";

export const AVERAGE_L1_BLOCK_TIME = ms(`12s`);

export enum NetworkType {
  L1,
  L2
}
interface BaseChainInfo {
  readonly networkType: NetworkType;
  readonly blockWaitMsBeforeWarning?: number;
  readonly docs: string;
  readonly bridge?: string;
  readonly explorer: string;
  readonly infoLink: string;
  readonly logoUrl: string;
  readonly circleLogoUrl?: string;
  readonly squareLogoUrl?: string;
  readonly label: string;
  readonly helpCenterUrl?: string;
  readonly nativeCurrency: {
    name: string; // e.g. 'Goerli ETH',
    symbol: string; // e.g. 'gorETH',
    decimals: number; // e.g. 18,
  };
  readonly color?: string;
  readonly backgroundColor?: string;
}

interface L1ChainInfo extends BaseChainInfo {
  readonly networkType: NetworkType.L1;
  readonly defaultListUrl?: string;
}

interface L2ChainInfo extends BaseChainInfo {
  readonly networkType: NetworkType.L2;
  readonly bridge: string;
  readonly statusPage?: string;
  readonly defaultListUrl: string;
}

const ChainId_POLYGON_AMOY = 80002; // TODO: upgrade @uniswap/sdk-core when featuring Amoy

type ChainInfoMap = {
  readonly [chainId: number]: L1ChainInfo | L2ChainInfo;
} & {
  readonly [chainId in SupportedL2ChainId]: L2ChainInfo;
} & { readonly [chainId in SupportedL1ChainId]: L1ChainInfo };

const CHAIN_INFO: ChainInfoMap = {
  [ChainId.MAINNET]: {
    networkType: NetworkType.L1,
    docs: "https://docs.uniswap.org/",
    explorer: "https://etherscan.io/",
    infoLink: "https://info.uniswap.org/#/",
    label: "Ethereum",
    logoUrl: ethereumLogoUrl,
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 }
  },
  [ChainId.GOERLI]: {
    networkType: NetworkType.L1,
    docs: "https://docs.uniswap.org/",
    explorer: "https://goerli.etherscan.io/",
    infoLink: "https://info.uniswap.org/#/",
    label: "Görli",
    logoUrl: ethereumLogoUrl,
    nativeCurrency: { name: "Görli Ether", symbol: "görETH", decimals: 18 }
  },
  [ChainId.SEPOLIA]: {
    networkType: NetworkType.L1,
    docs: "https://docs.uniswap.org/",
    explorer: "https://sepolia.etherscan.io/",
    infoLink: "https://info.uniswap.org/#/",
    label: "Sepolia",
    logoUrl: ethereumLogoUrl,
    nativeCurrency: { name: "Sepolia Ether", symbol: "sETH", decimals: 18 }
  },
  [ChainId.POLYGON]: {
    networkType: NetworkType.L1,
    blockWaitMsBeforeWarning: ms(`10m`),
    bridge: "https://wallet.polygon.technology/polygon/bridge",
    docs: "https://polygon.io/",
    explorer: "https://polygonscan.com/",
    infoLink: "https://info.uniswap.org/#/polygon/",
    label: "Polygon",
    logoUrl: polygonMaticLogo,
    circleLogoUrl: polygonCircleLogoUrl,
    squareLogoUrl: polygonSquareLogoUrl,
    nativeCurrency: { name: "Polygon Matic", symbol: "MATIC", decimals: 18 }
  },
  [ChainId.POLYGON_MUMBAI]: {
    networkType: NetworkType.L1,
    blockWaitMsBeforeWarning: ms(`10m`),
    bridge: "https://wallet.polygon.technology/polygon/bridge/deposit",
    docs: "https://polygon.io/",
    explorer: "https://mumbai.polygonscan.com/",
    infoLink: "https://info.uniswap.org/#/polygon/",
    label: "Polygon Mumbai",
    logoUrl: polygonMaticLogo,
    nativeCurrency: {
      name: "Polygon Mumbai Matic",
      symbol: "mMATIC",
      decimals: 18
    }
  },
  [ChainId_POLYGON_AMOY]: {
    networkType: NetworkType.L1,
    blockWaitMsBeforeWarning: ms(`10m`),
    bridge: "https://wallet.polygon.technology/polygon/bridge/deposit",
    docs: "https://polygon.io/",
    explorer: "https://mumbai.polygonscan.com/",
    infoLink: "https://info.uniswap.org/#/polygon/",
    label: "Polygon Amoy",
    logoUrl: polygonMaticLogo,
    nativeCurrency: {
      name: "Polygon Amoy Matic",
      symbol: "aMATIC",
      decimals: 18
    }
  }
} as const;

export function getChainInfo(
  chainId: SupportedL1ChainId,
  featureFlags?: Record<
    ChainId | SupportedL1ChainId | SupportedL2ChainId | number,
    boolean
  >
): L1ChainInfo;
export function getChainInfo(
  chainId: SupportedL2ChainId,
  featureFlags?: Record<
    ChainId | SupportedL1ChainId | SupportedL2ChainId | number,
    boolean
  >
): L2ChainInfo;
export function getChainInfo(
  chainId: ChainId,
  featureFlags?: Record<
    ChainId | SupportedL1ChainId | SupportedL2ChainId | number,
    boolean
  >
): L1ChainInfo | L2ChainInfo;
export function getChainInfo(
  chainId:
    | ChainId
    | SupportedL1ChainId
    | SupportedL2ChainId
    | number
    | undefined,
  featureFlags?: Record<
    ChainId | SupportedL1ChainId | SupportedL2ChainId | number,
    boolean
  >
): L1ChainInfo | L2ChainInfo | undefined;

/**
 * Overloaded method for returning ChainInfo given a chainID
 * Return type varies depending on input type:
 * number | undefined -> returns chaininfo | undefined
 * ChainId -> returns L1ChainInfo | L2ChainInfo
 * SupportedL1ChainId -> returns L1ChainInfo
 * SupportedL2ChainId -> returns L2ChainInfo
 */
export function getChainInfo(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chainId: any,
  featureFlags?: Record<
    ChainId | SupportedL1ChainId | SupportedL2ChainId | number,
    boolean
  >
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  if (featureFlags && chainId in featureFlags) {
    return featureFlags[chainId] ? CHAIN_INFO[chainId] : undefined;
  }
  if (chainId) {
    return CHAIN_INFO[chainId] ?? undefined;
  }
  return undefined;
}
