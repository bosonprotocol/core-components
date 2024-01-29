export enum MetadataType {
  BASE = "BASE", // Base Schema Metadata for an Offer
  PRODUCT_V1 = "PRODUCT_V1", // Metadata for a Physical Product Offer (version 1)
  SELLER = "SELLER", // Metadata for a Seller
  COLLECTION = "COLLECTION", // Metadata for a Collection of Offers
  rNFT = "rNFT", // Metadata for a Redeemable NFT (similar to BASE)
  BUNDLE = "BUNDLE", // Metadata for a Bundle Offer
  ITEM_PRODUCT_V1 = "ITEM_PRODUCT_V1", // Metadata for an Physical Product Item (referenced in a Bundle Offer)
  ITEM_NFT = "ITEM_NFT" // Metadata for an NFT Item (referenced in a Bundle Offer)
}

export interface IMetadata {
  type: MetadataType;
  schemaUrl: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IItemMetadata extends IMetadata {}
