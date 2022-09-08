export type ContractAddresses = {
  protocolDiamond: string;
  testErc20?: string;
};

export type MetaTxConfig = {
  relayerUrl: string;
  apiId: string;
};

export type ProtocolConfig = {
  envName: string;
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
  metaTx?: MetaTxConfig;
};
