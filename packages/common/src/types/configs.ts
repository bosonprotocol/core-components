export type ContractAddresses = {
  protocolDiamond: string;
  testErc20?: string;
};

export type ProtocolConfig = {
  envName: string;
  chainId: number;
  subgraphUrl: string;
  theGraphIpfsUrl?: string;
  jsonRpcUrl: string;
  ipfsMetadataUrl: string;
  widgetsUrl: string;
  contracts: ContractAddresses;
};
