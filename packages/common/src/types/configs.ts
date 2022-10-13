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

export type LensContracts = {
  LENS_HUB_CONTRACT?: string | undefined;
  LENS_PERIPHERY_CONTRACT?: string | undefined;
};

export type Lens = LensContracts & {
  apiLink: string;
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
  getTxExplorerUrl: undefined | ((txHash?: string) => string);
  subgraphUrl: string;
  theGraphIpfsUrl?: string;
  jsonRpcUrl: string;
  ipfsMetadataUrl: string;
  contracts: ContractAddresses;
  metaTx?: Partial<MetaTxConfig>;
  lens: Lens;
};
