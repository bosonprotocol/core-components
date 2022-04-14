export enum MetadataType {
  BASE = "BASE",
  PRODUCT_V1 = "PRODUCT_V1"
}

export type Metadata = {
  name: string;
  description: string;
  externalUrl: string;
  schemaUrl: string;
  type: MetadataType | string;
};

export type BaseMetadata = Metadata & {
  type: MetadataType.BASE;
};

export type ProductV1Metadata = Metadata & {
  type: MetadataType.PRODUCT_V1;
  images: string[];
  tags: string[];
  brandName: string;
};

export type AnyMetadata = BaseMetadata | ProductV1Metadata;

export interface MetadataStorage {
  getMetadata(metadataUri: string): Promise<AnyMetadata>;
  storeMetadata(metadata: AnyMetadata): Promise<string>;
}
