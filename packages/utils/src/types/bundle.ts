import { subgraph } from "@bosonprotocol/core-sdk";

export type BundleItem =
  subgraph.BundleMetadataEntityFieldsFragment["items"][number];
