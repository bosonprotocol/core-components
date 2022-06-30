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
  // eslint-disable-next-line no-useless-catch
  try {
    switch (metadata.schema.type) {
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
      default:
        throw new Error(
          `Metadata validation failed for unknown type: ${metadata.schema.type}`
        );
    }
  } catch (e) {
    throw e.errors ? new Error(e.message + "\n" + e.errors.join("\n")) : e;
  }
}

export { validateMetadata, base, productV1 };
