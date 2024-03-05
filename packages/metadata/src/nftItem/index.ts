import { buildYup } from "schema-to-yup";
import { SchemaOf } from "yup";
import schema from "./schema.json";
import { IItemMetadata } from "../iMetadata";

export const nftItemSchema: SchemaOf<NftItem> = buildYup(schema, {});

export type NftItem = Omit<IItemMetadata, "type"> & {
  type: "ITEM_NFT";
  name: string;
  description?: string;
  image?: string;
  imageData?: string;
  externalUrl?: string;
  animationUrl?: string;
  youtubeUrl?: string;
  image_data?: string; // stay compliant with https://docs.opensea.io/docs/metadata-standards
  external_url?: string; // stay compliant with https://docs.opensea.io/docs/metadata-standards
  animation_url?: string; // stay compliant with https://docs.opensea.io/docs/metadata-standards
  youtube_url?: string; // stay compliant with https://docs.opensea.io/docs/metadata-standards
  attributes?:
    | {
        traitType: string;
        value: string;
        displayType?: string;
      }[]
    | {
        // stay compliant with https://docs.opensea.io/docs/metadata-standards
        trait_type: string;
        value: string;
        display_type?: string;
      }[];
  chainId?: number;
  contract?: string;
  tokenId?: string;
  tokenIdRange?: {
    min: string;
    max: string;
  };
  quantity?: number;
  transferMethod?: string;
  terms?: {
    key: string;
    value: string;
    displayType?: string;
  }[];
};
