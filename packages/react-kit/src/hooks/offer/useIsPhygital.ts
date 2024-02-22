import { MetadataType } from "@bosonprotocol/core-sdk";
import { Offer } from "../../types/offer";

export const useIsPhygital = ({ offer }: { offer: Offer }) => {
  return offer.metadata?.type === MetadataType.BUNDLE.toString();
};
