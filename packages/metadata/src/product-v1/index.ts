import { buildYup } from "schema-to-yup";
import { SchemaOf } from "yup";
import schema from "./schema.json";

export const productV1MetadataSchema: SchemaOf<ProductV1Metadata> = buildYup(
  schema,
  {}
);

type ProductBase = {
  title: string;
  description: string;
  identification?: {
    sKU?: string;
    productId?: string;
    productIdType?: string;
  };
  productionInformation: {
    brandName: string;
    manufacturer?: string;
    manufacturerPartNumber?: string;
    modelNumber?: string;
    materials?: string[];
  };
  visuals: {
    images: {
      url: string;
      tag?: string;
    }[];
    videos?: {
      url: string;
      tag?: string;
    }[];
  };
  packaging?: {
    packageQuantity?: string;
    dimensions?: {
      length?: string;
      width?: string;
      height?: string;
      unit: string;
    };
    weight?: {
      value: string;
      unit: string;
    };
  };
};

type ProductDetails = {
  category?: string;
  subCategory?: string;
  subCategory2?: string;
  offerCategory: string;
  tags?: string[];
  sections?: string[];
  personalisation?: string[];
};

type Variation = {
  type: string;
  option: string;
};

type SellerMetadata = {
  defaultVersion?: number;
  name?: string;
  description?: string;
  externalUrl?: string;
  tokenId?: string;
  images?: {
    url: string;
    tag?: string;
  }[];
  contactLinks?: {
    url: string;
    tag: string;
  }[];
};

type ShippingMetadata = {
  defaultVersion?: number;
  countryOfOrigin?: string;
  supportedJurisdictions?: {
    label: string;
    deliveryTime: string;
  }[];
  redemptionPoint?: string;
};

type ExchangePolicy = {
  uuid: string;
  version: number;
  label?: string;
  template: string;
};

export type ProductV1Metadata = {
  schemaUrl: string;
  type: "PRODUCT_V1";
  uuid: string;
  name: string;
  description: string;
  externalUrl: string;
  image: string;
  attributes: {
    trait_type: string;
    value: string;
    display_type?: string;
  }[];
  product:
    | ProductBase
    | {
        uuid: string;
        version: number;
        details: ProductDetails;
      };
  variations?: Variation[];
  seller: SellerMetadata;
  shipping?: ShippingMetadata;
  exchangePolicy: ExchangePolicy;
  "product.overrides"?: ProductBase;
};
