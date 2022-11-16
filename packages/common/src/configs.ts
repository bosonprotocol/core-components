import { EnvironmentType, Lens, ProtocolConfig } from "./types";

const chainIdToInfo = new Map<number, ProtocolConfig["nativeCoin"]>([
  [1234, { decimals: "18", name: "Ether", symbol: "ETH" }],
  [80001, { decimals: "18", name: "Matic", symbol: "MATIC" }],
  [137, { decimals: "18", name: "Matic", symbol: "MATIC" }],
  [1, { decimals: "18", name: "Ether", symbol: "ETH" }],
  [31337, { decimals: "18", name: "Ether", symbol: "ETH" }]
]);

const chainIdToGraphTx = new Map<
  number,
  (txHash?: string, isAddress?: boolean) => string
>([
  [
    1234,
    (txHash = "", isAddress = false) => {
      if (isAddress) {
        return `https://explorer.bsn-development-potassium.bosonportal.io/address/${txHash}`;
      }
      return `https://explorer.bsn-development-potassium.bosonportal.io/tx/${txHash}`;
    }
  ],
  [
    80001,
    (txHash = "", isAddress = false) => {
      if (isAddress) {
        return `https://mumbai.polygonscan.com/address/${txHash}`;
      }
      return `https://mumbai.polygonscan.com/tx/${txHash}`;
    }
  ],
  [
    137,
    (txHash = "", isAddress = false) => {
      if (isAddress) {
        return `https://polygonscan.com/address/${txHash}`;
      }
      return `https://polygonscan.com/tx/${txHash}`;
    }
  ],
  [
    1,
    (txHash = "", isAddress = false) => {
      if (isAddress) {
        return `https://etherscan.io/address/${txHash}`;
      }
      return `https://etherscan.io/tx/${txHash}`;
    }
  ],
  [31337, (txHash = "") => `${txHash}`] // TODO: add url
]);

// https://docs.lens.xyz/docs/deployed-contract-addresses
const chainIdToLensInfo = new Map<number, Lens>([
  [
    80001,
    {
      LENS_HUB_CONTRACT: "0x60Ae865ee4C725cd04353b5AAb364553f56ceF82",
      LENS_PERIPHERY_CONTRACT: "0xD5037d72877808cdE7F669563e9389930AF404E8",
      LENS_PROFILES_CONTRACT_ADDRESS:
        "0x60ae865ee4c725cd04353b5aab364553f56cef82",
      LENS_PROFILES_CONTRACT_PARTIAL_ABI:
        '[{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":true,"name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event","signature":"0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"}]',
      apiLink: "https://api-mumbai.lens.dev/",
      ipfsGateway: "https://lens.infura-ipfs.io/ipfs/"
    }
  ],
  [
    137,
    {
      LENS_HUB_CONTRACT: "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d",
      LENS_PERIPHERY_CONTRACT: "0xeff187b4190E551FC25a7fA4dFC6cf7fDeF7194f",
      LENS_PROFILES_CONTRACT_ADDRESS:
        "0xdb46d1dc155634fbc732f92e853b10b288ad5a1d",
      LENS_PROFILES_CONTRACT_PARTIAL_ABI:
        '[{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":true,"name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event","signature":"0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"}]',
      apiLink: "https://api.lens.dev",
      ipfsGateway: "https://lens.infura-ipfs.io/ipfs/"
    }
  ]
]);

