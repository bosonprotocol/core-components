import { buildYup } from "schema-to-yup";
import { SchemaOf } from "yup";
import schema from "./schema.json";

export const collectionMetadataSchema: SchemaOf<CollectionMetadata> = buildYup(
  schema,
  {}
);

export type CollectionMetadata = {
  type: "COLLECTION";
  name: string;
  description?: string;
  image?: string;
  external_link?: string;
  collaborators?: string[];
};
