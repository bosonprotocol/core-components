import { subgraph } from "@bosonprotocol/core-sdk";
import type { Offer } from "../../types/offer";

export type BundleMetadata = Extract<
  Offer["metadata"],
  { __typename: "BundleMetadataEntity" }
>;

export type Bundle = Omit<Offer, "metadata"> & {
  metadata: BundleMetadata;
};

export const isBundle = (
  offer: Pick<Offer | subgraph.OfferFieldsFragment, "metadata">
): offer is Bundle =>
  offer.metadata?.__typename === "BundleMetadataEntity" ||
  offer.metadata?.type === subgraph.MetadataType.Bundle;

export type ProductV1Metadata = Extract<
  Offer["metadata"],
  { __typename: "ProductV1MetadataEntity" }
>;

export type ProductV1 = Omit<Offer, "metadata"> & {
  metadata: ProductV1Metadata;
};

export const isProductV1 = (
  offer: Pick<Offer | subgraph.OfferFieldsFragment, "metadata">
): offer is ProductV1 =>
  offer.metadata?.__typename === "ProductV1MetadataEntity" ||
  offer.metadata?.type === subgraph.MetadataType.ProductV1;
