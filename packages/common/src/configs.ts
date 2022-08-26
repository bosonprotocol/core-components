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
      // from https://github.com/bosonprotocol/boson-protocol-contracts/commit/25a707871f4117d29cd5536ef337841509bea2c8
      protocolDiamond: "0x156207E1ca9746e5a387930c8695d84bc8dAD69F",
      testErc20: "0x6aB7d764df1ac4Caa649d3f546e07E2fe44BF667"
    }
  },
  {
    envName: "staging_old",
    chainId: 3,
    subgraphUrl:
      "https://api.thegraph.com/subgraphs/name/dohaki/bosonccropsten",
    jsonRpcUrl: "https://ropsten.infura.io/v3/e8c25128908848db8cb65f595dc0a88f",
    ipfsMetadataUrl: "https://ipfs.infura.io:5001",
    widgetsUrl: "https://widgets-staging.on.fleek.co",
    contracts: {
      // from https://github.com/bosonprotocol/boson-protocol-contracts/commit/753ac3aa9cbea4f42236130808984121c65e76dc
      protocolDiamond: "0xDdAE2985Ca872B3E2974e296acF8931C0965801b"
    }
  },
  {
    envName: "staging",
    chainId: 80001,
    subgraphUrl:
      "https://api.thegraph.com/subgraphs/name/levalleux-ludo/bosonmumbai",
    jsonRpcUrl:
      "https://polygon-mumbai.infura.io/v3/b832a48b9bce4aa6bd9da86eb0126300",
    theGraphIpfsUrl: "https://ipfs.bsn-development-potassium.bosonportal.io",
    ipfsMetadataUrl: "https://ipfs.bsn-development-potassium.bosonportal.io",
    widgetsUrl: "https://widgets-staging.on.fleek.co",
    contracts: {
      // from https://github.com/bosonprotocol/boson-protocol-contracts/commit/dcce13d861b3bee561dc9e06a0e885cb708f7a83
      protocolDiamond: "0xA2D2D25530900d3BB7855050a164aB80Fed54a89"
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
      testErc20: "0x4c5859f0F772848b2D91F1D83E2Fe57935348029"
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
