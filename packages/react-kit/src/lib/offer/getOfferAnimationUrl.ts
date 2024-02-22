import { Offer } from "../../types/offer";

export const getOfferAnimationUrl = (
  offer: Offer | undefined | null
): string => {
  return offer?.metadata?.animationUrl === "about:blank"
    ? ""
    : offer?.metadata?.animationUrl || "";
};
