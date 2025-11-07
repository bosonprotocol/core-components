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
import subgraphsJson from "./inputs/subgraphs.json";
import rpcUrlsJson from "./inputs/rpcUrls.json";
import ipfsGatewaysJson from "./inputs/ipfsGateways.json";

const protocolAddresses = protocolAddressesJson as ProtocolAddressesConfig;

export const envConfigs = {
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
      subgraphUrl: subgraphsJson.local["local-31337-0"][0],
      jsonRpcUrl: rpcUrlsJson.local["local-31337-0"][0],
      theGraphIpfsUrl: ipfsGatewaysJson.local["local-31337-0"].theGraphIpfsUrl,
      ipfsMetadataUrl: ipfsGatewaysJson.local["local-31337-0"].ipfsMetadataUrl,
      contracts: {
        protocolDiamond: "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853",
        priceDiscoveryClient: "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318",
        testErc20: "0x70e0bA845a1A0F2DA3359C97E0285013525FFC49", // Foreign20 contract
        testErc721: "0x4826533B4897376654Bb4d4AD88B7faFD0C98528", // Foreign721 contract
        testErc1155: "0x99bbA657f2BbC93c02D617f8bA121cB8Fc104Acf", // Foreign1155 contract
        forwarder: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0", // MockForwarder contract
        seaport: "0x8f86403A4DE0BB5791fa46B8e795C547942fE4Cf", // MockSeaport contract
        openseaWrapper: "0x9d4454B023096f34B160D6B654540c56A1F81688"
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
      subgraphUrl: subgraphsJson.testing["testing-80002-0"][0],
      jsonRpcUrl: rpcUrlsJson.testing["testing-80002-0"][0],
      theGraphIpfsUrl: ipfsGatewaysJson.testing["testing-80002-0"].theGraphIpfsUrl,
      ipfsMetadataUrl: ipfsGatewaysJson.testing["testing-80002-0"].ipfsMetadataUrl,
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
      subgraphUrl: subgraphsJson.testing["testing-11155111-0"][0],
      jsonRpcUrl: rpcUrlsJson.testing["testing-11155111-0"][0],
      theGraphIpfsUrl:
        ipfsGatewaysJson.testing["testing-11155111-0"].theGraphIpfsUrl,
      ipfsMetadataUrl:
        ipfsGatewaysJson.testing["testing-11155111-0"].ipfsMetadataUrl,
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
      subgraphUrl: subgraphsJson.testing["testing-84532-0"][0],
      jsonRpcUrl: rpcUrlsJson.testing["testing-84532-0"][0],
      theGraphIpfsUrl:
        ipfsGatewaysJson.testing["testing-84532-0"].theGraphIpfsUrl,
      ipfsMetadataUrl:
        ipfsGatewaysJson.testing["testing-84532-0"].ipfsMetadataUrl,
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
      subgraphUrl: subgraphsJson.testing["testing-11155420-0"][0],
      jsonRpcUrl: rpcUrlsJson.testing["testing-11155420-0"][0],
      theGraphIpfsUrl:
        ipfsGatewaysJson.testing["testing-11155420-0"].theGraphIpfsUrl,
      ipfsMetadataUrl:
        ipfsGatewaysJson.testing["testing-11155420-0"].ipfsMetadataUrl,
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
    },
    {
      envName: "testing",
      chainId: 421614,
      configId: "testing-421614-0",
      sellersBlackList:
        "https://raw.githubusercontent.com/BAppLimited/curationLists/main/bosonApp.io/testing-421614-0/sellers/blacklist.json",
      offersWhiteList:
        "https://raw.githubusercontent.com/BAppLimited/curationLists/refs/heads/main/bosonApp.io/testing-421614-0/offers/whitelist.json",
      defaultDisputeResolverId: "4", // TODO: to be verified
      defaultTokens: chainIdToDefaultTokens.get(421614),
      nativeCoin: chainIdToInfo.get(421614),
      getTxExplorerUrl: chainIdToGraphTx.get(421614),
      subgraphUrl: subgraphsJson.testing["testing-421614-0"][0],
      jsonRpcUrl: rpcUrlsJson.testing["testing-421614-0"][0],
      theGraphIpfsUrl:
        ipfsGatewaysJson.testing["testing-421614-0"].theGraphIpfsUrl,
      ipfsMetadataUrl:
        ipfsGatewaysJson.testing["testing-421614-0"].ipfsMetadataUrl,
      contracts: {
        protocolDiamond: protocolAddresses.testing[421614].protocolDiamond,
        priceDiscoveryClient:
          protocolAddresses.testing[421614].priceDiscoveryClient,
        forwarder: "",
        openseaWrapper: ""
      },
      metaTx: {
        relayerUrl:
          "https://meta-tx-gateway-testing-arbitrum-114403180314.europe-west2.run.app",
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
      subgraphUrl: subgraphsJson.staging["staging-80002-0"][0],
      jsonRpcUrl: rpcUrlsJson.staging["staging-80002-0"][0],
      theGraphIpfsUrl:
        ipfsGatewaysJson.staging["staging-80002-0"].theGraphIpfsUrl,
      ipfsMetadataUrl:
        ipfsGatewaysJson.staging["staging-80002-0"].ipfsMetadataUrl,
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
      subgraphUrl: subgraphsJson.staging["staging-11155111-0"][0],
      jsonRpcUrl: rpcUrlsJson.staging["staging-11155111-0"][0],
      theGraphIpfsUrl:
        ipfsGatewaysJson.staging["staging-11155111-0"].theGraphIpfsUrl,
      ipfsMetadataUrl:
        ipfsGatewaysJson.staging["staging-11155111-0"].ipfsMetadataUrl,
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
      subgraphUrl: subgraphsJson.staging["staging-84532-0"][0],
      jsonRpcUrl: rpcUrlsJson.staging["staging-84532-0"][0],
      theGraphIpfsUrl:
        ipfsGatewaysJson.staging["staging-84532-0"].theGraphIpfsUrl,
      ipfsMetadataUrl:
        ipfsGatewaysJson.staging["staging-84532-0"].ipfsMetadataUrl,
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
      subgraphUrl: subgraphsJson.staging["staging-11155420-0"][0],
      jsonRpcUrl: rpcUrlsJson.staging["staging-11155420-0"][0],
      theGraphIpfsUrl:
        ipfsGatewaysJson.staging["staging-11155420-0"].theGraphIpfsUrl,
      ipfsMetadataUrl:
        ipfsGatewaysJson.staging["staging-11155420-0"].ipfsMetadataUrl,
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
    },
    {
      envName: "staging",
      chainId: 421614,
      configId: "staging-421614-0",
      sellersBlackList:
        "https://raw.githubusercontent.com/BAppLimited/curationLists/main/bosonApp.io/staging-421614-0/sellers/blacklist.json",
      offersWhiteList:
        "https://raw.githubusercontent.com/BAppLimited/curationLists/refs/heads/main/bosonApp.io/staging-421614-0/offers/whitelist.json",
      defaultDisputeResolverId: "4", // TODO: to be verified
      defaultTokens: chainIdToDefaultTokens.get(421614),
      nativeCoin: chainIdToInfo.get(421614),
      getTxExplorerUrl: chainIdToGraphTx.get(421614),
      subgraphUrl: subgraphsJson.staging["staging-421614-0"][0],
      jsonRpcUrl: rpcUrlsJson.staging["staging-421614-0"][0],
      theGraphIpfsUrl:
        ipfsGatewaysJson.staging["staging-421614-0"].theGraphIpfsUrl,
      ipfsMetadataUrl:
        ipfsGatewaysJson.staging["staging-421614-0"].ipfsMetadataUrl,
      contracts: {
        protocolDiamond: protocolAddresses.staging[421614].protocolDiamond,
        priceDiscoveryClient:
          protocolAddresses.staging[421614].priceDiscoveryClient,
        forwarder: ""
      },
      metaTx: {
        relayerUrl:
          "https://meta-tx-gateway-staging-arbitrum-114403180314.europe-west2.run.app",
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
      subgraphUrl: subgraphsJson.production["production-137-0"][0],
      jsonRpcUrl: rpcUrlsJson.production["production-137-0"][0],
      theGraphIpfsUrl:
        ipfsGatewaysJson.production["production-137-0"].theGraphIpfsUrl,
      ipfsMetadataUrl:
        ipfsGatewaysJson.production["production-137-0"].ipfsMetadataUrl,
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
      subgraphUrl: subgraphsJson.production["production-1-0"][0],
      jsonRpcUrl: rpcUrlsJson.production["production-1-0"][0],
      theGraphIpfsUrl:
        ipfsGatewaysJson.production["production-1-0"].theGraphIpfsUrl,
      ipfsMetadataUrl:
        ipfsGatewaysJson.production["production-1-0"].ipfsMetadataUrl,
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
      subgraphUrl: subgraphsJson.production["production-8453-0"][0],
      jsonRpcUrl: rpcUrlsJson.production["production-8453-0"][0],
      theGraphIpfsUrl:
        ipfsGatewaysJson.production["production-8453-0"].theGraphIpfsUrl,
      ipfsMetadataUrl:
        ipfsGatewaysJson.production["production-8453-0"].ipfsMetadataUrl,
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
      subgraphUrl: subgraphsJson.production["production-10-0"][0],
      jsonRpcUrl: rpcUrlsJson.production["production-10-0"][0],
      theGraphIpfsUrl:
        ipfsGatewaysJson.production["production-10-0"].theGraphIpfsUrl,
      ipfsMetadataUrl:
        ipfsGatewaysJson.production["production-10-0"].ipfsMetadataUrl,
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
    },
    {
      envName: "production",
      chainId: 42161,
      configId: "production-42161-0",
      sellersBlackList:
        "https://raw.githubusercontent.com/BAppLimited/curationLists/main/bosonApp.io/production-42161-0/sellers/blacklist.json",
      offersWhiteList:
        "https://raw.githubusercontent.com/BAppLimited/curationLists/refs/heads/main/bosonApp.io/production-42161-0/offers/whitelist.json",
      defaultDisputeResolverId: "4", // TODO: TO BE VERIFIED
      defaultTokens: chainIdToDefaultTokens.get(42161),
      nativeCoin: chainIdToInfo.get(42161),
      getTxExplorerUrl: chainIdToGraphTx.get(42161),
      subgraphUrl: subgraphsJson.production["production-42161-0"][0],
      jsonRpcUrl: rpcUrlsJson.production["production-42161-0"][0],
      theGraphIpfsUrl:
        ipfsGatewaysJson.production["production-42161-0"].theGraphIpfsUrl,
      ipfsMetadataUrl:
        ipfsGatewaysJson.production["production-42161-0"].ipfsMetadataUrl,
      contracts: {
        protocolDiamond: protocolAddresses.production[42161].protocolDiamond,
        priceDiscoveryClient:
          protocolAddresses.production[42161].priceDiscoveryClient,
        forwarder: ""
      },
      metaTx: {
        relayerUrl:
          "https://meta-tx-gateway-arbitrum-114403180314.europe-west2.run.app",
        forwarderAbi: abis.BiconomyForwarderABI
      },
      lens: undefined
    }
  ]
} satisfies {
  [K in EnvironmentType]: ProtocolConfig<K>[];
};
const allConfigs = Object.values(envConfigs).flat();

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

export function getConfigFromConfigId(
  configId: ProtocolConfig["configId"]
): ProtocolConfig {
  const config = allConfigs.find((config) => config.configId === configId);
  if (!config) {
    throw new Error(
      `Could not find config for configId ${configId}. Possible values are ${allConfigs.map((c) => c.configId).join(", ")}`
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
