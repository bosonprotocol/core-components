import { buildYup } from "schema-to-yup";
import { SchemaOf } from "yup";
import schema from "./schema.json";

export const sellerMetadataSchema: SchemaOf<SellerMetadata> = buildYup(
  schema,
  {}
);

export type Media = {
  url: string;
  tag?: string;
  type?: string;
  width?: number;
  height?: number;
};

export type SellerMetadata = {
  type: "SELLER";
  name?: string;
  description?: string;
  legalTradingName?: string;
  kind: string;
  website?: string;
  images?: Media[];
  contactLinks?: {
    url: string;
    tag: string;
  }[];
  contactPreference: string;
  socialLinks?: {
    url: string;
    tag: string;
  }[];
  salesChannels?: {
    tag: string;
    settingsUri?: string;
    settingsEditor?: string;
    link?: string;
    deployments?: {
      product?: { uuid: string; version: number };
      status?: string;
      link?: string;
      lastUpdated?: number;
    }[];
  }[];
};
