import { buildYup } from "schema-to-yup";
import { SchemaOf } from "yup";
import schema from "./schema.json";
import { RNftMetadata } from "../rNFT";

export const bundleMetadataSchema: SchemaOf<BundleMetadata> = buildYup(
  schema,
  {}
);

export type BundleMetadata = Omit<RNftMetadata, "type"> & {
  type: "BUNDLE";
  items: string[];
};
