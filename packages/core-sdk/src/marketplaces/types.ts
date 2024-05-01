import {
  PriceDiscoveryStruct,
  Side,
  TransactionResponse
} from "@bosonprotocol/common";
import { OpenSeaSDKHandler } from "./opensea";

export type DefaultHandler = {
  // Just here as an example for other type of merketplace in the future
  dummy(): () => void;
};

export enum MarketplaceType {
  DEFAULT,
  OPENSEA
}

export enum OrderSide {}

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

export abstract class Marketplace {
  constructor(protected _type: MarketplaceType) {}
  public abstract createListing(listing: Listing): Promise<Order>;
  public abstract createBidOrder(listing: Listing): Promise<Order>;
  public abstract getOrder(
    asset: {
      contract: string;
      tokenId: string;
    },
    side: Side
  ): Promise<SignedOrder>;
  public abstract generateFulfilmentData(
    asset: {
      contract: string;
      tokenId: string;
    },
    withWrapper?: boolean
  ): Promise<PriceDiscoveryStruct>;
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
