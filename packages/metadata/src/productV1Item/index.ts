import { buildYup } from "schema-to-yup";
import { SchemaOf } from "yup";
import schema from "./schema.json";
import { IItemMetadata } from "../iMetadata";
import { Media, buildUuid } from "../common";

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

export type ProductV1Variant = Array<Variation>;

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
  uuid: string; // uuid of the physical product variant (should be unique and different for all variants of the same product)
  product: ProductBase &
    ProductDetails & {
      uuid: string; // uuid of the physical multi-variant product (should be the same for all variants of the same product)
      version: number;
    };
  productOverrides?: Partial<ProductBase>;
  variations?: Variation[];
  shipping: ShippingMetadata;
  exchangePolicy: ExchangePolicy;
};

export function createVariantProductItem(
  productItem: ProductV1Item,
  variants: Array<{
    productVariant: ProductV1Variant;
    productOverrides?: Partial<ProductBase>;
  }>
): Array<ProductV1Item> {
  // Build the metadata without the overrides
  const metadatas = buildVariantProductItem(
    productItem,
    variants.map((variant) => variant.productVariant)
  );
  // Apply the overrides when present
  for (let index = 0; index < metadatas.length; index++) {
    metadatas[index].productOverrides =
      variants[index].productOverrides || undefined;
    // In case the productOverrides is 'null', assign 'undefined'
  }

  return metadatas;
}

function buildVariantProductItem(
  productItem: ProductV1Item,
  variants: Array<ProductV1Variant>
): Array<ProductV1Item> {
  // Check the productItem does not have any variations
  if (productItem.variations) {
    throw new Error(
      "Unable to create variant product Item from an already existing variation"
    );
  }
  if (variants.length < 2) {
    throw new Error(
      "Unable to create a variant product with less than 2 variants"
    );
  }

  // Check the array of variants is consistent (each variant would have the same types of variations and different values)
  const [variant0, ...nextVariants] = variants;
  const types0 = variant0.map((variation) => variation.type);
  const variantsStringMap = new Map<string, string>();
  variantsStringMap.set(serializeVariant(variant0), serializeVariant(variant0));
  for (const variant of nextVariants) {
    const variantStr = serializeVariant(variant);
    if (variantsStringMap.has(variantStr)) {
      throw new Error(`Redundant variant ${variantStr}`);
    }
    variantsStringMap.set(variantStr, variantStr);
    if (variant.length !== types0.length) {
      throw new Error("variants are not consistent to each other");
    }
    types0.forEach((type) => {
      const variation = variant.find((v) => v.type === type);
      if (!variation) {
        throw new Error(
          `missing type ${type} in variant ${serializeVariant(variant)}`
        );
      }
    });
  }

  // Each variant should have an different UUID
  return variants.map((variant) => {
    const uuid = buildUuid();
    return {
      ...productItem,
      uuid,
      variations: variant
    };
  });
}

function serializeVariant(variant: ProductV1Variant): string {
  // Be sure each variation structure has its keys ordered
  const orderedStruct = variant.map((variation) =>
    Object.keys(variation)
      .sort()
      .reduce((obj, key) => {
        obj[key] = variation[key];
        return obj;
      }, {})
  ) as ProductV1Variant;
  // Be sure each variation in the table is ordered per type
  const orderedTable = orderedStruct.sort((a, b) =>
    a.type.localeCompare(b.type)
  );
  return JSON.stringify(orderedTable);
}
