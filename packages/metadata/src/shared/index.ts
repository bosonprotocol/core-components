import { string } from "yup";

export interface Metadata {
  name: string;
  description: string;
  externalUrl: string;
  schemaUrl: string;
  type: string;
}

export const metadataSchema = {
  name: string().defined(),
  description: string().defined(),
  externalUrl: string().defined(),
  schemaUrl: string().defined(),
  type: string().defined()
};
