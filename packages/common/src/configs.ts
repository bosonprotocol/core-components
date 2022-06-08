import { ProtocolConfig } from "./types";

export const defaultConfigs: ProtocolConfig[] = [
  {
    envName: "testing",
    chainId: 1234,
    subgraphUrl:
      "https://graph.bsn-development-potassium.bosonportal.io/subgraphs/name/boson/corecomponents",
    jsonRpcUrl:
      "https://geth.bsn-development-potassium.bosonportal.io/ac012be65837ebc3134e/rpc",
    theGraphIpfsUrl: "https://ipfs.bsn-development-potassium.bosonportal.io",
    ipfsMetadataUrl: "https://ipfs.bsn-development-potassium.bosonportal.io",
    widgetsUrl: "https://boson-widgets-testing.surge.sh",
    contracts: {
      // from https://github.com/bosonprotocol/boson-protocol-contracts/actions/runs/2195933699
      protocolDiamond: "0xd2a2c7E31b1F23d3Ca85e21858EB2FC453a14531"
    }
  },
  {
    envName: "staging",
    chainId: 3,
    subgraphUrl:
      "https://api.thegraph.com/subgraphs/name/dohaki/bosonccropsten",
    jsonRpcUrl: "https://ropsten.infura.io/v3/e8c25128908848db8cb65f595dc0a88f",
    ipfsMetadataUrl: "https://ipfs.infura.io:5001",
    widgetsUrl: "https://boson-widgets-staging.surge.sh",
    contracts: {
      // from https://github.com/bosonprotocol/boson-protocol-contracts/actions/runs/2195933699
      protocolDiamond: "0xcb936f50e21A5Fd16960f67f90b2DC9dA495Ad59"
    }
  },
  {
    envName: "production",
    chainId: 1,
    subgraphUrl: "",
    jsonRpcUrl: "",
    ipfsMetadataUrl: "https://ipfs.infura.io:5001",
    widgetsUrl: "", // TODO: replace with prod
    contracts: {
      protocolDiamond: ""
    }
  },
  {
    envName: "local",
    chainId: 31337,
    subgraphUrl: "http://127.0.0.1:8000/subgraphs/name/boson/corecomponents",
    jsonRpcUrl: "http://127.0.0.1:8545",
    theGraphIpfsUrl: "http://127.0.0.1:5001",
    ipfsMetadataUrl: "http://127.0.0.1:5001",
    widgetsUrl: "http://127.0.0.1:3000",
    contracts: {
      // from https://github.com/bosonprotocol/boson-protocol-contracts/actions/runs/2195933699
      protocolDiamond: "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853"
    }
  }
];

export function getDefaultConfig(filter: {
  envName?: string;
  chainId?: number;
}): ProtocolConfig {
  const { envName, chainId } = filter;
  console.log(envName);

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
