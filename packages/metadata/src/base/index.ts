import { buildYup } from "schema-to-yup";
import { SchemaOf } from "yup";
import schema from "./schema.json";
import { RNftMetadata } from "../rNFT";

export const baseMetadataSchema: SchemaOf<BaseMetadata> = buildYup(schema, {});

export type BaseMetadata = Omit<RNftMetadata, "type"> & {
  type: "BASE";
};
