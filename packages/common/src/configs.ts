import { ProtocolConfig } from "./types";

export const defaultConfigs: ProtocolConfig[] = [
  {
    envName: "local",
    chainId: 31337,
    subgraphUrl: "http://localhost:8000/subgraphs/name/boson/corecomponents",
    jsonRpcUrl: "http://localhost:8545",
    theGraphIpfsUrl: "http://localhost:5001",
    ipfsMetadataUrl: "http://localhost:5001",
    contracts: {
      protocolDiamond: "0xad7A37a28923a9534809eEdE6c783a1F22df1c2b"
    }
  },
  {
    envName: "testing",
    chainId: 3,
    subgraphUrl:
      "https://api.thegraph.com/subgraphs/name/dohaki/bosonccropsten",
    jsonRpcUrl: "https://ropsten.infura.io/v3/e8c25128908848db8cb65f595dc0a88f",
    ipfsMetadataUrl: "https://ipfs.infura.io:5001",
    contracts: {
      protocolDiamond: "0x5E3f5127e320aD0C38a21970E327eefEf12561E5"
    }
  },
  {
    envName: "staging",
    chainId: 4,
    subgraphUrl: "",
    jsonRpcUrl: "",
    ipfsMetadataUrl: "https://ipfs.infura.io:5001",
    contracts: {
      protocolDiamond: ""
    }
  },
  {
    envName: "production",
    chainId: 1,
    subgraphUrl: "",
    jsonRpcUrl: "",
    ipfsMetadataUrl: "https://ipfs.infura.io:5001",
    contracts: {
      protocolDiamond: ""
    }
  }
];

export function getDefaultConfig(filter: {
  envName?: string;
  chainId?: number;
}): ProtocolConfig {
  const { envName, chainId } = filter;

  if (!envName && !chainId) {
    throw new Error(`filter.envName or filter.chainId has to be set`);
  }

  const [defaultConfig] = defaultConfigs.filter((config) => {
    if (envName) {
      return config.envName === envName;
    }

    return config.chainId === chainId;
  });

  if (!defaultConfig) {
    throw new Error(
      `Could not find default config for filter ${JSON.stringify(
        envName ? { envName } : { chainId }
      )}`
    );
  }

  return defaultConfig;
}
