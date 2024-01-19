import { buildYup } from "schema-to-yup";
import { SchemaOf } from "yup";
import schema from "./schema.json";
import { RNftMetadata } from "../rNFT";
import {
  ProductBase,
  ProductV1Item,
  ProductV1Variant,
  createVariantProductItem
} from "../productV1Item";
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
  // Build the product items for each variant
  const productItems = createVariantProductItem(
    {
      ...productMetadata,
      type: "ITEM_PRODUCT_V1"
    },
    variants
  );

  // add the seller and other fields missing from product items
  const metadatas: ProductV1Metadata[] = productItems.map((productItem) => {
    return {
      ...productMetadata,
      ...productItem,
      type: "PRODUCT_V1"
    };
  });

  return metadatas.map((metadata) => {
    // add some attributes depending on variation
    const variantAttributes = metadata.variations?.map((variation) => {
      return {
        trait_type: variation.type,
        value: variation.option
      };
    });
    // externalUrl and licenseUrl needs to be patched with the new UUID
    const [externalUrl, licenseUrl] = replaceUUID(
      productMetadata.uuid,
      metadata.uuid,
      productMetadata,
      ["externalUrl", "licenseUrl"]
    );
    return {
      ...metadata,
      externalUrl,
      licenseUrl,
      attributes: [...metadata.attributes, ...variantAttributes]
    };
  });
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
