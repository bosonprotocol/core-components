import { buildYup } from "schema-to-yup";
import { SchemaOf } from "yup";
import schema from "./schema.json";
import { RNftMetadata } from "../rNFT";
import { ProductBase, ProductV1Item, ProductV1Variant } from "../productV1Item";
import { Media, buildUuid } from "../common";

export const productV1MetadataSchema: SchemaOf<ProductV1Metadata> = buildYup(
  schema,
  {}
);

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

export type ProductV1Metadata = Omit<RNftMetadata, "type"> &
  Omit<ProductV1Item, "type"> & {
    type: "PRODUCT_V1";
    animationMetadata?: Partial<Pick<Media, "height" | "type" | "width">>;
    seller: SellerMetadata;
  };

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
