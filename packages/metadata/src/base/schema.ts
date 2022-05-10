import { object, string, SchemaOf } from "yup";
import { metadataSchema, Metadata } from "../shared";

export type BaseMetadata = Metadata & {
  type: "BASE";
};

export const baseMetadataSchema: SchemaOf<BaseMetadata> = object({
  ...metadataSchema,
  type: string().equals(["BASE"]).required()
});
