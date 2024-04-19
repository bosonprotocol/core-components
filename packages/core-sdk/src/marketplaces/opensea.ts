import { formatUnits } from "@ethersproject/units";
import {
  AssetWithTokenId,
  FulfillmentDataResponse,
  GetNFTResponse,
  NFT,
  OrderAPIOptions,
  OrderSide,
  OrderV2,
  OrdersQueryOptions,
  ProtocolData
} from "opensea-js";
import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import {
  Listing,
  Marketplace,
  MarketplaceType,
  Order,
  SignedOrder
} from "./types";
import {
  ConsiderationItem,
  CreateInputItem,
  CreateOrderAction,
  CreateOrderInput,
  OfferItem,
  OrderParameters,
  OrderUseCase
} from "@opensea/seaport-js/lib/types";
import {
  ItemType,
  NO_CONDUIT,
  OPENSEA_CONDUIT_ADDRESS
} from "@opensea/seaport-js/lib/constants";
import {
  ContractAddresses,
  PriceDiscoveryStruct,
  Side
} from "@bosonprotocol/common";
import {
  CriteriaResolver,
  encodeMatchAdvancedOrders,
  AdvancedOrder,
  Fulfillment
} from "../seaport/interface";

export type OpenSeaListing = {
  asset: AssetWithTokenId;
  accountAddress: string;
  startAmount: BigNumberish;
  endAmount?: BigNumberish;
  quantity?: BigNumberish;
  domain?: string;
  salt?: BigNumberish;
  listingTime?: number;
  expirationTime?: number;
  paymentTokenAddress?: string;
  buyerAddress?: string;
  englishAuction?: boolean;
  excludeOptionalCreatorFees?: boolean;
};

export type OpenSeaSDKHandler = {
  api: {
    apiBaseUrl: string;
    getOrder(order: Omit<OrdersQueryOptions, "limit">): Promise<OrderV2>;
    generateFulfillmentData(
      fulfillerAddress: string,
      orderHash: string,
      protocolAddress: string,
      side: OrderSide
    ): Promise<FulfillmentDataResponse>;
    getNFT(address: string, identifier: string): Promise<GetNFTResponse>;
    postOrder(
      order: ProtocolData,
      apiOptions: OrderAPIOptions
    ): Promise<OrderV2>;
  };
  seaport_v1_6: {
    createOrder(
      input: CreateOrderInput,
      accountAddress?: string,
      exactApproval?: boolean
    ): Promise<OrderUseCase<CreateOrderAction>>;
  };
  createListing(listing: OpenSeaListing): Promise<OrderV2>;
};

export class OpenSeaMarketplace extends Marketplace {
  constructor(
    _type: MarketplaceType,
    protected _handler: OpenSeaSDKHandler,
    protected _contracts: ContractAddresses,
    protected _feeRecipient: string
  ) {
    super(_type);
  }

  public async createListing(listing: Listing): Promise<Order> {
    const osListing = this.convertListing(listing);
    const osOrder = await this._handler.createListing(osListing);
    return this.convertOsOrder(osOrder);
  }

  public async createBidOrder(listing: Listing): Promise<Order> {
    const fees = BigNumber.from(listing.price).mul(250).div(10000);
    const domain = undefined;
    const salt = undefined;
    const quantity = undefined;
    const { nft } = await this._handler.api.getNFT(
      listing.asset.contract,
      listing.asset.tokenId
    );
    // getNFTItems(nfts: NFT[], quantities: bigint[]): CreateInputItem[]; is a private method in OpenSea SDK, but need to hack it here
    const considerationAssetItems = this._handler["getNFTItems"](
      [nft],
      // [BigInt(quantity ?? 1)]
      [BigInt(1)]
    );
    const considerationFeeItems = [
      {
        itemType: 1,
        token: listing.exchangeToken.address,
        identifierOrCriteria: "0",
        amount: fees.toString(),
        startAmount: fees.toString(),
        endAmount: fees.toString(),
        recipient: this._feeRecipient
      }
    ];
    const orderParams = {
      offer: [
        {
          itemType: 1,
          token: listing.exchangeToken.address,
          amount: listing.price,
          startAmount: listing.price,
          endAmount: listing.price
        }
      ],
      consideration: [...considerationAssetItems, ...considerationFeeItems],
      endTime: listing.expirationTime.toString(),
      zone: listing.zone || "0x0000000000000000000000000000000000000000",
      domain,
      // salt: BigInt(salt ?? 0).toString(),
      salt: BigInt(0).toString(),
      restrictedByZone: true,
      allowPartialFills: false
    };

    const { executeAllActions } = await this._handler.seaport_v1_6.createOrder(
      orderParams,
      listing.offerer
    );
    const order = await executeAllActions();
    const protocolAddress = listing.protocolAddress || this._contracts.seaport;
    if (!protocolAddress) {
      throw new Error(
        `Seaport protocol address must be specified in Lsiting or CoreSDK config`
      );
    }

    const osOrder = await this._handler.api.postOrder(order, {
      protocol: "seaport",
      protocolAddress,
      side: OrderSide.BID
    });
    return this.convertOsOrder(osOrder);
  }

