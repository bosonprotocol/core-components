import { buildYup } from "schema-to-yup";
import { Schema } from "yup";
import schema from "./schema.json";
import { RNftMetadata } from "../rNFT";

export const baseMetadataSchema: Schema<BaseMetadata> = buildYup(schema, {});

export type BaseMetadata = Omit<RNftMetadata, "type"> & {
  type: "BASE";
};
