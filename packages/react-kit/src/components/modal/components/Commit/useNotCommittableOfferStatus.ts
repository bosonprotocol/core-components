import { useMemo } from "react";
import { useDetailViewContext } from "./DetailView/common/DetailViewProvider";

export const useNotCommittableOfferStatus = ({
  isOfferVoided
}: {
  isOfferVoided: boolean;
}) => {
  const {
    quantity,
    isBuyerInsufficientFunds,
    isOfferNotValidYet,
    isExpiredOffer,
    hasSellerEnoughFunds
  } = useDetailViewContext();
  const isOfferEmpty = quantity < 1;
  const notCommittableOfferStatus = useMemo(() => {
    if (isBuyerInsufficientFunds) {
      return "Insufficient Funds";
    }
    if (isOfferVoided) {
      return "Offer voided";
    }
    if (isExpiredOffer) {
      return "Expired";
    }
    if (isOfferNotValidYet) {
      return "Sale starting soon™️";
    }
    if (isOfferEmpty) {
      return "Sold out";
    }
    if (!hasSellerEnoughFunds) {
      return "Invalid";
    }
    return "";
  }, [
    hasSellerEnoughFunds,
    isBuyerInsufficientFunds,
    isExpiredOffer,
    isOfferEmpty,
    isOfferNotValidYet,
    isOfferVoided
  ]);
  return notCommittableOfferStatus;
};
