import { formatUnits } from "@ethersproject/units";
import {
  AssetWithTokenId,
  FulfillmentDataResponse,
  GetNFTResponse,
  OrderAPIOptions,
  OrderType,
  OrderV2,
  OrdersQueryOptions,
  ProtocolData
} from "opensea-js";
import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { abis } from "@bosonprotocol/common";
import { Interface } from "@ethersproject/abi";
import { AddressZero } from "@ethersproject/constants";
import {
  Listing,
  Marketplace,
  MarketplaceType,
  Order,
  OrderFilterOptions,
  OrderSide,
  SignedOrder,
  Wrapper
} from "./types";
import {
  ConsiderationItem,
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
  Side,
  Web3LibAdapter
} from "@bosonprotocol/common";
import {
  CriteriaResolver,
  encodeMatchAdvancedOrders,
  AdvancedOrder,
  Fulfillment
} from "../seaport/interface";
import { ownerOf as erc721OwnerOf } from "../erc721/handler";

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
    getOrders(
      order: Omit<OrdersQueryOptions, "limit">
    ): Promise<{ orders: OrderV2[] }>;
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
  cancelOrder(args: {
    order: OrderV2;
    accountAddress: string;
    domain?: string;
  }): Promise<void>;
};

export class WrapperFactory {
  protected iface: Interface;
  constructor(
    protected _contract: string,
    protected _web3Lib: Web3LibAdapter
  ) {
    if (abis["OpenSeaWrapperFactoryABI"]) {
      this.iface = new Interface(abis["OpenSeaWrapperFactoryABI"]);
    }
    //TODO: check contract address is valid (trying to read contract)?
  }

  public async create(args: { voucherContract: string }) {
    return this._web3Lib.sendTransaction({
      to: this._contract,
      data: this.iface.encodeFunctionData("create", [args.voucherContract])
    });
  }
  public async getWrapper(args: {
    voucherContract: string;
  }): Promise<string | undefined> {
    const result = await this._web3Lib.call({
      to: this._contract,
      data: this.iface.encodeFunctionData("getWrapper", [args.voucherContract])
    });
    const [wrapper] = this.iface.decodeFunctionResult("getWrapper", result);
    return wrapper !== AddressZero ? (wrapper as string) : undefined;
  }
}

export class OpenSeaWrapper extends Wrapper {
  protected iface: Interface;
  constructor(
    protected _contract: string,
    protected _web3Lib: Web3LibAdapter
  ) {
    super();
    if (abis["OpenSeaWrapperABI"]) {
      this.iface = new Interface(abis["OpenSeaWrapperABI"]);
    }
  }

  public async wrapForAuction(args: { tokenIds: BigNumberish[] }) {
    return this._web3Lib.sendTransaction({
      to: this._contract,
      data: this.iface.encodeFunctionData("wrapForAuction", [args.tokenIds])
    });
  }

  public async unwrap(args: { tokenId: BigNumberish }) {
    return this._web3Lib.sendTransaction({
      to: this._contract,
      data: this.iface.encodeFunctionData("unwrap", [args.tokenId])
    });
  }

  public encodeFinalizeAuction(args: {
    tokenId: BigNumberish;
    order: AdvancedOrder;
  }) {
    return this.iface.encodeFunctionData("finalizeAuction", [
      args.tokenId,
      args.order
    ]);
  }

  public async finalizeAuction(args: {
    tokenId: BigNumberish;
    order: AdvancedOrder;
  }) {
    return this._web3Lib.sendTransaction({
      to: this._contract,
      data: this.iface.encodeFunctionData("finalizeAuction", [
        args.tokenId,
        args.order
      ])
    });
  }

  public get address(): string {
    return this._contract;
  }
}

