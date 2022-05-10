import { object, string, array, SchemaOf } from "yup";
import { metadataSchema, Metadata } from "../shared";

export type ProductV1Metadata = Metadata & {
  type: "PRODUCT_V1";
  images: string[];
  tags: string[];
  brandName: string;
};

export const productV1MetadataSchema: SchemaOf<ProductV1Metadata> = object({
  ...metadataSchema,
  type: string().equals(["PRODUCT_V1"]).required(),
  images: array(string()).required(),
  tags: array(string()).required(),
  brandName: string().required()
});
