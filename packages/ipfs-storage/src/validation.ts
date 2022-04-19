import { utils, AnyMetadata, MetadataType } from "@bosonprotocol/common";

export function validateMetadata(metadata: AnyMetadata) {
  switch (metadata.type) {
    case MetadataType.BASE:
      utils.validation.baseMetadataSchema.validateSync(metadata, {
        abortEarly: false
      });
      return true;
    case MetadataType.PRODUCT_V1:
      utils.validation.productV1MetadataSchema.validateSync(metadata, {
        abortEarly: false
      });
      return true;
    default:
      throw new Error(
        `Metadata validation failed for unknown type: ${
          (metadata as Record<string, unknown>).type
        }`
      );
  }
}