export class OpenSeaMarketplace extends Marketplace {
  protected _wrapperFactory: WrapperFactory;
  protected _wrappersMap = new Map<string, OpenSeaWrapper>();
  constructor(
    _type: MarketplaceType,
    protected _handler: OpenSeaSDKHandler,
    protected _contracts: ContractAddresses,
    protected _feeRecipient: string,
    protected _web3Lib: Web3LibAdapter
  ) {
    super(_type);
    if (this._contracts["openseaWrapper"]) {
      this._wrapperFactory = new WrapperFactory(
        this._contracts["openseaWrapper"],
        this._web3Lib
      );
    }
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
        `Seaport protocol address must be specified in Listing or CoreSDK config`
      );
    }

    const osOrder = await this._handler.api.postOrder(order, {
      protocol: "seaport",
      protocolAddress,
      side: OrderSide.OFFER
    });
    return this.convertOsOrder(osOrder);
  }

  public async buildAdvancedOrder(
    asset: {
      contract: string;
      tokenId: string;
      withWrapper?: boolean;
    },
    filter: OrderFilterOptions = {}
  ): Promise<AdvancedOrder> {
    // Assumption: we're fulfilling a Bid Order (don't know if it makes sense with an Ask order)
    const osOrder = await this._handler.api.getOrder({
      assetContractAddress: asset.contract,
      tokenId: asset.tokenId,
      side: OrderSide.OFFER,
      ...filter
    });
    const fulfillerAddress = asset.withWrapper
      ? asset.contract // If the token is wrapped, the fulfiller is the wrapper contract itself
      : this._contracts.priceDiscoveryClient; // otherwise the address of the PriceDiscoveryClient contract
    const ffd = await this._handler.api.generateFulfillmentData(
      fulfillerAddress,
      osOrder.orderHash,
      osOrder.protocolAddress,
      // osOrder.side
      OrderSide.LISTING // TODO: Hack waiting for Opensea API bug to be fixed. See https://github.com/fermionprotocol/ui/issues/358
    );
    const inputData = ffd.fulfillment_data.transaction
      .input_data as unknown as {
      orders: AdvancedOrder[];
      criteriaResolvers: CriteriaResolver[];
      fulfillments: Fulfillment[];
      recipient: string;
    };
    return inputData.orders[0];
  }

  public async generateFulfilmentData(asset: {
    contract: string;
    tokenId: string;
    withWrapper?: boolean;
  }): Promise<PriceDiscoveryStruct> {
    const withWrapper = !!asset.withWrapper;
    const wrapper = withWrapper
      ? await this.getOrCreateVouchersWrapper(asset.contract)
      : undefined;
    // Asumption: we're fulfilling a Bid Order (don't know if it makes sense with an Ask order)
    const osOrder = await this._handler.api.getOrder({
      assetContractAddress: withWrapper ? wrapper.address : asset.contract,
      tokenId: asset.tokenId,
      side: OrderSide.OFFER
    });
    const ffd = await this._handler.api.generateFulfillmentData(
      withWrapper
        ? wrapper.address // the wrapper will call the fulfilment method (seaport)
        : this._contracts.priceDiscoveryClient, // the priceDiscoveryClient will call the fulfilment method (seaport)
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
    let side, priceDiscoveryContract, conduit, priceDiscoveryData;
    if (withWrapper) {
      side = Side.Wrapper;
      priceDiscoveryContract = wrapper.address;
      conduit = wrapper.address;
      priceDiscoveryData = wrapper.encodeFinalizeAuction({
        tokenId: asset.tokenId,
        order: ffd.fulfillment_data.transaction.input_data
          .orders[0] as unknown as AdvancedOrder
      });
    } else {
      side = Side.Bid;
      priceDiscoveryContract = osOrder.protocolAddress; // seaport contract address
      conduit =
        osOrder.protocolData.parameters.conduitKey === NO_CONDUIT
          ? osOrder.protocolAddress // Seaport is used as conduit
          : OPENSEA_CONDUIT_ADDRESS; // TODO: might not work on mocked networks
      priceDiscoveryData = encodeMatchAdvancedOrders(
        inputData.orders,
        inputData.criteriaResolvers,
        inputData.fulfillments,
        inputData.recipient
      );
    }

    return {
      price,
      side,
      priceDiscoveryContract,
      conduit,
      priceDiscoveryData
    };
  }

  /** getOrCreateVouchersWrapper needs to be done at voucher contract level,
   *  before being able to wrap vouchers, then list them on OS **/
  public async getOrCreateVouchersWrapper(
    contractAddress: string
  ): Promise<OpenSeaWrapper> {
    if (!this._wrapperFactory) {
      throw new Error("WrapperFactory is not initialized");
    }
    // Is the wrapper already cached?
    let wrapper = this._wrappersMap.get(contractAddress);
    if (!wrapper) {
      // Does the wrapper exist on chain?
      let wrapperAddress = await this._wrapperFactory.getWrapper({
        voucherContract: contractAddress
      });
      if (!wrapperAddress) {
        // Create the wrapper on-chain
        const tx = await this._wrapperFactory.create({
          voucherContract: contractAddress
        });
        await tx.wait();
        wrapperAddress = await this._wrapperFactory.getWrapper({
          voucherContract: contractAddress
        });
      }
      wrapper = new OpenSeaWrapper(wrapperAddress, this._web3Lib);
      // cache the wrapper for next time
      this._wrappersMap.set(contractAddress, wrapper);
    }
    return wrapper;
  }

  public async isVoucherWrapped(
    contractAddress: string,
    tokenId: string
  ): Promise<{ wrapped: boolean; wrapper?: string }> {
    let wrapper = this._wrappersMap.get(contractAddress);
    if (!wrapper) {
      if (!this._wrapperFactory) {
        throw new Error("WrapperFactory is not initialized");
      }
      // Does the wrapper exist on chain?
      const wrapperAddress = await this._wrapperFactory.getWrapper({
        voucherContract: contractAddress
      });
      if (!wrapperAddress) {
        // Wrapper contract doesn't exist
        return { wrapped: false };
      }
      wrapper = new OpenSeaWrapper(wrapperAddress, this._web3Lib);
      // cache the wrapper for next time
      this._wrappersMap.set(contractAddress, wrapper);
    }
    try {
      await erc721OwnerOf({
        contractAddress: wrapper.address,
        tokenId,
        web3Lib: this._web3Lib
      });
    } catch (e) {
      // Wrapper contract exists, however the token is not wrapped
      return { wrapped: false, wrapper: wrapper.address };
    }
    return { wrapped: true, wrapper: wrapper.address };
  }

  public async wrapVouchers(contract: string, tokenIds: string[]) {
    const wrapper = await this.getOrCreateVouchersWrapper(contract);
    return wrapper.wrapForAuction({ tokenIds });
  }

  public async unwrapVoucher(contract: string, tokenId: string) {
    const wrapper = await this.getOrCreateVouchersWrapper(contract);
    return wrapper.unwrap({ tokenId });
  }

  public async finalizeAuction(asset: { contract: string; tokenId: string }) {
    const wrapper = await this.getOrCreateVouchersWrapper(asset.contract);
    const osOrder = await this._handler.api.getOrder({
      assetContractAddress: wrapper.address, // Bid Order must be for the wrapped token
      tokenId: asset.tokenId,
      side: OrderSide.OFFER
    });
    const ffd = await this._handler.api.generateFulfillmentData(
      this._contracts.priceDiscoveryClient, // the address of the PriceDiscoveryClient contract, which will call the fulfilment method
      osOrder.orderHash,
      osOrder.protocolAddress,
      osOrder.side
    );
    const buyerOrder = ffd.fulfillment_data.transaction.input_data
      .orders[0] as unknown as AdvancedOrder;
    return wrapper.finalizeAuction({
      tokenId: asset.tokenId,
      order: buyerOrder
    });
  }

  public async cancelOrder(
    asset: {
      contract: string;
      tokenId: string;
    },
    side: Side
  ) {
    const signer = await this._web3Lib.getSignerAddress();
    const osOrder = await this._handler.api.getOrder({
      assetContractAddress: asset.contract,
      tokenId: asset.tokenId,
      side: side === Side.Ask ? OrderSide.LISTING : OrderSide.OFFER,
      maker: signer
    });
    await this._handler.cancelOrder({
      order: osOrder,
      accountAddress: osOrder.maker.address
    });
  }

  protected convertListing(listing: Listing): OpenSeaListing {
    return {
      asset: {
        tokenAddress: listing.asset.contract,
        tokenId: listing.asset.tokenId
      },
      accountAddress: listing.offerer,
      startAmount: formatUnits(listing.price, listing.exchangeToken.decimals),
      listingTime: listing.listingTime,
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
    const side = orderInfo.side === OrderSide.LISTING ? Side.Ask : Side.Bid;
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
      taker: osOrder.taker ? { address: osOrder.taker.address } : undefined,
      isAuction: osOrder.orderType === OrderType.ENGLISH
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
    if (side === OrderSide.OFFER && !nftBid) {
      console.warn(`NFT not found in order consideration`);
    }
    if (side === OrderSide.LISTING && !nftAsk) {
      console.warn(`NFT not found in order offer`);
    }
    if (!side) {
      if (nftBid && !nftAsk) {
        side = OrderSide.OFFER;
      } else if (!nftBid && nftAsk) {
        side = OrderSide.LISTING;
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
    side: Side,
    filter: OrderFilterOptions = {}
  ): Promise<SignedOrder> {
    const osOrder = await this._handler.api.getOrder({
      assetContractAddress: asset.contract,
      tokenId: asset.tokenId,
      side: side === Side.Ask ? OrderSide.LISTING : OrderSide.OFFER,
      ...filter
    });
    return osOrder
      ? {
          ...this.convertOsOrder(osOrder),
          signature: osOrder.protocolData?.signature
        }
      : undefined;
  }

  public async getOrders(
    asset: {
      contract: string;
      tokenIds: string[];
    },
    side: Side,
    filter: OrderFilterOptions = {}
  ): Promise<SignedOrder[]> {
    const { orders } = await this._handler.api.getOrders({
      assetContractAddress: asset.contract,
      tokenIds: asset.tokenIds,
      side: side === Side.Ask ? OrderSide.LISTING : OrderSide.OFFER,
      ...filter
    });
    return orders.map((osOrder) => ({
      ...this.convertOsOrder(osOrder),
      signature: osOrder.protocolData?.signature
    }));
  }
}