export const defaultConfigs: ProtocolConfig[] = [
  {
    envName: "testing",
    chainId: 80001,
    nativeCoin: chainIdToInfo.get(80001),
    getTxExplorerUrl: chainIdToGraphTx.get(80001),
    subgraphUrl:
      "https://api.thegraph.com/subgraphs/name/bosonprotocol/mumbai-testing",
    jsonRpcUrl:
      "https://polygon-mumbai.infura.io/v3/b832a48b9bce4aa6bd9da86eb0126300",
    theGraphIpfsUrl: "https://api.thegraph.com/ipfs/api/v0",
    ipfsMetadataUrl: "https://ipfs.infura.io:5001",
    contracts: {
      // from https://github.com/bosonprotocol/boson-protocol-contracts/commit/8be49ba4ff83e80542e4a89bf674b0799f1ee913
      protocolDiamond: "0x785a225EBAC1b600cA3170C6c7fA3488A203Fc21"
    },
    metaTx: {
      relayerUrl: "https://api.biconomy.io"
    },
    lens: {
      ...(chainIdToLensInfo.has(80001) && chainIdToLensInfo.get(80001))
    }
  },
  {
    envName: "staging",
    chainId: 80001,
    nativeCoin: chainIdToInfo.get(80001),
    getTxExplorerUrl: chainIdToGraphTx.get(80001),
    subgraphUrl:
      "https://api.thegraph.com/subgraphs/name/bosonprotocol/mumbai-staging",
    jsonRpcUrl:
      "https://polygon-mumbai.infura.io/v3/b832a48b9bce4aa6bd9da86eb0126300",
    theGraphIpfsUrl: "https://api.thegraph.com/ipfs/api/v0",
    ipfsMetadataUrl: "https://ipfs.infura.io:5001",
    contracts: {
      // from https://github.com/bosonprotocol/boson-protocol-contracts/commit/8be49ba4ff83e80542e4a89bf674b0799f1ee913
      protocolDiamond: "0x5099CA7839e1580bD0C12FC5FECfA45147886BeB"
    },
    metaTx: {
      relayerUrl: "https://api.biconomy.io"
    },
    lens: {
      ...(chainIdToLensInfo.has(80001) && chainIdToLensInfo.get(80001))
    }
  },
  {
    envName: "production",
    chainId: 137,
    nativeCoin: chainIdToInfo.get(137),
    getTxExplorerUrl: chainIdToGraphTx.get(137),

    subgraphUrl:
      "https://api.thegraph.com/subgraphs/name/bosonprotocol/polygon",
    jsonRpcUrl:
      "https://polygon-mainnet.infura.io/v3/383117b55d614525b07f03b5979c5f19",
    theGraphIpfsUrl: "https://api.thegraph.com/ipfs/api/v0",
    ipfsMetadataUrl: "https://ipfs.infura.io:5001",
    contracts: {
      protocolDiamond: "0x59A4C19b55193D5a2EAD0065c54af4d516E18Cb5"
    },
    metaTx: {
      relayerUrl: "https://api.biconomy.io"
    },
    lens: {
      ...(chainIdToLensInfo.has(137) && chainIdToLensInfo.get(137))
    }
  },
  {
    envName: "local",
    chainId: 31337,
    nativeCoin: chainIdToInfo.get(31337),
    getTxExplorerUrl: chainIdToGraphTx.get(31337),
    subgraphUrl: "http://127.0.0.1:8000/subgraphs/name/boson/corecomponents",
    jsonRpcUrl: "http://127.0.0.1:8545",
    theGraphIpfsUrl: "http://127.0.0.1:5001",
    ipfsMetadataUrl: "http://127.0.0.1:5001",
    contracts: {
      protocolDiamond: "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6",
      testErc20: "0xb7278A61aa25c888815aFC32Ad3cC52fF24fE575", // Foreign20 contract
      testErc721: "0xCD8a1C3ba11CF5ECfa6267617243239504a98d90", // Foreign721 contract
      testErc1155: "0x82e01223d51Eb87e16A03E24687EDF0F294da6f1" // Foreign1155 contract
    },
    metaTx: {
      relayerUrl: "http://localhost:8888"
    },
    lens: {
      LENS_HUB_CONTRACT: "0x2bdCC0de6bE1f7D2ee689a0342D76F52E8EFABa3",
      LENS_PERIPHERY_CONTRACT: "0x0000000000000000000000000000000000000000"
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
