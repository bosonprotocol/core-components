import { Offer } from "../../types/offer";
import { isBundle } from "../../lib/offer/filter";

export const useIsPhygital = ({ offer }: { offer: Offer }) => {
  return isBundle(offer);
};
