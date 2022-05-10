import * as base from "./base";
import * as productV1 from "./product-v1";

export type AnyMetadata = base.BaseMetadata | productV1.ProductV1Metadata;

export enum MetadataType {
  BASE = "BASE",
  PRODUCT_V1 = "PRODUCT_V1"
}

export interface MetadataStorage {
  getMetadata(metadataUri: string): Promise<AnyMetadata>;
  storeMetadata(metadata: AnyMetadata): Promise<string>;
}

function validateMetadata(metadata: AnyMetadata) {
  switch (metadata.type) {
    case base.BASE_METADATA_TYPE:
      base.baseMetadataSchema.validateSync(metadata, {
        abortEarly: false
      });
      return true;
    case productV1.PRODUCT_V1_METADATA_TYPE:
      productV1.productV1MetadataSchema.validateSync(metadata, {
        abortEarly: false
      });
      return true;
    default:
      throw new Error(
        `Metadata validation failed for unknown type: ${
          (metadata as Record<string, unknown>)?.type
        }`
      );
  }
}

export { validateMetadata, base, productV1 };
