import { EnvironmentType, ProtocolConfig } from "./types";

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
    chainId: 80001,
    nativeCoin: chainIdToInfo.get(80001),
    subgraphUrl:
      "https://api.thegraph.com/subgraphs/name/levalleux-ludo/bosontesting",
    jsonRpcUrl:
      "https://polygon-mumbai.infura.io/v3/b832a48b9bce4aa6bd9da86eb0126300",
    theGraphIpfsUrl: "https://api.thegraph.com/ipfs/api/v0",
    ipfsMetadataUrl: "https://ipfs.infura.io:5001",
    contracts: {
      // from https://github.com/bosonprotocol/boson-protocol-contracts/commit/8fc9ee1affbcef914d1c29525b5addd362998ded
      protocolDiamond: "0xC95834A64c2De9AaCA8960465886EF265c26fa5A"
    },
    metaTx: {
      relayerUrl: "https://api.biconomy.io"
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
      // from https://github.com/bosonprotocol/boson-protocol-contracts/commit/8fc9ee1affbcef914d1c29525b5addd362998ded
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
export function getDefaultConfig(envName: EnvironmentType): ProtocolConfig {
  if (!envName) {
    throw new Error(`envName has to be set`);
  }

  const [defaultConfig] = defaultConfigs.filter((config) => {
    return config.envName === envName;
  });

  if (!defaultConfig) {
    throw new Error(`Could not find default config for envName ${envName}`);
  }

  if (!defaultConfig.nativeCoin) {
    throw new Error(
      `Native coin has not been set for this chainId=${defaultConfig.chainId}`
    );
  }

  return defaultConfig;
}
