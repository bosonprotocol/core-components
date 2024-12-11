import { buildYup } from "schema-to-yup";
import { Schema } from "yup";
import schema from "./schema.json";
import { IMetadata } from "@bosonprotocol/metadata-storage";

export const rNFTMetadataSchema: Schema<RNftMetadata> = buildYup(schema, {});

// https://docs.opensea.io/docs/metadata-standards
// https://github.com/ethereum/ercs/blob/master/ERCS/erc-721.md

export type RNftMetadata = Omit<IMetadata, "type"> & {
  type: "rNFT";
  name: string;
  description: string;
  image?: string;
  imageData?: string;
  externalUrl: string;
  licenseUrl: string;
  condition?: string;
  animationUrl?: string;
  youtubeUrl?: string;
  attributes?: {
    traitType: string;
    value: string;
    displayType?: string;
  }[];
};
