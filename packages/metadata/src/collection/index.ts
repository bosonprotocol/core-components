import { buildYup } from "schema-to-yup";
import { Schema } from "yup";
import schema from "./schema.json";
import { IMetadata } from "@bosonprotocol/metadata-storage";

export const collectionMetadataSchema: Schema<CollectionMetadata> = buildYup(
  schema,
  {}
);

export type CollectionMetadata = Omit<IMetadata, "type"> & {
  type: "COLLECTION";
  name: string;
  description?: string;
  image?: string;
  externalLink?: string;
  external_link?: string; // Stay compliant with https://docs.opensea.io/docs/contract-level-metadata
  collaborators?: string[];
};
