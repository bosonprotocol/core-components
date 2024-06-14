import { subgraph } from "@bosonprotocol/core-sdk";
import type { Offer } from "../../types/offer";
import { NftItem, isNftItem } from "../bundle/filter";
import { BUYER_TRANSFER_INFO_KEY, BuyerTransferInfo } from "../bundle/const";
import { isTruthy } from "../../types/helpers";

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
  offer.metadata?.type === subgraph.MetadataType.BUNDLE;

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
  offer.metadata?.type === subgraph.MetadataType.PRODUCT_V1;

const getBuyerTransferInfoTerm = (item: NftItem) =>
  item.terms?.find((term) => term.key === BUYER_TRANSFER_INFO_KEY);
export const getBuyerTransferInfos = (
  offer: Offer | subgraph.OfferFieldsFragment
): Set<string> => {
  return isBundle(offer)
    ? new Set(
        offer.metadata.items
          .filter(isNftItem)
          .map((item) => getBuyerTransferInfoTerm(item)?.value)
          .filter(isTruthy)
      )
    : new Set();
};

export const getHasBuyerTransferInfos = (
  offer: Offer | subgraph.OfferFieldsFragment,
  valuesToFind: BuyerTransferInfo[]
): boolean => {
  const buyerTransferInfos = getBuyerTransferInfos(offer);
  return valuesToFind.every((buyerTransferInfoValue) => {
    return buyerTransferInfos.has(buyerTransferInfoValue);
  });
};
