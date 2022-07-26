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
      // from https://github.com/bosonprotocol/boson-protocol-contracts/commit/21169f69e685daa5fda5b748670ff907780923eb
      protocolDiamond: "0xA7568BAdD652721097Bc4ef17FE694Be119aC9Ff",
      testErc20: "0x6aB7d764df1ac4Caa649d3f546e07E2fe44BF667"
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
      // from https://github.com/bosonprotocol/boson-protocol-contracts/commit/d49be9f0f6de1c0b757b6fc0bbd0565b8c206286
      protocolDiamond: "0x951892e0d2534f479eC0C15C62e46F17a8bD6a59"
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
      protocolDiamond: "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853",
      testErc20: "0x998abeb3E57409262aE5b751f60747921B33613E"
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