  public async generateFulfilmentData(asset: {
    contract: string;
    tokenId: string;
  }): Promise<PriceDiscoveryStruct> {
    // Asumption: we're fulfilling a Bid Order (don't know if it makes sense with an Ask order)
    const osOrder = await this._handler.api.getOrder({
      assetContractAddress: asset.contract,
      tokenId: asset.tokenId,
      side: OrderSide.BID
    });
    const orderInfo = this.extractOrderInfo(osOrder.protocolData.parameters);
    const ffd = await this._handler.api.generateFulfillmentData(
      this._contracts.priceDiscoveryClient, // the address of the PriceDiscoveryClient contract, which will call the fulfilment method
      osOrder.orderHash,
      osOrder.protocolAddress,
      osOrder.side
    );
    const inputData = ffd.fulfillment_data.transaction
      .input_data as unknown as {
      orders: AdvancedOrder[];
      criteriaResolvers: CriteriaResolver[];
      fulfillments: Fulfillment[];
      recipient: string;
    };
    const price = inputData.orders[1].parameters.consideration[0].startAmount; // offer price minus opensea fees
    const side = Side.Bid; // ?
    const priceDiscoveryContract = osOrder.protocolAddress; // seaport contract address
    const conduit =
      osOrder.protocolData.parameters.conduitKey === NO_CONDUIT
        ? osOrder.protocolAddress // Seaport is used as conduit
        : OPENSEA_CONDUIT_ADDRESS; // TODO: might not work on mocked networks
    const priceDiscoveryData = encodeMatchAdvancedOrders(
      inputData.orders,
      inputData.criteriaResolvers,
      inputData.fulfillments,
      inputData.recipient
    );

    return {
      price,
      side,
      priceDiscoveryContract,
      conduit,
      priceDiscoveryData
    };
  }

  protected convertListing(listing: Listing): OpenSeaListing {
    return {
      asset: {
        tokenAddress: listing.asset.contract,
        tokenId: listing.asset.tokenId
      },
      accountAddress: listing.offerer,
      startAmount: formatUnits(listing.price, listing.exchangeToken.decimals),
      expirationTime: listing.expirationTime,
      paymentTokenAddress: listing.exchangeToken.address,
      englishAuction: listing.auction
    };
  }

  protected convertOsOrder(osOrder: OrderV2 | undefined): Order | undefined {
    if (!osOrder) {
      return undefined;
    }
    const orderInfo = this.extractOrderInfo(osOrder.protocolData.parameters);
    const side = orderInfo.side === OrderSide.ASK ? Side.Ask : Side.Bid;
    return {
      offerer: orderInfo.offerer,
      side,
      contract: orderInfo.nftContract,
      tokenId: orderInfo.tokenId,
      exchangeToken: {
        address: orderInfo.exchangeToken
        // decimals: ???
      },
      price: orderInfo.price,
      startTime: osOrder.listingTime,
      endTime: osOrder.expirationTime,
      orderHash: osOrder.orderHash,
      protocolAddress: osOrder.protocolAddress,
      maker: osOrder.maker ? { address: osOrder.maker.address } : undefined,
      taker: osOrder.taker ? { address: osOrder.taker.address } : undefined
    };
  }

  protected extractOrderInfo(
    parameters: OrderParameters,
    side?: OrderSide
  ): {
    offerer: string;
    side: OrderSide;
    nftContract: string;
    tokenId: string;
    price: string;
    fees: string;
    sellerProfit: string;
    exchangeToken: string;
  } {
    let price: string;
    let exchangeToken: string;
    let nft: ConsiderationItem | OfferItem;
    const nftBid = parameters.consideration.find(
      (c) => c.itemType === ItemType.ERC721
    );
    const nftAsk = parameters.offer.find((c) => c.itemType === ItemType.ERC721);
    if (side === OrderSide.BID && !nftBid) {
      console.warn(`NFT not found in order consideration`);
    }
    if (side === OrderSide.ASK && !nftAsk) {
      console.warn(`NFT not found in order offer`);
    }
    if (!side) {
      if (nftBid && !nftAsk) {
        side = OrderSide.BID;
      } else if (!nftBid && nftAsk) {
        side = OrderSide.ASK;
      } else if (nftBid && nftAsk) {
        console.warn(
          `NFT found in both consideration and offer. Unable to detect the order side`
        );
      } else {
        console.warn(
          `No NFT found in consideration or offer. Unable to detect the order side`
        );
      }
    }
    if (side === OrderSide.BID) {
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
    const fees = price
      ? BigNumber.from(price).mul(250).div(10000).toString()
      : "0";
    const sellerProfit = price
      ? BigNumber.from(price).mul(9750).div(10000).toString()
      : "0";
    return {
      offerer: parameters.offerer,
      side,
      nftContract: nft?.token || "0x0",
      tokenId: nft?.identifierOrCriteria || "0x0",
      price,
      fees,
      sellerProfit,
      exchangeToken
    };
  }

  public async getOrder(
    asset: {
      contract: string;
      tokenId: string;
    },
    side: Side
  ): Promise<SignedOrder> {
    const osOrder = await this._handler.api.getOrder({
      assetContractAddress: asset.contract,
      tokenId: asset.tokenId,
      side: side === Side.Ask ? OrderSide.ASK : OrderSide.BID
    });
    return osOrder
      ? {
          ...this.convertOsOrder(osOrder),
          signature: osOrder.protocolData?.signature
        }
      : undefined;
  }
}
