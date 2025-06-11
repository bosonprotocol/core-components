import {
  Chain,
  OpenSeaPaymentToken,
  OrderSide,
  ProtocolData
} from "opensea-js";
import { logger } from "./../utils/logger";
import * as data from "./data";
import { getOpenseaSdk } from "../utils/openseaSdk";
import {
  ConsiderationItem,
  OfferItem,
  OrderParameters
} from "@opensea/seaport-js/lib/types";
import { ItemType } from "@opensea/seaport-js/lib/constants";
import { BigNumber } from "ethers";
import { getConfig } from "../config";

export type PostOrderBody = ProtocolData;

export async function postOrder(
  chain: string,
  protocol: string,
  sidePath: string,
  body: PostOrderBody
) {
  logger.info(
    `postOrder ${chain} ${protocol} ${sidePath} ${JSON.stringify(body)}`
  );
  const side = getOrderSide(sidePath);
  const orderHash = (await getOpenseaSdk()).seaport_v1_6.getOrderHash(
    body.parameters
  );
  const { price, nftContract, tokenId } = extractOrderInfo(
    body.parameters,
    side
  );
  const orderV2 = data.buildOrderV2(body, side, orderHash, price);

  logger.info(`response: ${JSON.stringify(orderV2)}`);
  // store orderV2 mapped by chain/protocol/sidePath/contract/token and chain/orderHash
  data.storeOrderV2(orderV2, chain, protocol, sidePath, nftContract, tokenId);
  return { order: orderV2 };
}

export async function getOrders(
  chain: string,
  protocol: string,
  sidePath: string,
  assetContractAddress: string,
  tokenId: string
) {
  logger.info(
    `getOrders ${chain} ${protocol} ${sidePath} ${assetContractAddress} ${tokenId}`
  );
  const order = data.findOrderV2(
    chain,
    protocol,
    sidePath,
    assetContractAddress,
    tokenId
  );
  return {
    orders: order ? [order] : []
  };
}

export async function getNft(
  chain: string,
  assetContractAddress: string,
  tokenId: string
) {
  logger.info(`getNft ${chain} ${assetContractAddress} ${tokenId}`);
  return data.getNft(chain, assetContractAddress, tokenId);
}

export async function getCollection(slug: string) {
  logger.info(`getCollection ${slug}`);
  return data.getCollection(slug);
}

type PostListingFulfillmentDataBody = {
  listing: {
    hash: string;
    chain: string;
    protocol_address: string;
  };
  fulfiller: {
    address: string;
  };
};
type PostOfferFulfillmentDataBody = {
  offer: {
    hash: string;
    chain: string;
    protocol_address: string;
  };
  fulfiller: {
    address: string;
  };
};

export type PostFulfillmentDataBody =
  | PostListingFulfillmentDataBody
  | PostOfferFulfillmentDataBody;

export async function computeFulfillmentData(
  sidePath: string,
  postFulfillmentDataBody: PostFulfillmentDataBody
) {
  let chain, protocolAddress, orderHash;
  switch (sidePath) {
    case "listings": {
      ({
        chain,
        protocol_address: protocolAddress,
        hash: orderHash
      } = (postFulfillmentDataBody as PostListingFulfillmentDataBody).listing);
      break;
    }
    case "offers": {
      ({
        chain,
        protocol_address: protocolAddress,
        hash: orderHash
      } = (postFulfillmentDataBody as PostOfferFulfillmentDataBody).offer);
      break;
    }
    default:
      throw new Error(`Invalid sidePath '${sidePath}'`);
  }
  const fulfillerAddress = postFulfillmentDataBody.fulfiller.address;

  logger.info(
    `computeFulfillmentData ${chain} ${protocolAddress} ${orderHash} ${fulfillerAddress}`
  );
  // retrieve the order based on chain/orderHash
  const orderV2 = data.findOrderV2PerHash(chain, orderHash);
  if (!orderV2) {
    throw new Error(`Not order found on chain ${chain} with hash ${orderHash}`);
  }
  const orderInfo = extractOrderInfo(orderV2.protocol_data.parameters);
  const chainId = getChainId(chain);
  // then build the fulfillment_data response
  return data.buildFulfillmentData(
    chainId,
    protocolAddress,
    fulfillerAddress,
    orderV2,
    orderInfo
  );
}

