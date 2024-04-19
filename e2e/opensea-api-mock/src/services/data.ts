import { OrderSide, OrderType, SerializedOrderV2 } from "opensea-js";
import { OrderInfo, PostOrderBody } from "./opensea";
import { logger } from "../utils/logger";
import { getConfig } from "../config";

const OPENSEA_URL = "https://testnets.opensea.io";

const config = getConfig();

export function getCollectionId(chain: string, assetContractAddress: string) {
  return `${chain}-${assetContractAddress}`.toLowerCase();
}

export function getNft(
  chain: string,
  assetContractAddress: string,
  tokenId: string
) {
  const token_standard = "erc721";
  const name = "the_token";
  const description = "the_token";
  const image_url =
    "https://ipfs.io/ipfs/QmU8My56DnugHttbQc7Hm7VXd8TYDYdZ3VfpCabWGY2WBQ";
  const metadata_url =
    "https://ipfs.io/ipfs/QmfHgBJV5Nm69H9v1A3UPeQ4qMpZtv1J5zLzTfWPEWLEnA";
  const opensea_url = `${OPENSEA_URL}/assets/${chain}/${assetContractAddress}/${tokenId}`;
  const collection = getCollectionId(chain, assetContractAddress);
  storeCollectionData(collection, { chain, address: assetContractAddress });
  return {
    nft: {
      identifier: tokenId,
      collection,
      contract: assetContractAddress,
      token_standard,
      name,
      description,
      image_url,
      metadata_url,
      opensea_url,
      updated_at: "date_updated",
      is_disabled: false,
      is_nsfw: false,
      animation_url: null,
      is_suspicious: false,
      creator: "creator_address",
      traits: [],
      owners: [
        {
          address: "owner_address",
          quantity: 1
        }
      ],
      rarity: null
    }
  };
}

export function getCollection(slug: string) {
  const name = "the_collection";
  return {
    collection: slug,
    name,
    description: "",
    image_url: "",
    banner_image_url: "",
    owner: "owner_address",
    safelist_status: "not_requested",
    category: "",
    is_disabled: false,
    is_nsfw: false,
    trait_offers_enabled: false,
    collection_offers_enabled: true,
    opensea_url: `${OPENSEA_URL}/collection/${slug}`,
    project_url: "",
    wiki_url: "",
    discord_url: "",
    telegram_url: "",
    twitter_username: "",
    instagram_username: "",
    contracts: [getCollectionData(slug)],
    editors: ["collection_editor"],
    fees: [
      {
        fee: config.OPENSEA_FEE_PERCENTAGE,
        recipient: config.OPENSEA_FEE_RECIPIENT,
        required: true
      }
    ],
    total_supply: 100,
    created_date: "created_date"
  };
}

const collectionDataPerId = new Map<
  string,
  { address: string; chain: string }
>();

function storeCollectionData(
  collectionId: string,
  data: { address: string; chain: string }
) {
  collectionDataPerId.set(collectionId, data);
}

function getCollectionData(collectionId: string) {
  return (
    collectionDataPerId.get(collectionId) || {
      address: "collection_address",
      chain: "collection_chain"
    }
  );
}

export function buildOrderV2(
  postOrderBody: PostOrderBody,
  side: OrderSide,
  orderHash: string,
  currentPrice: string
): SerializedOrderV2 {
  const listing_time = Number(postOrderBody.parameters.startTime.toString());
  const expiration_time = Number(postOrderBody.parameters.endTime.toString());
  return {
    created_date: new Date().toISOString(),
    closing_date: new Date(expiration_time * 1000).toISOString(),
    listing_time,
    expiration_time,
    order_hash: orderHash,
    protocol_data: {
      parameters: {
        ...postOrderBody.parameters,
        counter: 0
      },
      signature: postOrderBody.signature
    },
    protocol_address: config.SEAPORT_ADDRESS,
    current_price: currentPrice,
    maker: {
      user: 485765,
      profile_img_url:
        "https://storage.googleapis.com/opensea-static/opensea-profile/30.png",
      address: postOrderBody.parameters.offerer,
      config: ""
    },
    taker: null,
    maker_fees: [],
    taker_fees: [],
    side,
    order_type: OrderType.ENGLISH,
    cancelled: false,
    finalized: false,
    marked_invalid: false,
    remaining_quantity: 1,
    client_signature: ""
  };
}

const orderMap = new Map<
  string,
  Map<string, Map<string, Map<string, Map<string, SerializedOrderV2>>>>
>();

const orderPerHash = new Map<string, Map<string, SerializedOrderV2>>();

