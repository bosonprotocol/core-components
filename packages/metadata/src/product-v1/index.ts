import { buildYup } from "schema-to-yup";
import { SchemaOf } from "yup";
import schema from "./schema.json";

export const productV1MetadataSchema: SchemaOf<ProductV1Metadata> = buildYup(
  schema,
  {}
);

export type ProductV1Metadata = {
  name: string;
  description: string;
  externalUrl: string;
  schemaUrl: string;
  type: "PRODUCT_V1";
  images: string[];
  tags: string[];
  brandName: string;
};
