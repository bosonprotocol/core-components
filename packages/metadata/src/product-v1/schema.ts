import { object, string, array, SchemaOf } from "yup";
import { metadataSchema, Metadata } from "../shared";

export type ProductV1MetadataType = "PRODUCT_V1";
export const PRODUCT_V1_METADATA_TYPE: ProductV1MetadataType = "PRODUCT_V1";

export type ProductV1Metadata = Metadata & {
  type: ProductV1MetadataType;
  images: string[];
  tags: string[];
  brandName: string;
};

export const productV1MetadataSchema: SchemaOf<ProductV1Metadata> = object({
  ...metadataSchema,
  type: string().equals([PRODUCT_V1_METADATA_TYPE]).required(),
  images: array(string()).required(),
  tags: array(string()).required(),
  brandName: string().required()
});
