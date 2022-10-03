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
  identification_sKU?: string;
  identification_productId?: string;
  identification_productIdType?: string;
  productionInformation_brandName: string;
  productionInformation_manufacturer?: string;
  productionInformation_manufacturerPartNumber?: string;
  productionInformation_modelNumber?: string;
  productionInformation_materials?: string[];
  visuals_images: {
    url: string;
    tag?: string;
  }[];
  visuals_videos?: {
    url: string;
    tag?: string;
  }[];
  packaging_packageQuantity?: string;
  packaging_dimensions_length?: string;
  packaging_dimensions_width?: string;
  packaging_dimensions_height?: string;
  packaging_dimensions_unit: string;
  packaging_weight_value: string;
  packaging_weight_unit: string;
};

type ProductDetails = {
  details_category?: string;
  details_subCategory?: string;
  details_subCategory2?: string;
  details_offerCategory: string;
  details_tags?: string[];
  details_sections?: string[];
  details_personalisation?: string[];
};

type Variation = {
  type: string;
  option: string;
};

type SellerMetadata = {
  defaultVersion: number;
  name?: string;
  description?: string;
  externalUrl?: string;
  tokenId?: string;
  images?: {
    url: string;
    tag?: string;
  }[];
  contactLinks: {
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
  returnPeriod: string;
};

type ExchangePolicy = {
  uuid: string;
  version: number;
  label?: string;
  template: string;
  sellerContactMethod: string;
  disputeResolverContactMethod: string;
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
    | ProductDetails
    | {
        uuid: string;
        version: number;
      };
  variations?: Variation[];
  seller: SellerMetadata;
  shipping: ShippingMetadata;
  exchangePolicy: ExchangePolicy;
  productOverrides?: ProductBase;
};
