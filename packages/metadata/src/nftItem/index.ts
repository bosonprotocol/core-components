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
  externalUrl?: string;
  animationUrl?: string;
  attributes?: {
    trait_type: string;
    value: string;
    display_type?: string;
  }[];
  chainId?: number;
  contract?: string;
  tokenId?: string;
  quantity?: number;
};
