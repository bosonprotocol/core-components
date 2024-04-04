import { abis } from ".";
import {
  chainIdToDefaultTokens,
  chainIdToGraphTx,
  chainIdToInfo,
  chainIdToLensInfo
} from "./mappings";
import { EnvironmentType, ProtocolConfig } from "./types";

export const envConfigs: Record<EnvironmentType, ProtocolConfig[]> = {
  local: [
    {
      envName: "local",
      chainId: 31337,
      configId: "local-31337-0",
      sellersBlackList: "",
      defaultDisputeResolverId: "1",
      defaultTokens: chainIdToDefaultTokens.get(31337),
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
      sellersBlackList:
        "https://raw.githubusercontent.com/BAppLimited/curationLists/main/bosonApp.io/testing-80001-0/sellers/blacklist.json",
      defaultDisputeResolverId: "13",
      defaultTokens: chainIdToDefaultTokens.get(80001),
      nativeCoin: chainIdToInfo.get(80001),
      getTxExplorerUrl: chainIdToGraphTx.get(80001),
      subgraphUrl:
        "https://api.thegraph.com/subgraphs/name/bosonprotocol/mumbai-testing",
      jsonRpcUrl:
        "https://polygon-mumbai.infura.io/v3/b832a48b9bce4aa6bd9da86eb0126300",
      theGraphIpfsUrl: "https://api.thegraph.com/ipfs/api/v0",
      ipfsMetadataUrl: "https://ipfs.infura.io:5001",
      contracts: {
        protocolDiamond: "0x76051FC05Ab42D912a737d59a8711f1446712630",
        forwarder: "0x69015912AA33720b842dCD6aC059Ed623F28d9f7" // https://docs-gasless.biconomy.io/misc/contract-addresses
      },
      metaTx: {
        relayerUrl: "https://api.biconomy.io",
        forwarderAbi: abis.BiconomyForwarderABI
      },
      lens: {
        ...(chainIdToLensInfo.has(80001) && chainIdToLensInfo.get(80001))
      }
    },
    {
      envName: "testing",
      chainId: 11155111,
      configId: "testing-11155111-0",
      sellersBlackList:
        "https://raw.githubusercontent.com/BAppLimited/curationLists/main/bosonApp.io/testing-11155111-0/sellers/blacklist.json",
      defaultDisputeResolverId: "1",
      defaultTokens: chainIdToDefaultTokens.get(11155111),
      nativeCoin: chainIdToInfo.get(11155111),
      getTxExplorerUrl: chainIdToGraphTx.get(11155111),
      subgraphUrl:
        "https://api.thegraph.com/subgraphs/name/bosonprotocol/sepolia-testing",
      jsonRpcUrl:
        "https://sepolia.infura.io/v3/b832a48b9bce4aa6bd9da86eb0126300",
      theGraphIpfsUrl: "https://api.thegraph.com/ipfs/api/v0",
      ipfsMetadataUrl: "https://ipfs.infura.io:5001",
      contracts: {
        // from https://github.com/bosonprotocol/boson-protocol-contracts/pull/807
        protocolDiamond: "0x7de418a7ce94debd057c34ebac232e7027634ade",
        forwarder: "0xffffffffffffffffffffffffffffffffffffffff" // https://docs-gasless.biconomy.io/misc/contract-addresses
      },
      metaTx: undefined,
      lens: undefined
    }
  ],
  staging: [
    {
      envName: "staging",
      chainId: 80001,
      configId: "staging-80001-0",
      sellersBlackList:
        "https://raw.githubusercontent.com/BAppLimited/curationLists/main/bosonApp.io/staging-80001-0/sellers/blacklist.json",
      defaultDisputeResolverId: "2",
      defaultTokens: chainIdToDefaultTokens.get(80001),
      nativeCoin: chainIdToInfo.get(80001),
      getTxExplorerUrl: chainIdToGraphTx.get(80001),
      subgraphUrl:
        "https://api.thegraph.com/subgraphs/name/bosonprotocol/mumbai-staging",
      jsonRpcUrl:
        "https://polygon-mumbai.infura.io/v3/b832a48b9bce4aa6bd9da86eb0126300",
      theGraphIpfsUrl: "https://api.thegraph.com/ipfs/api/v0",
      ipfsMetadataUrl: "https://ipfs.infura.io:5001",
      contracts: {
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
    },
    {
      envName: "staging",
      chainId: 11155111,
      configId: "staging-11155111-0",
      sellersBlackList:
        "https://raw.githubusercontent.com/BAppLimited/curationLists/main/bosonApp.io/staging-11155111-0/sellers/blacklist.json",
      defaultDisputeResolverId: "1",
      defaultTokens: chainIdToDefaultTokens.get(11155111),
      nativeCoin: chainIdToInfo.get(11155111),
      getTxExplorerUrl: chainIdToGraphTx.get(11155111),
      subgraphUrl:
        "https://api.thegraph.com/subgraphs/name/bosonprotocol/sepolia-staging",
      jsonRpcUrl:
        "https://sepolia.infura.io/v3/b832a48b9bce4aa6bd9da86eb0126300",
      theGraphIpfsUrl: "https://api.thegraph.com/ipfs/api/v0",
      ipfsMetadataUrl: "https://ipfs.infura.io:5001",
      contracts: {
        // from https://github.com/bosonprotocol/boson-protocol-contracts/pull/807
        protocolDiamond: "0x26f643746cbc918b46c2d47edca68c4a6c98ebe6",
        forwarder: "0xffffffffffffffffffffffffffffffffffffffff" // https://docs-gasless.biconomy.io/misc/contract-addresses
      },
      metaTx: undefined,
      lens: undefined
    }
  ],
  production: [
    {
      envName: "production",
      chainId: 137,
      configId: "production-137-0",
      sellersBlackList:
        "https://raw.githubusercontent.com/BAppLimited/curationLists/main/bosonApp.io/production-137-0/sellers/blacklist.json",
      defaultDisputeResolverId: "1",
      defaultTokens: chainIdToDefaultTokens.get(137),
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
    },
    {
      envName: "production",
      chainId: 1,
      configId: "production-1-0",
      sellersBlackList:
        "https://raw.githubusercontent.com/BAppLimited/curationLists/main/bosonApp.io/production-1-0/sellers/blacklist.json",
      defaultDisputeResolverId: "1",
      defaultTokens: chainIdToDefaultTokens.get(1),
      nativeCoin: chainIdToInfo.get(1),
      getTxExplorerUrl: chainIdToGraphTx.get(1),
      subgraphUrl:
        "https://api.thegraph.com/subgraphs/name/bosonprotocol/ethereum",
      jsonRpcUrl:
        "https://mainnet.infura.io/v3/b5b499e704f840b5b84b0580466d658e",
      theGraphIpfsUrl: "https://api.thegraph.com/ipfs/api/v0",
      ipfsMetadataUrl: "https://ipfs.infura.io:5001",
      contracts: {
        protocolDiamond: "0x59A4C19b55193D5a2EAD0065c54af4d516E18Cb5",
        forwarder: "0x84a0856b038eaAd1cC7E297cF34A7e72685A8693" // https://docs-gasless.biconomy.io/misc/contract-addresses
      },
      metaTx: undefined,
      lens: undefined
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
    if (!config.defaultTokens) {
      throw new Error(
        `Default tokens have not been set for this chainId=${config.chainId}`
      );
    }
    if (!config.getTxExplorerUrl) {
      throw new Error(
        `getTxExplorerUrl has not been set for this chainId=${config.chainId}`
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
