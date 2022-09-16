import { ProtocolConfig } from "./types";

const chainIdToInfo = new Map<number, ProtocolConfig["nativeCoin"]>([
  [1234, { decimals: "18", name: "Ether", symbol: "ETH" }],
  [3, { decimals: "18", name: "Ether", symbol: "ETH" }],
  [80001, { decimals: "18", name: "Matic", symbol: "MATIC" }],
  [137, { decimals: "18", name: "Matic", symbol: "MATIC" }],
  [1, { decimals: "18", name: "Ether", symbol: "ETH" }],
  [31337, { decimals: "18", name: "Ether", symbol: "ETH" }]
]);

export const defaultConfigs: ProtocolConfig[] = [
  {
    envName: "testing",
    chainId: 1234,
    nativeCoin: chainIdToInfo.get(1234),
    subgraphUrl:
      "https://graph.bsn-development-potassium.bosonportal.io/subgraphs/name/boson/corecomponents",
    jsonRpcUrl:
      "https://geth.bsn-development-potassium.bosonportal.io/ac012be65837ebc3134e/rpc",
    theGraphIpfsUrl: "https://ipfs.bsn-development-potassium.bosonportal.io",
    ipfsMetadataUrl: "https://ipfs.bsn-development-potassium.bosonportal.io",
    contracts: {
      // from https://github.com/bosonprotocol/boson-protocol-contracts/commit/b128b0cc9e6e0a72e6b377573c5ccfa88643e6a5
      protocolDiamond: "0x559272B7186B3cFe55CE813FB36F52c0E8ad9778",
      testErc20: "0x6aB7d764df1ac4Caa649d3f546e07E2fe44BF667"
    },
    metaTx: {
      relayerUrl: "http://localhost:8888/api/v1/meta-tx/native" //TODO: needs to be changed when meta-tx-gateway is hosted
    }
  },
  {
    envName: "staging_old",
    chainId: 3,
    nativeCoin: chainIdToInfo.get(3),
    subgraphUrl:
      "https://api.thegraph.com/subgraphs/name/dohaki/bosonccropsten",
    jsonRpcUrl: "https://ropsten.infura.io/v3/e8c25128908848db8cb65f595dc0a88f",
    theGraphIpfsUrl: "https://api.thegraph.com/ipfs/api/v0",
    ipfsMetadataUrl: "https://ipfs.infura.io:5001",
    contracts: {
      // from https://github.com/bosonprotocol/boson-protocol-contracts/commit/753ac3aa9cbea4f42236130808984121c65e76dc
      protocolDiamond: "0xDdAE2985Ca872B3E2974e296acF8931C0965801b"
    },
    metaTx: {
      relayerUrl: "TBD"
    }
  },
  {
    envName: "staging",
    chainId: 80001,
    nativeCoin: chainIdToInfo.get(80001),
    subgraphUrl:
      "https://api.thegraph.com/subgraphs/name/levalleux-ludo/bosonmumbai",
    jsonRpcUrl:
      "https://polygon-mumbai.infura.io/v3/b832a48b9bce4aa6bd9da86eb0126300",
    theGraphIpfsUrl: "https://api.thegraph.com/ipfs/api/v0",
    ipfsMetadataUrl: "https://ipfs.infura.io:5001",
    contracts: {
      // from https://github.com/bosonprotocol/boson-protocol-contracts/commit/a24305388c8a2b86cb59667e184677ab8862ebf2
      protocolDiamond: "0x1796B155D4A719d6eBe0496F4914c98a480e668C"
    },
    metaTx: {
      relayerUrl: "https://api.biconomy.io"
    }
  },
  {
    envName: "production",
    chainId: 1,
    nativeCoin: chainIdToInfo.get(1),
    subgraphUrl: "",
    jsonRpcUrl: "",
    ipfsMetadataUrl: "https://ipfs.infura.io:5001",
    contracts: {
      protocolDiamond: ""
    },
    metaTx: {
      relayerUrl: ""
    }
  },
  {
    envName: "local",
    chainId: 31337,
    nativeCoin: chainIdToInfo.get(31337),
    subgraphUrl: "http://127.0.0.1:8000/subgraphs/name/boson/corecomponents",
    jsonRpcUrl: "http://127.0.0.1:8545",
    theGraphIpfsUrl: "http://127.0.0.1:5001",
    ipfsMetadataUrl: "http://127.0.0.1:5001",
    contracts: {
      protocolDiamond: "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6",
      testErc20: "0xb7278A61aa25c888815aFC32Ad3cC52fF24fE575" // Foreign20 contract
    },
    metaTx: {
      relayerUrl: "http://localhost:8888/api/v1/meta-tx/native"
    }
  }
];

/**
 * Returns default config values based on provided `envName` or `chainId` that can be
 * used to instantiate a `CoreSDK` instance. The argument `envName` has a higher
 * specificity than `chainId`.
 * @param filter - Filter for default config.
 * @returns Default config.
 */
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

  if (!defaultConfig.nativeCoin) {
    throw new Error(
      `Native coin has not been set for this chainId=${defaultConfig.chainId}`
    );
  }

  return defaultConfig;
}