export function storeOrderV2(
  orderV2: SerializedOrderV2,
  chain: string,
  protocol: string,
  sidePath: string,
  contract: string,
  token: string
) {
  chain = chain.toLowerCase();
  protocol = protocol.toLowerCase();
  sidePath = sidePath.toLowerCase();
  contract = contract.toLowerCase();
  token = token.toLowerCase();
  // Store in orderMap, mapped by chain/protocol/sidePath/contract/token
  if (!orderMap.has(chain)) {
    orderMap.set(chain, new Map());
  }
  const chainMap = orderMap.get(chain);
  if (!chainMap.has(protocol)) {
    chainMap.set(protocol, new Map());
  }
  const protocolMap = chainMap.get(protocol);
  if (!protocolMap.has(sidePath)) {
    protocolMap.set(sidePath, new Map());
  }
  const sidePathMap = protocolMap.get(sidePath);
  if (!sidePathMap.has(contract)) {
    sidePathMap.set(contract, new Map());
  }
  const contractMap = sidePathMap.get(contract);
  contractMap.set(token, orderV2);
  logger.debug(
    `Order stored mapped with ${chain}/${protocol}/${sidePath}/${contract}/${token}`
  );
  // Store in orderPerHash, mapped by chain/orderHash
  if (!orderPerHash.has(chain)) {
    orderPerHash.set(chain, new Map());
  }
  orderPerHash.get(chain).set(orderV2.order_hash, orderV2);
  logger.debug(`Order stored mapped with ${chain}/${orderV2.order_hash}`);
}

export function findOrderV2(
  chain: string,
  protocol: string,
  sidePath: string,
  contract: string,
  token: string
): SerializedOrderV2 | undefined {
  chain = chain.toLowerCase();
  protocol = protocol.toLowerCase();
  sidePath = sidePath.toLowerCase();
  contract = contract.toLowerCase();
  token = token.toLowerCase();
  const order = orderMap
    .get(chain)
    ?.get(protocol)
    ?.get(sidePath)
    ?.get(contract)
    ?.get(token);
  if (!order) {
    logger.warn(
      `Order not found with ${chain}/${protocol}/${sidePath}/${contract}/${token}`
    );
  }
  return order;
}

export function findOrderV2PerHash(
  chain: string,
  orderHash: string
): SerializedOrderV2 | undefined {
  chain = chain.toLowerCase();
  orderHash = orderHash.toLowerCase();
  const order = orderPerHash.get(chain)?.get(orderHash);
  if (!order) {
    logger.warn(`Order not found with ${chain}/${orderHash}`);
  }
  return order;
}

export function buildFulfillmentData(
  chainId: number,
  protocolAddress: string,
  fulfillerAddress: string,
  orderV2: SerializedOrderV2,
  orderInfo: OrderInfo
) {
  return {
    protocol: "seaport1.6",
    fulfillment_data: {
      transaction: {
        function:
          "matchAdvancedOrders(((address,address,(uint8,address,uint256,uint256,uint256)[],(uint8,address,uint256,uint256,uint256,address)[],uint8,uint256,uint256,bytes32,uint256,bytes32,uint256),uint120,uint120,bytes,bytes)[],(uint256,uint8,uint256,uint256,bytes32[])[],((uint256,uint256)[],(uint256,uint256)[])[],address)",
        chain: chainId,
        to: protocolAddress,
        value: 0,
        input_data: {
          orders: [
            {
              parameters: orderV2.protocol_data.parameters,
              numerator: 1 as unknown as bigint,
              denominator: 1 as unknown as bigint,
              signature: orderV2.protocol_data.signature,
              extraData: "0x"
            },
            {
              parameters: {
                offerer: fulfillerAddress,
                zone: "0x0000000000000000000000000000000000000000",
                offer: [
                  {
                    itemType: 2,
                    token: orderInfo.nftContract,
                    identifierOrCriteria: orderInfo.tokenId,
                    startAmount: "1",
                    endAmount: "1"
                  }
                ],
                consideration: [
                  {
                    itemType: 1,
                    token: orderInfo.exchangeToken,
                    identifierOrCriteria: "0",
                    startAmount: orderInfo.sellerProfit,
                    endAmount: orderInfo.sellerProfit,
                    recipient: fulfillerAddress
                  }
                ],
                orderType: 0,
                startTime: orderV2.protocol_data.parameters.startTime,
                endTime: orderV2.protocol_data.parameters.endTime,
                zoneHash:
                  "0x0000000000000000000000000000000000000000000000000000000000000000",
                salt: orderV2.protocol_data.parameters.salt,
                conduitKey: orderV2.protocol_data.parameters.conduitKey,
                totalOriginalConsiderationItems: "1"
              },
              numerator: 1 as unknown as bigint,
              denominator: 1 as unknown as bigint,
              signature: "0x",
              extraData: "0x"
            }
          ],
          criteriaResolvers: [],
          fulfillments: [
            {
              offerComponents: [
                {
                  orderIndex: "1",
                  itemIndex: "0"
                }
              ],
              considerationComponents: [
                {
                  orderIndex: "0",
                  itemIndex: "0"
                }
              ]
            },
            {
              offerComponents: [
                {
                  orderIndex: "0",
                  itemIndex: "0"
                }
              ],
              considerationComponents: [
                {
                  orderIndex: "0",
                  itemIndex: "1"
                }
              ]
            },
            {
              offerComponents: [
                {
                  orderIndex: "0",
                  itemIndex: "0"
                }
              ],
              considerationComponents: [
                {
                  orderIndex: "1",
                  itemIndex: "0"
                }
              ]
            }
          ],
          recipient: fulfillerAddress
        }
      },
      orders: [orderV2.protocol_data]
    }
  };
}
