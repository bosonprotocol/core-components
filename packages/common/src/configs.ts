import { abis } from ".";
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

export const envConfigs: Record<EnvironmentType, ProtocolConfig[]> = {
  local: [
    {
      envName: "local",
      chainId: 31337,
      configId: "local-31337-0",
      nativeCoin: chainIdToInfo.get(31337),
      getTxExplorerUrl: chainIdToGraphTx.get(31337),
      subgraphUrl: "http://127.0.0.1:8000/subgraphs/name/boson/corecomponents",
      jsonRpcUrl: "http://127.0.0.1:8545",
      theGraphIpfsUrl: "http://127.0.0.1:5001",
      ipfsMetadataUrl: "http://127.0.0.1:5001",
      contracts: {
        protocolDiamond: "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853",
        testErc20: "0x95401dc811bb5740090279Ba06cfA8fcF6113778", // Foreign20 contract
        testErc721: "0x998abeb3E57409262aE5b751f60747921B33613E", // Foreign721 contract
        testErc1155: "0x70e0bA845a1A0F2DA3359C97E0285013525FFC49", // Foreign1155 contract
        forwarder: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0", // MockForwarder contract
        seaport: "0x99bbA657f2BbC93c02D617f8bA121cB8Fc104Acf" // MockSeaport contract
      },
      metaTx: {
        relayerUrl: "http://localhost:8888",
        forwarderAbi: abis.MockForwarderABI
      },
      lens: {
        LENS_HUB_CONTRACT: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        LENS_PERIPHERY_CONTRACT: "0x0000000000000000000000000000000000000000"
      }
    }
  ],
  testing: [
    {
      envName: "testing",
      chainId: 80001,
      configId: "testing-80001-0",
      nativeCoin: chainIdToInfo.get(80001),
      getTxExplorerUrl: chainIdToGraphTx.get(80001),
      subgraphUrl:
        "https://api.thegraph.com/subgraphs/name/bosonprotocol/mumbai-testing",
      jsonRpcUrl:
        "https://polygon-mumbai.infura.io/v3/b832a48b9bce4aa6bd9da86eb0126300",
      theGraphIpfsUrl: "https://api.thegraph.com/ipfs/api/v0",
      ipfsMetadataUrl: "https://ipfs.infura.io:5001",
      contracts: {
        // from https://github.com/bosonprotocol/boson-protocol-contracts/commit/e08ee49714dd5a4c8d7f3916d27027e699b3b674
        protocolDiamond: "0x76051FC05Ab42D912a737d59a8711f1446712630",
        forwarder: "0x69015912AA33720b842dCD6aC059Ed623F28d9f7" // https://docs.biconomy.io/misc/contract-addresses
      },
      metaTx: {
        relayerUrl: "https://api.biconomy.io",
        forwarderAbi: abis.BiconomyForwarderABI
      },
      lens: {
        ...(chainIdToLensInfo.has(80001) && chainIdToLensInfo.get(80001))
      }
    }
  ],
  staging: [
    {
      envName: "staging",
      chainId: 80001,
      configId: "staging-80001-0",
      nativeCoin: chainIdToInfo.get(80001),
      getTxExplorerUrl: chainIdToGraphTx.get(80001),
      subgraphUrl:
        "https://api.thegraph.com/subgraphs/name/bosonprotocol/mumbai-staging",
      jsonRpcUrl:
        "https://polygon-mumbai.infura.io/v3/b832a48b9bce4aa6bd9da86eb0126300",
      theGraphIpfsUrl: "https://api.thegraph.com/ipfs/api/v0",
      ipfsMetadataUrl: "https://ipfs.infura.io:5001",
      contracts: {
        // from https://github.com/bosonprotocol/boson-protocol-contracts/commit/e7668625ef01ce53ee14667b960e858bc33726fb
        protocolDiamond: "0xf9719c7e641964D83cC50ea2d4d0D4e6C300d50E",
        forwarder: "0x69015912AA33720b842dCD6aC059Ed623F28d9f7"
      },
      metaTx: {
        relayerUrl: "https://api.biconomy.io",
        forwarderAbi: abis.BiconomyForwarderABI
      },
      lens: {
        ...(chainIdToLensInfo.has(80001) && chainIdToLensInfo.get(80001))
      }
    }
  ],
  production: [
    {
      envName: "production",
      chainId: 137,
      configId: "production-137-0",
      nativeCoin: chainIdToInfo.get(137),
      getTxExplorerUrl: chainIdToGraphTx.get(137),
      subgraphUrl:
        "https://api.thegraph.com/subgraphs/name/bosonprotocol/polygon",
      jsonRpcUrl:
        "https://polygon-mainnet.infura.io/v3/383117b55d614525b07f03b5979c5f19",
      theGraphIpfsUrl: "https://api.thegraph.com/ipfs/api/v0",
      ipfsMetadataUrl: "https://ipfs.infura.io:5001",
      contracts: {
        protocolDiamond: "0x59A4C19b55193D5a2EAD0065c54af4d516E18Cb5",
        forwarder: "0xf0511f123164602042ab2bCF02111fA5D3Fe97CD"
      },
      metaTx: {
        relayerUrl: "https://api.biconomy.io",
        forwarderAbi: abis.BiconomyForwarderABI
      },
      lens: {
        ...(chainIdToLensInfo.has(137) && chainIdToLensInfo.get(137))
      }
    }
  ]
};

/**
 * Returns configs based on provided `envName` that can be
 * used to instantiate a `CoreSDK` instance.
 * @param envName - local, testing, staging or production
 * @returns an array of possible configs for CoreSDK
 */
export function getEnvConfigs(envName: EnvironmentType): ProtocolConfig[] {
  if (!envName) {
    throw new Error(`envName has to be set`);
  }
  const configs = envConfigs[envName];
  if (!configs) {
    throw new Error(`Could not find default config for envName ${envName}`);
  }
  configs.forEach((config) => {
    if (!config.nativeCoin) {
      throw new Error(
        `Native coin has not been set for this chainId=${config.chainId}`
      );
    }
  });
  return configs;
}

/**
 * Returns a config based on provided `envName` and `configId` that can be
 * used to instantiate a `CoreSDK` instance.
 * @param envName - local, testing, staging or production
 * @param configId - it should follow the following pattern `${envName}-${chainId}-${number}`
 * @returns a config for CoreSDK
 */
export function getEnvConfigById(
  envName: EnvironmentType,
  configId: ProtocolConfig["configId"]
): ProtocolConfig {
  const configs = getEnvConfigs(envName);

  const config = configs.find((config) => config.configId === configId);
  if (!config) {
    throw new Error(
      `Could not find config for envName ${envName} and configId ${configId}`
    );
  }
  return config;
}
