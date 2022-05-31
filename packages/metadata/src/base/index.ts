import { buildYup } from "schema-to-yup";
import { SchemaOf } from "yup";
import schema from "./schema.json";

export const baseMetadataSchema: SchemaOf<BaseMetadata> = buildYup(schema, {});

export type BaseMetadata = {
  name: string;
  description: string;
  externalUrl: string;
  schemaUrl: string;
  type: "BASE";
};
