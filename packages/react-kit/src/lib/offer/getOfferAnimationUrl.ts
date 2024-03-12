import { subgraph } from "@bosonprotocol/core-sdk";
import { Offer } from "../../types/offer";

export const getOfferAnimationUrl = (
  offer: Offer | subgraph.OfferFieldsFragment | undefined | null
): string => {
  return offer?.metadata?.animationUrl === "about:blank"
    ? ""
    : offer?.metadata?.animationUrl || "";
};
