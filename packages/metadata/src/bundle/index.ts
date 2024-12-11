import { buildYup } from "schema-to-yup";
import { Schema } from "yup";
import schema from "./schema.json";
import { RNftMetadata } from "../rNFT";
import { Media } from "../common";

export const bundleMetadataSchema: Schema<BundleMetadata> = buildYup(
  schema,
  {}
);

export type ItemMetadataLink = {
  url: string;
};

// TODO externalize SellerMetadata (rationalize with other Seller metadata?)
type SellerMetadata = {
  defaultVersion: number;
  name: string;
  description?: string;
  externalUrl?: string;
  tokenId?: string;
  images?: Media[];
  contactLinks: {
    url: string;
    tag: string;
  }[];
  contactPreference?: string;
};

export type BundleMetadata = Omit<RNftMetadata, "type"> & {
  type: "BUNDLE";
  bundleUuid: string; // same uuid in different bundles means a set of variants for a multi-variant bundle (typically containing a multi-variant physical product)
  seller: SellerMetadata;
  items: ItemMetadataLink[];
};
