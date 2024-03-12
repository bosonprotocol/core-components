import { subgraph } from "@bosonprotocol/core-sdk";
import type { BundleItem } from "../../types/bundle";

export type ProductV1Item = Extract<
  BundleItem,
  { __typename?: "ProductV1ItemMetadataEntity" }
>;

export const isProductV1Item = (
  item: Pick<BundleItem, "type" | "__typename">
): item is ProductV1Item =>
  item.__typename === "ProductV1ItemMetadataEntity" ||
  item.type === subgraph.ItemMetadataType.ItemProductV1;

export type NftItem = Extract<
  BundleItem,
  { __typename?: "NftItemMetadataEntity" }
>;

export const isNftItem = (
  item: Pick<BundleItem, "type" | "__typename">
): item is NftItem =>
  item.__typename === "NftItemMetadataEntity" ||
  item.type === subgraph.ItemMetadataType.ItemNft;
