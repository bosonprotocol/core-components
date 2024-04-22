import { BaseCoreSDK } from "./../mixins/base-core-sdk";
import { OpenSeaMarketplace, OpenSeaSDKHandler } from "./opensea";
import { MarketplaceType, MarketplaceHandler, Marketplace } from "./types";

export class MarketplaceMixin extends BaseCoreSDK {
  public marketplace(
    type: MarketplaceType,
    handler: MarketplaceHandler,
    feeRecipient: string
  ): Marketplace {
    switch (type) {
      case MarketplaceType.OPENSEA: {
        return new OpenSeaMarketplace(
          type,
          handler as OpenSeaSDKHandler,
          this._contracts,
          feeRecipient
        );
      }
      default:
        throw new Error(`Not Supported Marketplace Type '${type}'`);
    }
  }
}
