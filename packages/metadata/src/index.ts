import * as base from "./base";
import * as productV1 from "./product-v1";
import * as seller from "./seller";

export type AnyMetadata = base.BaseMetadata | productV1.ProductV1Metadata;

export type OfferOrSellerMetadata = AnyMetadata | seller.SellerMetadata;

export enum MetadataType {
  BASE = "BASE",
  PRODUCT_V1 = "PRODUCT_V1",
  SELLER = "SELLER"
}

export interface MetadataStorage {
  getMetadata(metadataUri: string): Promise<OfferOrSellerMetadata>;
  storeMetadata(metadata: OfferOrSellerMetadata): Promise<string>;
}

export const METADATA_LENGTH_LIMIT = 2048;
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

function validateMetadata(metadata: OfferOrSellerMetadata) {
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

export { validateMetadata, base, productV1, seller };
