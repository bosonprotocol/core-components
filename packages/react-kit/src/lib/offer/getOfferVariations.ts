import { Offer } from "../../types/offer";
import { isTruthy } from "../../types/helpers";

export const getOfferVariations = (offer: Offer | undefined) => {
  if (!offer?.metadata || offer.metadata.__typename === "BaseMetadataEntity") {
    return;
  }
  if (offer.metadata.__typename === "ProductV1MetadataEntity") {
    return offer.metadata.variations;
  }
  if (offer.metadata.__typename === "BundleMetadataEntity") {
    const variations = (offer.metadata.items ?? [])
      .filter((item) => item.__typename === "ProductV1ItemMetadataEntity")
      .map((item) => ("variations" in item ? item.variations : undefined))
      .filter(isTruthy);
    return variations.length ? variations : undefined;
  }
  return;
};
