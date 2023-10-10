import { subgraph } from "@bosonprotocol/core-sdk";

import { Offer } from "./offer";

export type VariantV1 = {
  offer: Offer;
  variations: (Omit<subgraph.ProductV1Variation, "metadata" | "type"> & {
    metadata?: subgraph.ProductV1MetadataEntity;
    type: "Color" | "Size";
  })[];
};

export type Variation = VariantV1["variations"][number];
