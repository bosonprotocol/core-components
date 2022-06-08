import { offers } from "@bosonprotocol/core-sdk";

export enum OfferState {
  VOIDED = "VOIDED",
  NOT_YET_VALID = "NOT YET VALID",
  EXPIRED = "EXPIRED",
  VALID = "VALID",
  COMMITTED = "COMMITTED",
  REDEEMED = "REDEEMED",
  FINALIZED = "FINALIZED",
  DISPUTED = "DISPUTED",
  INVALID = "INVALID"
}

export function getOfferStatus(
  offer: offers.RawOfferFromSubgraph,
  exchangeId: string | null
) {
  const toTimeStamp = (numberString: string) => Number(numberString) * 1000;
  const timeNow = Date.now();

  if (offer.voidedAt) return OfferState.VOIDED;
  if (toTimeStamp(offer.validFromDate) > timeNow)
    return OfferState.NOT_YET_VALID;
  if (toTimeStamp(offer.validUntilDate) < timeNow) return OfferState.EXPIRED;
  if (exchangeId) {
    const exchange = offer.exchanges.find(
      (exchange) => exchange.id === exchangeId
    );
    if (exchange) {
      const isFinalized = exchange.finalizedDate;
      if (isFinalized) {
        return OfferState.FINALIZED;
      }

      const isExpired = exchange.expired;
      if (isExpired) {
        return OfferState.EXPIRED;
      }

      const isDisputed = exchange.disputed;
      if (isDisputed) {
        return OfferState.DISPUTED;
      }

      const isRedeemed = exchange.redeemedDate;
      if (isRedeemed) {
        return OfferState.REDEEMED;
      }

      const isCommitted = exchange.committedDate;
      if (isCommitted) {
        return OfferState.COMMITTED;
      }
    }

    return OfferState.INVALID;
  }

  return OfferState.VALID;
}
