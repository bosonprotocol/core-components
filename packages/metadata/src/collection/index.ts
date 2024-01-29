import { buildYup } from "schema-to-yup";
import { SchemaOf } from "yup";
import schema from "./schema.json";
import { IMetadata } from "../iMetadata";

export const collectionMetadataSchema: SchemaOf<CollectionMetadata> = buildYup(
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
