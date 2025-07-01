import { abis } from "..";
import type { chains } from "../chains";

export type ContractAddresses = {
  protocolDiamond: string;
  priceDiscoveryClient: string;
  testErc721?: string;
  testErc20?: string;
  testErc1155?: string;
  forwarder: string;
  seaport?: string;
  openseaWrapper?: string;
};

export type EnvironmentType = "local" | "testing" | "staging" | "production";

export type MetaTxConfig = {
  relayerUrl: string;
  apiKey: string;
  apiIds: Record<string, Record<string, string>>;
  forwarderAbi: typeof abis.MockForwarderABI | typeof abis.BiconomyForwarderABI;
};

export type LensContracts = {
  LENS_HUB_CONTRACT?: string | undefined;
  LENS_PERIPHERY_CONTRACT?: string | undefined;
  LENS_PROFILES_CONTRACT_ADDRESS?: string | undefined;
  LENS_PROFILES_CONTRACT_PARTIAL_ABI?: string | undefined;
};

export type Lens = LensContracts & {
  apiLink?: string;
};

export type ChainId = (typeof chains)[keyof typeof chains];

export type ConfigId =
  | "local-31337-0"
  | "testing-80002-0"
  | "testing-84532-0"
  | "testing-11155111-0"
  | "testing-11155420-0"
  | "testing-421614-0"
  | "staging-80002-0"
  | "staging-84532-0"
  | "staging-11155111-0"
  | "staging-11155420-0"
  | "staging-421614-0"
  | "production-137-0"
  | "production-42161-0"
  | "production-8453-0"
  | "production-10-0"
  | "production-1-0";

export type Token = {
  symbol: string;
  name: string;
  address: string;
  decimals: string;
};

// Helper type to extract chainId from configId string
type ExtractChainId<T extends string> =
  T extends `${string}-${infer ChainId}-${string}`
    ? ChainId extends `${number}`
      ? ChainId
      : never
    : never;

// Helper type to convert string to number
type StringToNumber<T extends string> = T extends `${infer N extends number}`
  ? N
  : never;

// Helper type to create valid combinations dynamically from ConfigId
type ValidConfigChainCombination<T extends EnvironmentType> = {
  [K in Extract<ConfigId, `${T}-${string}`>]: {
    configId: K;
    chainId: StringToNumber<ExtractChainId<K>>;
  };
}[Extract<ConfigId, `${T}-${string}`>];

export type ProtocolConfig<T extends EnvironmentType = EnvironmentType> = {
  envName: T;
  defaultTokens: Token[] | undefined;
  defaultDisputeResolverId: string;
  sellersBlackList: string;
  offersWhiteList: string;
  nativeCoin:
    | undefined
    | {
        symbol: string;
        name: string;
        decimals: string;
      };
  getTxExplorerUrl:
    | undefined
    | ((txHash?: string, isAddress?: boolean) => string);
  subgraphUrl: string;
  theGraphIpfsUrl?: string;
  jsonRpcUrl: string;
  ipfsMetadataUrl: string;
  contracts: ContractAddresses;
  metaTx?: Partial<MetaTxConfig>;
  lens: Lens | undefined;
} & ValidConfigChainCombination<T>;

export type CoreProtocolConfig = Pick<
  ProtocolConfig,
  "envName" | "chainId" | "configId"
>;

export type ProtocolAddressesConfig = Record<
  EnvironmentType,
  Record<
    ChainId,
    {
      protocolDiamond: string;
      priceDiscoveryClient: string;
    }
  >
>;
