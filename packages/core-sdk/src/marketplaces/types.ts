import {
  PriceDiscoveryStruct,
  Side,
  TransactionResponse
} from "@bosonprotocol/common";
import { OpenSeaSDKHandler } from "./opensea";
import { AdvancedOrder } from "../seaport/interface";

export type DefaultHandler = {
  // Just here as an example for other type of merketplace in the future
  dummy(): () => void;
};

export enum MarketplaceType {
  DEFAULT,
  OPENSEA
}

export enum OrderSide {
  LISTING = "ask",
  OFFER = "bid"
}

export type MarketplaceHandler = OpenSeaSDKHandler | DefaultHandler;

export type Listing = {
  asset: {
    contract: string;
    tokenId: string;
  };
  offerer: string;
  price: string;
  expirationTime: number;
  exchangeToken: { address: string; decimals: number };
  auction: boolean;
  zone?: string;
  protocolAddress?: string;
};

export type Order = {
  offerer: string;
  startTime: number;
  endTime: number;
  orderHash: string;
  protocolAddress: string;
  side: Side;
  maker: {
    address: string;
  };
  taker: {
    address: string;
  };
  contract: string;
  tokenId: string;
  price: string;
  exchangeToken: {
    address: string;
    decimals?: number;
  };
};

export type SignedOrder = Order & {
  signature: string;
};

export abstract class Wrapper {
  public abstract get address(): string;
}

export type OrderFilterOptions = {
  maker?: string;
  listedAfter?: number | string;
  listedBefore?: number | string;
};

export abstract class Marketplace {
  constructor(protected _type: MarketplaceType) {}
  public abstract createListing(listing: Listing): Promise<Order>;
  public abstract createBidOrder(listing: Listing): Promise<Order>;
  public abstract getOrder(
    asset: {
      contract: string;
      tokenId: string;
    },
    side: Side,
    filter?: OrderFilterOptions
  ): Promise<SignedOrder>;
  public abstract getOrders(
    asset: {
      contract: string;
      tokenIds: string[];
    },
    side: Side,
    filter?: OrderFilterOptions
  ): Promise<SignedOrder[]>;
  public abstract generateFulfilmentData(asset: {
    contract: string;
    tokenId: string;
    withWrapper?: boolean;
  }): Promise<PriceDiscoveryStruct>;
  public abstract buildAdvancedOrder(
    asset: {
      contract: string;
      tokenId: string;
      withWrapper?: boolean;
    },
    filter?: OrderFilterOptions
  ): Promise<AdvancedOrder>;
  public abstract wrapVouchers(
    contract: string,
    tokenIds: string[]
  ): Promise<TransactionResponse>;
  public abstract unwrapVoucher(
    contract: string,
    tokenId: string
  ): Promise<TransactionResponse>;
  public abstract finalizeAuction(asset: {
    contract: string;
    tokenId: string;
  }): Promise<TransactionResponse>;
  public abstract isVoucherWrapped(
    contractAddress: string,
    tokenId: string
  ): Promise<{ wrapped: boolean; wrapper?: string }>;
  public abstract getOrCreateVouchersWrapper(
    contractAddress: string
  ): Promise<Wrapper>;
}
