export type ContractAddresses = {
  protocolDiamond: string;
  testErc20?: string;
};

export type EnvironmentType = "local" | "testing" | "staging" | "production";

export type MetaTxConfig = {
  relayerUrl: string;
  apiKey: string;
  apiId: string;
};

export type ProtocolConfig = {
  envName: EnvironmentType;
  chainId: number;
  nativeCoin?: {
    symbol: string;
    name: string;
    decimals: string;
  };
  subgraphUrl: string;
  theGraphIpfsUrl?: string;
  jsonRpcUrl: string;
  ipfsMetadataUrl: string;
  contracts: ContractAddresses;
  metaTx?: Partial<MetaTxConfig>;
};
