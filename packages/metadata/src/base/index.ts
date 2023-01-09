import { buildYup } from "schema-to-yup";
import { SchemaOf } from "yup";
import schema from "./schema.json";

export const baseMetadataSchema: SchemaOf<BaseMetadata> = buildYup(schema, {});

export type BaseMetadata = {
  schemaUrl: string;
  type: "BASE";
  name: string;
  description: string;
  externalUrl: string;
  licenseUrl: string;
  condition?: string;
  animationUrl?: string;
};