function getOrderSide(sidePath: string): OrderSide {
  switch (sidePath) {
    case "listings": {
      return OrderSide.LISTING;
    }
    case "offers": {
      return OrderSide.OFFER;
    }
    default:
      throw new Error(`Invalid sidePath '${sidePath}'`);
  }
}

export type OrderInfo = {
  side: OrderSide;
  nftContract: string;
  tokenId: string;
  price: string;
  fees: string;
  sellerProfit: string;
  exchangeToken: string;
};

function extractOrderInfo(
  parameters: OrderParameters,
  side?: OrderSide
): OrderInfo {
  let price: string;
  let exchangeToken: string;
  let nft: ConsiderationItem | OfferItem;
  const nftBid = parameters.consideration.find(
    (c) => c.itemType === ItemType.ERC721
  );
  const nftAsk = parameters.offer.find((c) => c.itemType === ItemType.ERC721);
  if (side === OrderSide.OFFER && !nftBid) {
    throw new Error(`NFT not found in order consideration`);
  }
  if (side === OrderSide.LISTING && !nftAsk) {
    throw new Error(`NFT not found in order offer`);
  }
  if (!side) {
    if (nftBid && !nftAsk) {
      side = OrderSide.OFFER;
    } else if (!nftBid && nftAsk) {
      side = OrderSide.LISTING;
    } else if (nftBid && nftAsk) {
      throw new Error(
        `NFT found in both consideration and offer. Unable to detect the order side`
      );
    } else {
      throw new Error(
        `No NFT found in consideration or offer. Unable to detect the order side`
      );
    }
  }
  if (side === OrderSide.OFFER) {
    price = parameters.offer
      .filter((c) => c.itemType === ItemType.ERC20)
      .reduce(
        (total, current) => total.add(current.startAmount),
        BigNumber.from(0)
      )
      .toString();
    exchangeToken = parameters.offer.find(
      (c) => c.itemType === ItemType.ERC20
    )?.token;
    nft = nftBid;
  } else {
    // ASK
    price = parameters.consideration
      .filter((c) => c.itemType === ItemType.ERC20)
      .reduce(
        (total, current) => total.add(current.startAmount),
        BigNumber.from(0)
      )
      .toString();
    exchangeToken = parameters.consideration.find(
      (c) => c.itemType === ItemType.ERC20
    )?.token;
    nft = nftAsk;
  }
  const openseaFee = getConfig().OPENSEA_FEE_PERCENTAGE;
  const fees = price
    ? BigNumber.from(price).mul(openseaFee).div(10000).toString()
    : "0";
  const sellerProfit = price
    ? BigNumber.from(price)
        .mul(10000 - openseaFee)
        .div(10000)
        .toString()
    : "0";
  return {
    side,
    nftContract: nft?.token || "0x0",
    tokenId: nft?.identifierOrCriteria || "0x0",
    price,
    fees,
    sellerProfit,
    exchangeToken
  };
}

function getChainId(chain: string): number {
  switch (chain) {
    case "mumbai": {
      return 80001;
    }
    case "amoy": {
      return 80002;
    }
    case "sepolia": {
      return 11155111;
    }
    case "base-sepolia": {
      return 84532;
    }
    case "optimism-sepolia": {
      return 11155420;
    }
    case "arbitrum-sepolia": {
      return 421614;
    }
    case "polygon": {
      return 137;
    }
    case "mainnet": {
      return 1;
    }
    case "base": {
      return 8453;
    }
    case "optimism": {
      return 10;
    }
    case "arbitrum": {
      return 42161;
    }
    case "hardhat": {
      return 31337;
    }
    default: {
      throw new Error(`Unable to get chainId for chain '${chain}'`);
    }
  }
}

export function getPaymentToken(
  chain: string,
  token: string
): OpenSeaPaymentToken {
  return {
    name: "TEMP",
    symbol: "TEMP",
    decimals: 18,
    address: token,
    chain: chain as Chain
  };
}
