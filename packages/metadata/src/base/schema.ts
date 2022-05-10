import { object, string, SchemaOf } from "yup";
import { metadataSchema, Metadata } from "../shared";

export type BaseMetadataType = "BASE";
export const BASE_METADATA_TYPE: BaseMetadataType = "BASE";

export type BaseMetadata = Metadata & {
  type: BaseMetadataType;
};

export const baseMetadataSchema: SchemaOf<BaseMetadata> = object({
  ...metadataSchema,
  type: string().equals([BASE_METADATA_TYPE]).required()
});
