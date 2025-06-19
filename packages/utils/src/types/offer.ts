import { subgraph } from "@bosonprotocol/core-sdk";

export type Offer = subgraph.OfferFieldsFragment & {
  metadata?: subgraph.OfferFieldsFragment["metadata"] & {
    imageUrl?: string;
  };
  additional?: {
    product: subgraph.ProductV1Product;
    variants: subgraph.OfferFieldsFragment[];
  };
};
