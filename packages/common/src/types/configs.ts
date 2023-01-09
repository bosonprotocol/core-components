export type ContractAddresses = {
  protocolDiamond: string;
  testErc721?: string;
  testErc20?: string;
  testErc1155?: string;
};

export type EnvironmentType = "local" | "testing" | "staging" | "production";

export type MetaTxConfig = {
  relayerUrl: string;
  apiKey: string;
  apiIds: Record<string, Record<string, string>>;
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

export type ProtocolConfig = {
  envName: EnvironmentType;
  chainId: number;
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
  lens: Lens;
};
