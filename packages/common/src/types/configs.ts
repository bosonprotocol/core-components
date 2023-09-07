import { abis } from "..";
import type { chains } from "../chains";

export type ContractAddresses = {
  protocolDiamond: string;
  testErc721?: string;
  testErc20?: string;
  testErc1155?: string;
  forwarder: string;
  seaport?: string;
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
  ipfsGateway?: string | undefined;
};

export type ChainId = typeof chains[keyof typeof chains];

export type ConfigId =
  | "local-31337-0"
  | "testing-80001-0"
  | "testing-5-0"
  | "staging-80001-0"
  | "production-137-0";

export type Token = {
  symbol: string;
  name: string;
  address: string;
  decimals: string;
};

export type ProtocolConfig = {
  envName: EnvironmentType;
  configId: ConfigId;
  defaultTokens: Token[] | undefined;
  defaultDisputeResolverId: string;
  sellersBlackList: string;
  chainId: ChainId;
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
  lens: Lens | null;
};
