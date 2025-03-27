import { abis } from ".";
import {
  chainIdToDefaultTokens,
  chainIdToGraphTx,
  chainIdToInfo,
  chainIdToLensInfo
} from "./mappings";
import {
  EnvironmentType,
  ProtocolAddressesConfig,
  ProtocolConfig
} from "./types";
import protocolAddressesJson from "./generated/protocolAddresses.json";

const protocolAddresses = protocolAddressesJson as ProtocolAddressesConfig;

export const envConfigs: Record<EnvironmentType, ProtocolConfig[]> = {
  local: [
    {
      envName: "local",
      chainId: 31337,
      configId: "local-31337-0",
      sellersBlackList: "",
      offersWhiteList: "",
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
        priceDiscoveryClient: "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318",
        testErc20: "0x998abeb3E57409262aE5b751f60747921B33613E", // Foreign20 contract
        testErc721: "0x70e0bA845a1A0F2DA3359C97E0285013525FFC49", // Foreign721 contract
        testErc1155: "0x4826533B4897376654Bb4d4AD88B7faFD0C98528", // Foreign1155 contract
        forwarder: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0", // MockForwarder contract
        seaport: "0x0E801D84Fa97b50751Dbf25036d067dCf18858bF", // MockSeaport contract
        openseaWrapper: "0x8f86403A4DE0BB5791fa46B8e795C547942fE4Cf"
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
      chainId: 80002,
      configId: "testing-80002-0",
      sellersBlackList:
        "https://raw.githubusercontent.com/BAppLimited/curationLists/main/bosonApp.io/testing-80002-0/sellers/blacklist.json",
      offersWhiteList:
        "https://raw.githubusercontent.com/BAppLimited/curationLists/refs/heads/main/bosonApp.io/testing-80002-0/offers/whitelist.json",
      defaultDisputeResolverId: "1",
      defaultTokens: chainIdToDefaultTokens.get(80002),
      nativeCoin: chainIdToInfo.get(80002),
      getTxExplorerUrl: chainIdToGraphTx.get(80002),
      subgraphUrl:
        "https://api.0xgraph.xyz/api/public/c56471f5-5b1d-4a62-b1de-450044cb7ebc/subgraphs/boson-testing-amoy/latest/gn",
      jsonRpcUrl:
        "https://polygon-amoy.infura.io/v3/b832a48b9bce4aa6bd9da86eb0126300",
      theGraphIpfsUrl: "https://api.0xgraph.xyz/ipfs",
      ipfsMetadataUrl: "https://ipfs.infura.io:5001",
      contracts: {
        protocolDiamond: protocolAddresses.testing[80002].protocolDiamond,
        priceDiscoveryClient:
          protocolAddresses.testing[80002].priceDiscoveryClient,
        forwarder: "0xd240234dacd7ffdca7e4effcf6c7190885d7e2f0", // https://github.com/bosonprotocol/boson-protocol-contracts/blob/main/scripts/config/client-upgrade.js#L11
        openseaWrapper: "0x6e9C25b48161A2aC6A854af3bc596d3190F0B5A3"
      },
      metaTx: {
        relayerUrl:
          "https://meta-tx-gateway-testing-114403180314.europe-west2.run.app",
        forwarderAbi: abis.BiconomyForwarderABI
      },
      lens: {
        ...(chainIdToLensInfo.has(80002) && chainIdToLensInfo.get(80002))
      }
    },
    {
      envName: "testing",
      chainId: 11155111,
      configId: "testing-11155111-0",
      sellersBlackList:
        "https://raw.githubusercontent.com/BAppLimited/curationLists/main/bosonApp.io/testing-11155111-0/sellers/blacklist.json",
      offersWhiteList:
        "https://raw.githubusercontent.com/BAppLimited/curationLists/refs/heads/main/bosonApp.io/testing-11155111-0/offers/whitelist.json",
      defaultDisputeResolverId: "1",
      defaultTokens: chainIdToDefaultTokens.get(11155111),
      nativeCoin: chainIdToInfo.get(11155111),
      getTxExplorerUrl: chainIdToGraphTx.get(11155111),
      subgraphUrl:
        "https://api.0xgraph.xyz/api/public/c56471f5-5b1d-4a62-b1de-450044cb7ebc/subgraphs/boson-testing-sepolia/latest/gn",
      jsonRpcUrl:
        "https://sepolia.infura.io/v3/b832a48b9bce4aa6bd9da86eb0126300",
      theGraphIpfsUrl: "https://api.0xgraph.xyz/ipfs",
      ipfsMetadataUrl: "https://ipfs.infura.io:5001",
      contracts: {
        protocolDiamond: protocolAddresses.testing[11155111].protocolDiamond,
        priceDiscoveryClient:
          protocolAddresses.testing[11155111].priceDiscoveryClient,
        forwarder: "0xbdeA59c8801658561a16fF58D68FC2b198DE4E93", // https://github.com/bosonprotocol/boson-protocol-contracts/blob/main/scripts/config/client-upgrade.js#L10
        openseaWrapper: "0xf4e888DfCBD71b08a3Aa5Cf15d5124Cfd7205433"
      },
      metaTx: undefined,
      lens: undefined
    },
    {
      envName: "testing",
      chainId: 84532,
      configId: "testing-84532-0",
      sellersBlackList:
        "https://raw.githubusercontent.com/BAppLimited/curationLists/main/bosonApp.io/testing-84532-0/sellers/blacklist.json",
      offersWhiteList:
        "https://raw.githubusercontent.com/BAppLimited/curationLists/refs/heads/main/bosonApp.io/testing-84532-0/offers/whitelist.json",
      defaultDisputeResolverId: "4",
      defaultTokens: chainIdToDefaultTokens.get(84532),
      nativeCoin: chainIdToInfo.get(84532),
      getTxExplorerUrl: chainIdToGraphTx.get(84532),
      subgraphUrl:
        "https://api.0xgraph.xyz/api/public/c56471f5-5b1d-4a62-b1de-450044cb7ebc/subgraphs/boson-testing-base/latest/gn",
      jsonRpcUrl:
        "https://base-sepolia.infura.io/v3/b832a48b9bce4aa6bd9da86eb0126300",
      theGraphIpfsUrl: "https://api.0xgraph.xyz/ipfs",
      ipfsMetadataUrl: "https://ipfs.infura.io:5001",
      contracts: {
        protocolDiamond: protocolAddresses.testing[84532].protocolDiamond,
        priceDiscoveryClient:
          protocolAddresses.testing[84532].priceDiscoveryClient,
        forwarder: "",
        openseaWrapper: ""
      },
      metaTx: {
        relayerUrl:
          "https://meta-tx-gateway-testing-base-114403180314.europe-west2.run.app",
        forwarderAbi: abis.BiconomyForwarderABI
      },
      lens: undefined
    },
    {
      envName: "testing",
      chainId: 11155420,
      configId: "testing-11155420-0",
      sellersBlackList:
        "https://raw.githubusercontent.com/BAppLimited/curationLists/main/bosonApp.io/testing-11155420-0/sellers/blacklist.json",
      offersWhiteList:
        "https://raw.githubusercontent.com/BAppLimited/curationLists/refs/heads/main/bosonApp.io/testing-11155420-0/offers/whitelist.json",
      defaultDisputeResolverId: "4",
      defaultTokens: chainIdToDefaultTokens.get(11155420),
      nativeCoin: chainIdToInfo.get(11155420),
      getTxExplorerUrl: chainIdToGraphTx.get(11155420),
      subgraphUrl:
        "https://api.0xgraph.xyz/api/public/c56471f5-5b1d-4a62-b1de-450044cb7ebc/subgraphs/boson-testing-optimism/latest/gn",
      jsonRpcUrl:
        "https://optimism-sepolia.infura.io/v3/b832a48b9bce4aa6bd9da86eb0126300",
      theGraphIpfsUrl: "https://api.0xgraph.xyz/ipfs",
      ipfsMetadataUrl: "https://ipfs.infura.io:5001",
      contracts: {
        protocolDiamond: protocolAddresses.testing[11155420].protocolDiamond,
        priceDiscoveryClient:
          protocolAddresses.testing[11155420].priceDiscoveryClient,
        forwarder: "",
        openseaWrapper: ""
      },
      metaTx: {
        relayerUrl:
          "https://meta-tx-gateway-testing-optimism-114403180314.europe-west2.run.app",
        forwarderAbi: abis.BiconomyForwarderABI
      },
      lens: undefined
    }
  ],
  staging: [
    {
      envName: "staging",
      chainId: 80002,
      configId: "staging-80002-0",
      sellersBlackList:
        "https://raw.githubusercontent.com/BAppLimited/curationLists/main/bosonApp.io/staging-80002-0/sellers/blacklist.json",
      offersWhiteList:
        "https://raw.githubusercontent.com/BAppLimited/curationLists/refs/heads/main/bosonApp.io/staging-80002-0/offers/whitelist.json",
      defaultDisputeResolverId: "1",
      defaultTokens: chainIdToDefaultTokens.get(80002),
      nativeCoin: chainIdToInfo.get(80002),
      getTxExplorerUrl: chainIdToGraphTx.get(80002),
      subgraphUrl:
        "https://api.0xgraph.xyz/api/public/da9367fc-3453-4e08-824f-19fb4281b6a1/subgraphs/boson-staging-amoy/latest/gn",
      jsonRpcUrl:
        "https://polygon-amoy.infura.io/v3/b832a48b9bce4aa6bd9da86eb0126300",
      theGraphIpfsUrl: "https://api.0xgraph.xyz/ipfs",
      ipfsMetadataUrl: "https://ipfs.infura.io:5001",
      contracts: {
        protocolDiamond: protocolAddresses.staging[80002].protocolDiamond,
        priceDiscoveryClient:
          protocolAddresses.staging[80002].priceDiscoveryClient,
        forwarder: "0xd240234dacd7ffdca7e4effcf6c7190885d7e2f0", // https://github.com/bosonprotocol/boson-protocol-contracts/blob/main/scripts/config/client-upgrade.js#L11
        openseaWrapper: "0x6678663A66C228BA79C8B2ABB4b4D797C6215026"
      },
      metaTx: {
        relayerUrl:
          "https://meta-tx-gateway-staging-114403180314.europe-west2.run.app",
        forwarderAbi: abis.BiconomyForwarderABI
      },
      lens: {
        ...(chainIdToLensInfo.has(80002) && chainIdToLensInfo.get(80002))
      }
    },
    {
      envName: "staging",
      chainId: 11155111,
      configId: "staging-11155111-0",
      sellersBlackList:
        "https://raw.githubusercontent.com/BAppLimited/curationLists/main/bosonApp.io/staging-11155111-0/sellers/blacklist.json",
      offersWhiteList:
        "https://raw.githubusercontent.com/BAppLimited/curationLists/refs/heads/main/bosonApp.io/staging-11155111-0/offers/whitelist.json",
      defaultDisputeResolverId: "1",
      defaultTokens: chainIdToDefaultTokens.get(11155111),
      nativeCoin: chainIdToInfo.get(11155111),
      getTxExplorerUrl: chainIdToGraphTx.get(11155111),
      subgraphUrl:
        "https://api.0xgraph.xyz/api/public/da9367fc-3453-4e08-824f-19fb4281b6a1/subgraphs/boson-staging-sepolia/latest/gn",
      jsonRpcUrl:
        "https://sepolia.infura.io/v3/b832a48b9bce4aa6bd9da86eb0126300",
      theGraphIpfsUrl: "https://api.0xgraph.xyz/ipfs",
      ipfsMetadataUrl: "https://ipfs.infura.io:5001",
      contracts: {
        protocolDiamond: protocolAddresses.staging[11155111].protocolDiamond,
        priceDiscoveryClient:
          protocolAddresses.staging[11155111].priceDiscoveryClient,
        forwarder: "0xbdeA59c8801658561a16fF58D68FC2b198DE4E93" // https://github.com/bosonprotocol/boson-protocol-contracts/blob/main/scripts/config/client-upgrade.js#L10
      },
      metaTx: undefined,
      lens: undefined
    },
    {
      envName: "staging",
      chainId: 84532,
      configId: "staging-84532-0",
      sellersBlackList:
        "https://raw.githubusercontent.com/BAppLimited/curationLists/main/bosonApp.io/staging-84532-0/sellers/blacklist.json",
      offersWhiteList:
        "https://raw.githubusercontent.com/BAppLimited/curationLists/refs/heads/main/bosonApp.io/staging-84532-0/offers/whitelist.json",
      defaultDisputeResolverId: "4",
      defaultTokens: chainIdToDefaultTokens.get(84532),
      nativeCoin: chainIdToInfo.get(84532),
      getTxExplorerUrl: chainIdToGraphTx.get(84532),
      subgraphUrl:
        "https://api.0xgraph.xyz/api/public/da9367fc-3453-4e08-824f-19fb4281b6a1/subgraphs/boson-staging-base/latest/gn",
      jsonRpcUrl:
        "https://base-sepolia.infura.io/v3/b832a48b9bce4aa6bd9da86eb0126300",
      theGraphIpfsUrl: "https://api.0xgraph.xyz/ipfs",
      ipfsMetadataUrl: "https://ipfs.infura.io:5001",
      contracts: {
        protocolDiamond: protocolAddresses.staging[84532].protocolDiamond,
        priceDiscoveryClient:
          protocolAddresses.staging[84532].priceDiscoveryClient,
        forwarder: ""
      },
      metaTx: {
        relayerUrl:
          "https://meta-tx-gateway-staging-base-114403180314.europe-west2.run.app",
        forwarderAbi: abis.BiconomyForwarderABI
      },
      lens: undefined
    },
    {
      envName: "staging",
      chainId: 11155420,
      configId: "staging-11155420-0",
      sellersBlackList:
        "https://raw.githubusercontent.com/BAppLimited/curationLists/main/bosonApp.io/staging-11155420-0/sellers/blacklist.json",
      offersWhiteList:
        "https://raw.githubusercontent.com/BAppLimited/curationLists/refs/heads/main/bosonApp.io/staging-11155420-0/offers/whitelist.json",
      defaultDisputeResolverId: "4",
      defaultTokens: chainIdToDefaultTokens.get(11155420),
      nativeCoin: chainIdToInfo.get(11155420),
      getTxExplorerUrl: chainIdToGraphTx.get(11155420),
      subgraphUrl:
        "https://api.0xgraph.xyz/api/public/da9367fc-3453-4e08-824f-19fb4281b6a1/subgraphs/boson-staging-optimism/latest/gn",
      jsonRpcUrl:
        "https://optimism-sepolia.infura.io/v3/b832a48b9bce4aa6bd9da86eb0126300",
      theGraphIpfsUrl: "https://api.0xgraph.xyz/ipfs",
      ipfsMetadataUrl: "https://ipfs.infura.io:5001",
      contracts: {
        protocolDiamond: protocolAddresses.staging[11155420].protocolDiamond,
        priceDiscoveryClient:
          protocolAddresses.staging[11155420].priceDiscoveryClient,
        forwarder: ""
      },
      metaTx: {
        relayerUrl:
          "https://meta-tx-gateway-staging-optimism-114403180314.europe-west2.run.app",
        forwarderAbi: abis.BiconomyForwarderABI
      },
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
      offersWhiteList:
        "https://raw.githubusercontent.com/BAppLimited/curationLists/refs/heads/main/bosonApp.io/production-137-0/offers/whitelist.json",
      defaultDisputeResolverId: "1",
      defaultTokens: chainIdToDefaultTokens.get(137),
      nativeCoin: chainIdToInfo.get(137),
      getTxExplorerUrl: chainIdToGraphTx.get(137),
      subgraphUrl:
        "https://api.0xgraph.xyz/api/public/b521f6b7-36c4-4117-8ad5-6b21c6eeb195/subgraphs/boson-polygon/latest/gn",
      jsonRpcUrl:
        "https://polygon-mainnet.infura.io/v3/383117b55d614525b07f03b5979c5f19",
      theGraphIpfsUrl: "https://api.0xgraph.xyz/ipfs",
      ipfsMetadataUrl: "https://ipfs.infura.io:5001",
      contracts: {
        protocolDiamond: protocolAddresses.production[137].protocolDiamond,
        priceDiscoveryClient:
          protocolAddresses.production[137].priceDiscoveryClient,
        forwarder: "0xf0511f123164602042ab2bCF02111fA5D3Fe97CD"
      },
      metaTx: {
        relayerUrl: "https://meta-tx-gateway-114403180314.europe-west2.run.app",
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
      offersWhiteList:
        "https://raw.githubusercontent.com/BAppLimited/curationLists/refs/heads/main/bosonApp.io/production-1-0/offers/whitelist.json",
      defaultDisputeResolverId: "1",
      defaultTokens: chainIdToDefaultTokens.get(1),
      nativeCoin: chainIdToInfo.get(1),
      getTxExplorerUrl: chainIdToGraphTx.get(1),
      subgraphUrl:
        "https://api.0xgraph.xyz/api/public/b521f6b7-36c4-4117-8ad5-6b21c6eeb195/subgraphs/boson-ethereum/latest/gn",
      jsonRpcUrl:
        "https://mainnet.infura.io/v3/b5b499e704f840b5b84b0580466d658e",
      theGraphIpfsUrl: "https://api.0xgraph.xyz/ipfs",
      ipfsMetadataUrl: "https://ipfs.infura.io:5001",
      contracts: {
        protocolDiamond: protocolAddresses.production[1].protocolDiamond,
        priceDiscoveryClient:
          protocolAddresses.production[1].priceDiscoveryClient,
        forwarder: "0x84a0856b038eaAd1cC7E297cF34A7e72685A8693" // https://docs-gasless.biconomy.io/misc/contract-addresses
      },
      metaTx: undefined,
      lens: undefined
    },
    {
      envName: "production",
      chainId: 8453,
      configId: "production-8453-0",
      sellersBlackList:
        "https://raw.githubusercontent.com/BAppLimited/curationLists/main/bosonApp.io/production-8453-0/sellers/blacklist.json",
      offersWhiteList:
        "https://raw.githubusercontent.com/BAppLimited/curationLists/refs/heads/main/bosonApp.io/production-8453-0/offers/whitelist.json",
      defaultDisputeResolverId: "4",
      defaultTokens: chainIdToDefaultTokens.get(8453),
      nativeCoin: chainIdToInfo.get(8453),
      getTxExplorerUrl: chainIdToGraphTx.get(8453),
      subgraphUrl:
        "https://api.0xgraph.xyz/api/public/b521f6b7-36c4-4117-8ad5-6b21c6eeb195/subgraphs/boson-base/latest/gn",
      jsonRpcUrl:
        "https://base-mainnet.infura.io/v3/b5b499e704f840b5b84b0580466d658e",
      theGraphIpfsUrl: "https://api.0xgraph.xyz/ipfs",
      ipfsMetadataUrl: "https://ipfs.infura.io:5001",
      contracts: {
        protocolDiamond: protocolAddresses.production[8453].protocolDiamond,
        priceDiscoveryClient:
          protocolAddresses.production[8453].priceDiscoveryClient,
        forwarder: ""
      },
      metaTx: {
        relayerUrl:
          "https://meta-tx-gateway-base-114403180314.europe-west2.run.app",
        forwarderAbi: abis.BiconomyForwarderABI
      },
      lens: undefined
    },
    {
      envName: "production",
      chainId: 10,
      configId: "production-10-0",
      sellersBlackList:
        "https://raw.githubusercontent.com/BAppLimited/curationLists/main/bosonApp.io/production-10-0/sellers/blacklist.json",
      offersWhiteList:
        "https://raw.githubusercontent.com/BAppLimited/curationLists/refs/heads/main/bosonApp.io/production-10-0/offers/whitelist.json",
      defaultDisputeResolverId: "4", // TODO: TO BE VERIFIED
      defaultTokens: chainIdToDefaultTokens.get(10),
      nativeCoin: chainIdToInfo.get(10),
      getTxExplorerUrl: chainIdToGraphTx.get(10),
      subgraphUrl:
        "https://api.0xgraph.xyz/api/public/b521f6b7-36c4-4117-8ad5-6b21c6eeb195/subgraphs/boson-optimism/latest/gn",
      jsonRpcUrl:
        "https://optimism-mainnet.infura.io/v3/b5b499e704f840b5b84b0580466d658e",
      theGraphIpfsUrl: "https://api.0xgraph.xyz/ipfs",
      ipfsMetadataUrl: "https://ipfs.infura.io:5001",
      contracts: {
        protocolDiamond: protocolAddresses.production[10].protocolDiamond,
        priceDiscoveryClient:
          protocolAddresses.production[10].priceDiscoveryClient,
        forwarder: ""
      },
      metaTx: {
        relayerUrl:
          "https://meta-tx-gateway-optimism-114403180314.europe-west2.run.app",
        forwarderAbi: abis.BiconomyForwarderABI
      },
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

/**
 * Retrieves the chainId value from the ProtocolConfig object based on the provided envName and configId.
 * @param envName - local, testing, staging or production
 * @param configId -  it should follow the following pattern `${envName}-${chainId}-${number}`
 * @returns the chainId value of the ProtocolConfig object that matches the provided configId
 */
export function getChainIdFromConfigId(
  envName: EnvironmentType,
  configId: ProtocolConfig["configId"]
) {
  const configsInEnv = envConfigs[envName];
  if (!configsInEnv) {
    throw new Error(
      `Could not find env for envName ${envName} and configId ${configId}`
    );
  }
  for (const config of configsInEnv) {
    if (config.configId === configId) {
      return config.chainId;
    }
  }
  throw new Error(
    `Could not find config for envName ${envName} and configId ${configId}`
  );
}
