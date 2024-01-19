import { buildYup } from "schema-to-yup";
import { SchemaOf } from "yup";
import schema from "./schema.json";
import { IItemMetadata } from "../iMetadata";
import { Media } from "../common";

export const productV1ItemSchema: SchemaOf<ProductV1Item> = buildYup(
  schema,
  {}
);

export type ProductBase = {
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
  visuals_images: Media[];
  visuals_videos?: Media[];
  packaging_packageQuantity?: string;
  packaging_dimensions_length?: string;
  packaging_dimensions_width?: string;
  packaging_dimensions_height?: string;
  packaging_dimensions_unit?: string;
  packaging_weight_value?: string;
  packaging_weight_unit?: string;
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

export type Variation = {
  type: string;
  option: string;
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

export type ProductV1Item = Omit<IItemMetadata, "type"> & {
  type: "ITEM_PRODUCT_V1";
  product: ProductBase &
    ProductDetails & {
      uuid: string;
      version: number;
    };
  productOverrides?: Partial<ProductBase>;
  variations?: Variation[];
  shipping: ShippingMetadata;
  exchangePolicy: ExchangePolicy;
};
