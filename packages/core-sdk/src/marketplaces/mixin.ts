import { Web3LibAdapter } from "@bosonprotocol/common";
import { BaseCoreSDK } from "./../mixins/base-core-sdk";
import { OpenSeaMarketplace, OpenSeaSDKHandler } from "./opensea";
import { MarketplaceType, MarketplaceHandler } from "./types";

type MarketplaceTypeToClass = {
  [MarketplaceType.OPENSEA]: OpenSeaMarketplace;
};

export class MarketplaceMixin<T extends Web3LibAdapter> extends BaseCoreSDK<T> {
  public marketplace<T extends keyof MarketplaceTypeToClass>(
    type: T,
    handler: T extends MarketplaceType.OPENSEA
      ? OpenSeaSDKHandler
      : MarketplaceHandler,
    feeRecipient: string
  ): MarketplaceTypeToClass[T] {
    switch (type) {
      case MarketplaceType.OPENSEA: {
        return new OpenSeaMarketplace(
          type,
          handler as OpenSeaSDKHandler,
          this._contracts,
          feeRecipient,
          this._web3Lib
        );
      }
      default:
        throw new Error(`Not Supported Marketplace Type '${type}'`);
    }
  }
}
