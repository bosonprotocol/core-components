import { OfferFieldsFragment } from "../subgraph";

export enum OfferState {
  VOIDED = "VOIDED",
  NOT_YET_VALID = "NOT YET VALID",
  EXPIRED = "EXPIRED",
  VALID = "VALID"
}

export function getOfferStatus(offer: OfferFieldsFragment) {
  const toTimeStamp = (numberString: string) => Number(numberString) * 1000;
  const timeNow = Date.now();

  if (offer.voidedAt) {
    return OfferState.VOIDED;
  }

  if (toTimeStamp(offer.validFromDate) > timeNow) {
    return OfferState.NOT_YET_VALID;
  }

  if (toTimeStamp(offer.validUntilDate) < timeNow) {
    return OfferState.EXPIRED;
  }

  return OfferState.VALID;
}
