import * as base from "./base";
import * as productV1 from "./product-v1";
import * as seller from "./seller";
import * as collection from "./collection";
import * as rNFT from "./rNFT";
import * as bundle from "./bundle";
import * as productV1Item from "./productV1Item";
import * as nftItem from "./nftItem";
import { MetadataType } from "./iMetadata";
import { buildUuid, Media } from "./common";

import {
  IMetadata as _IMetadata,
  AnyMetadata as _AnyMetadata,
  MetadataStorage as _MetadataStorage
} from "@bosonprotocol/metadata-storage";
type IMetadata = _IMetadata;
type AnyMetadata = _AnyMetadata;
type MetadataStorage = _MetadataStorage;

export type OfferOrSellerMetadata = AnyMetadata;

const METADATA_LENGTH_LIMIT = 2048;
function validateIpfsLimits(
  metadata: Record<string, unknown>
): string | undefined {
  for (const key in metadata) {
    const value = metadata[key];

    if (typeof value === "object" && value !== null) {
      // Recursively check nested objects/arrays
      const nestedKey = validateIpfsLimits(value as Record<string, unknown>);
      if (nestedKey !== undefined) {
        return `${key}.${nestedKey}`;
      }
    } else {
      // Check the string representation of primitive values
      const stringValue = value?.toString();
      if (stringValue && stringValue.length > METADATA_LENGTH_LIMIT) {
        return Array.isArray(metadata)
          ? `${key}.[${metadata.indexOf(value)}]`
          : key;
      }
    }
  }

  return undefined;
}

function validateMetadata(metadata: AnyMetadata) {
  try {
    const firstKeyThatExceedsIpfsLimit = validateIpfsLimits(metadata);
    if (firstKeyThatExceedsIpfsLimit) {
      throw new Error(
        `Key ${firstKeyThatExceedsIpfsLimit} of metadata exceeds ${METADATA_LENGTH_LIMIT} characters`
      );
    }
    switch (metadata.type) {
      case MetadataType.BASE:
        base.baseMetadataSchema.validateSync(metadata, {
          abortEarly: false
        });
        return true;
      case MetadataType.PRODUCT_V1:
        productV1.productV1MetadataSchema.validateSync(metadata, {
          abortEarly: false
        });
        return true;
      case MetadataType.SELLER:
        seller.sellerMetadataSchema.validateSync(metadata, {
          abortEarly: false
        });
        return true;
      case MetadataType.COLLECTION:
        collection.collectionMetadataSchema.validateSync(metadata, {
          abortEarly: false
        });
        return true;
      case MetadataType.BUNDLE:
        bundle.bundleMetadataSchema.validateSync(metadata, {
          abortEarly: false
        });
        return true;
      case MetadataType.rNFT:
        rNFT.rNFTMetadataSchema.validateSync(metadata, {
          abortEarly: false
        });
        return true;
      case MetadataType.ITEM_NFT:
        nftItem.nftItemSchema.validateSync(metadata, {
          abortEarly: false
        });
        return true;
      case MetadataType.ITEM_PRODUCT_V1:
        productV1Item.productV1ItemSchema.validateSync(metadata, {
          abortEarly: false
        });
        return true;
      default:
        throw new Error(
          `Metadata validation failed for unknown type: ${metadata.type}`
        );
    }
  } catch (e) {
    if (e.errors && e.errors.length > 1) {
      e.message = e.message + "\n" + e.errors.join("\n");
    }
    throw e;
  }
}

export {
  MetadataType,
  validateMetadata,
  base,
  productV1,
  seller,
  collection,
  rNFT,
  bundle,
  nftItem,
  productV1Item,
  METADATA_LENGTH_LIMIT,
  buildUuid,
  Media,
  IMetadata,
  AnyMetadata,
  MetadataStorage
};
