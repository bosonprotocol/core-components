import { ProductV1Variant } from "../../../../generated/schema";

export function getVariantId(offerId: string): string {
  return `variant-${offerId}`;
}

export function saveProductV1Variant(
  offerId: string,
  variations: string[] | null,
  bundleId: string | null
): string {
  const variantId = getVariantId(offerId);
  let variant = ProductV1Variant.load(variantId);
  if (!variant) {
    variant = new ProductV1Variant(variantId);
  }
  variant.offer = offerId;
  variant.variations = variations;
  variant.bundle = bundleId;
  variant.save();
  return variantId;
}
