import { buildYup } from "schema-to-yup";
import { SchemaOf } from "yup";
import schema from "./schema.json";

export const productV1MetadataSchema: SchemaOf<ProductV1Metadata> = buildYup(
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

type Variation = {
  type: string;
  option: string;
};

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
  licenseUrl: string;
  condition?: string;
  image: string;
  animationUrl?: string;
  animationMetadata?: Partial<Pick<Media, "height" | "type" | "width">>;
  attributes: {
    trait_type: string;
    value: string;
    display_type?: string;
  }[];
  product: ProductBase &
    ProductDetails & {
      uuid: string;
      version: number;
    };
  variations?: Variation[];
  seller: SellerMetadata;
  shipping: ShippingMetadata;
  exchangePolicy: ExchangePolicy;
  productOverrides?: Partial<ProductBase>;
};

export type ProductV1Variant = Array<Variation>;

export function createVariantProductMetadata(
  productMetadata: ProductV1Metadata,
  variants: Array<{
    productVariant: ProductV1Variant;
    productOverrides?: Partial<ProductBase>;
  }>
): Array<ProductV1Metadata> {
  // Build the metadata without the overrides
  const metadatas = buildVariantProductMetadata(
    productMetadata,
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

function buildVariantProductMetadata(
  productMetadata: ProductV1Metadata,
  variants: Array<ProductV1Variant>
): Array<ProductV1Metadata> {
  // Check the productMetadata does not have any variations
  if (productMetadata.variations) {
    throw new Error(
      "Unable to create variant product Metadata from an already existing variation"
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
    const variantAttributes = variant.map((variation) => {
      return {
        trait_type: variation.type,
        value: variation.option
      };
    });
    const uuid = buildUuid();
    // externalUrl and licenseUrl needs to be patched with the new UUID
    const [externalUrl, licenseUrl] = replaceUUID(
      productMetadata.uuid,
      uuid,
      productMetadata,
      ["externalUrl", "licenseUrl"]
    );
    return {
      ...productMetadata,
      uuid,
      externalUrl,
      licenseUrl,
      variations: variant,
      attributes: [...productMetadata.attributes, ...variantAttributes]
    };
  });
}

export function buildUuid(): string {
  if (typeof window !== "undefined" && window?.crypto) {
    return window.crypto.randomUUID();
  } else {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const crypto = require("crypto");
    return crypto.randomUUID();
  }
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

function replaceUUID(
  oldUUID: string,
  newUUID: string,
  metadata: Record<string, unknown>,
  fields: string[]
): string[] {
  const ret = [];
  for (const field of fields) {
    // Note: in case metadata[field] does not exist or can not be converted into a string, the value is returned as is
    ret.push(
      String(metadata[field])
        ? String(metadata[field]).replaceAll(oldUUID, newUUID)
        : metadata[field]
    );
  }
  return ret;
}
