import { Offer } from "../../types/offer";
import { isBundle } from "@bosonprotocol/utils";

export const useIsPhygital = ({ offer }: { offer: Offer }) => {
  return isBundle(offer);
};
