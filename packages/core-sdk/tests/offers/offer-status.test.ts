import { getOfferStatus, OfferState } from "../../src/offers";

describe("offer-status", () => {
  let validOffer;
  let now;
  beforeEach(() => {
    now = Math.floor(Date.now() / 1000);
    validOffer = {
      voidedAt: null,
      validFromDate: (now - 1).toString(),
      validUntilDate: (now + 1).toString()
    };
  });
  test("offer is valid", () => {
    const offerStatus = getOfferStatus(validOffer);
    expect(offerStatus).toBe(OfferState.VALID);
  });
  test("offer is not yet valid", () => {
    validOffer.validFromDate = (now + 1).toString();
    const offerStatus = getOfferStatus(validOffer);
    expect(offerStatus).toBe(OfferState.NOT_YET_VALID);
  });
  test("offer is expired", () => {
    validOffer.validUntilDate = (now - 1).toString();
    const offerStatus = getOfferStatus(validOffer);
    expect(offerStatus).toBe(OfferState.EXPIRED);
  });
  test("offer is voided", () => {
    validOffer.voidedAt = (now - 1).toString();
    const offerStatus = getOfferStatus(validOffer);
    expect(offerStatus).toBe(OfferState.VOIDED);
  });
});
