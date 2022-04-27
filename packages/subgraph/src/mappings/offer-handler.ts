import {
  IBosonOfferHandler,
  OfferCreated,
  OfferVoided
} from "../../generated/BosonOfferHandler/IBosonOfferHandler";
import { Offer } from "../../generated/schema";

import { saveMetadata } from "../entities/metadata/handler";
import { saveExchangeToken } from "../entities/token";

export function handleOfferCreatedEvent(event: OfferCreated): void {
  const offerId = event.params.offerId;

  let offer = Offer.load(offerId.toString());

  if (offer === null) {
    const contract = IBosonOfferHandler.bind(event.address);
    const result = contract.try_getOffer(offerId);

    if (!result.reverted && result.value.value0) {
      const offerFromContract = result.value.value1;

      saveExchangeToken(offerFromContract.exchangeToken);
      saveMetadata(offerFromContract);

      offer = new Offer(offerId.toString());
      offer.createdAt = event.block.timestamp;
      offer.price = offerFromContract.price;
      offer.sellerDeposit = offerFromContract.sellerDeposit;
      offer.buyerCancelPenalty = offerFromContract.buyerCancelPenalty;
      offer.quantityAvailable = offerFromContract.quantityAvailable;
      offer.validFromDate = offerFromContract.validFromDate;
      offer.validUntilDate = offerFromContract.validUntilDate;
      offer.redeemableFromDate = offerFromContract.redeemableFromDate;
      offer.fulfillmentPeriodDuration =
        offerFromContract.fulfillmentPeriodDuration;
      offer.voucherValidDuration = offerFromContract.voucherValidDuration;
      offer.seller = offerFromContract.sellerId.toString();
      offer.exchangeToken = offerFromContract.exchangeToken.toHexString();
      offer.metadataUri = offerFromContract.metadataUri;
      offer.offerChecksum = offerFromContract.offerChecksum;
      offer.metadata = offerId.toString() + "-metadata";
      offer.voided = false;

      offer.save();
    }
  }
}

export function handleOfferVoidedEvent(event: OfferVoided): void {
  const offerId = event.params.offerId;

  const offer = Offer.load(offerId.toString());

  if (offer !== null) {
    offer.voided = true;
    offer.voidedAt = event.block.timestamp;
    offer.save();
  }
}
