import { Chain as OSChain, OpenSeaSDK } from "opensea-js";
import { Wallet as WalletV6 } from "ethers-v6";
import { ChainId, ProtocolConfig } from "@bosonprotocol/common";
import { API_BASE_MAINNET, API_BASE_TESTNET } from "opensea-js/lib/constants";
import { Seaport } from "@opensea/seaport-js";
import { CoreSDK } from "../../packages/core-sdk/src";

export function getOpenSeaChain(chainId: ChainId): OSChain {
  switch (chainId) {
    case 1: {
      return OSChain.Mainnet;
    }
    case 137: {
      return OSChain.Polygon;
    }
    case 80002: {
      return OSChain.Amoy;
    }
    case 11155111: {
      return OSChain.Sepolia;
    }
    case 8453: {
      return OSChain.Base;
    }
    case 10: {
      return OSChain.Optimism;
    }
    case 42161: {
      return OSChain.Arbitrum;
    }
    case 84532: {
      return OSChain.BaseSepolia;
    }
    case 11155420: {
      return OSChain.OptimismSepolia;
    }
    case 421614: {
      return OSChain.ArbitrumSepolia;
    }
    case 31337: {
      return "hardhat" as OSChain;
    }
    default: {
      throw new Error(`Chain ${chainId} not supported`);
    }
  }
}

export function createOpenSeaSDK(
  sellerWalletV6: WalletV6,
  chainId: ChainId,
  OPENSEA_API_KEY: string,
  defaultConfig: ProtocolConfig
): OpenSeaSDK {
  let openseaUrl;
  let mockSeaport = false;
  switch (chainId) {
    case 1:
    case 137:
    case 10:
    case 42161:
    case 8453: {
      openseaUrl = API_BASE_MAINNET;
      break;
    }
    case 31337: {
      openseaUrl = "http://localhost:3334";
      mockSeaport = true;
      break;
    }
    default: {
      openseaUrl = API_BASE_TESTNET;
    }
  }

  const openseaSdk = new OpenSeaSDK(
    sellerWalletV6 as any,
    {
      chain: getOpenSeaChain(chainId),
      apiKey: OPENSEA_API_KEY,
      apiBaseUrl: openseaUrl
    },
    (line) => console.info(`SEPOLIA OS: ${line}`)
  );
  (openseaSdk.api as any).apiBaseUrl = openseaUrl; // << force the API URL
  if (mockSeaport) {
    // Force the seaport contract
    openseaSdk.seaport_v1_6 = new Seaport(sellerWalletV6 as any, {
      overrides: {
        seaportVersion: "1.6",
        contractAddress: defaultConfig.contracts.seaport
      }
    });
  }
  return openseaSdk;
}

export async function approveIfNeeded(
  operator: string,
  nftContract: string,
  coreSDK: CoreSDK
) {
  const isApprovedForAll1 = await coreSDK.isApprovedForAll(operator, {
    contractAddress: nftContract
  });
  if (!isApprovedForAll1) {
    const approveTx = await coreSDK.approveProtocolForAll({
      operator: operator
    });
    console.log(`approveProtocolForAll tx ${approveTx.hash}...`);
    await approveTx.wait();
    console.log("done");
    const isApprovedForAll2 = await coreSDK.isApprovedForAll(operator, {
      contractAddress: nftContract
    });
    console.log(`${operator} is approved for all: ${isApprovedForAll2}`);
  } else {
    console.log(`${operator} is approved for all: ${isApprovedForAll1}`);
  }
}
