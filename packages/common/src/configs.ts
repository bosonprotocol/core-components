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
    widgetsUrl: "https://widgets-test.on.fleek.co",
    contracts: {
      // from https://github.com/bosonprotocol/boson-protocol-contracts/commit/b128b0cc9e6e0a72e6b377573c5ccfa88643e6a5
      protocolDiamond: "0x559272B7186B3cFe55CE813FB36F52c0E8ad9778",
      testErc20: "0x6aB7d764df1ac4Caa649d3f546e07E2fe44BF667"
    }
  },
  {
    envName: "staging",
    chainId: 3,
    subgraphUrl:
      "https://api.thegraph.com/subgraphs/name/bosonprotocol/ropsten",
    jsonRpcUrl: "https://ropsten.infura.io/v3/e8c25128908848db8cb65f595dc0a88f",
    ipfsMetadataUrl: "https://ipfs.infura.io:5001",
    widgetsUrl: "https://widgets-staging.on.fleek.co",
    contracts: {
      // from https://github.com/bosonprotocol/boson-protocol-contracts/commit/753ac3aa9cbea4f42236130808984121c65e76dc
      protocolDiamond: "0xDdAE2985Ca872B3E2974e296acF8931C0965801b"
    }
  },
  {
    envName: "staging_next",
    chainId: 80001,
    subgraphUrl: "https://api.thegraph.com/subgraphs/name/bosonprotocol/mumbai",
    jsonRpcUrl: "https://ropsten.infura.io/v3/e8c25128908848db8cb65f595dc0a88f",
    ipfsMetadataUrl: "https://ipfs.infura.io:5001",
    widgetsUrl: "https://widgets-staging.on.fleek.co",
    contracts: {
      // from https://github.com/bosonprotocol/boson-protocol-contracts/commit/TBD
      protocolDiamond: "TBD"
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
      protocolDiamond: "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6",
      testErc20: "0xb7278A61aa25c888815aFC32Ad3cC52fF24fE575" // Foreign20 contract
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
