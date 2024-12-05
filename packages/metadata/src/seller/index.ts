import { buildYup } from "schema-to-yup";
import { Schema } from "yup";
import schema from "./schema.json";
import { Media } from "../common";

export const sellerMetadataSchema: Schema<SellerMetadata> = buildYup(
  schema,
  {}
);

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
      lastUpdated?: string;
    }[];
  }[];
};
