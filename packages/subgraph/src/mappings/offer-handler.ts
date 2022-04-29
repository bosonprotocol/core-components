import {
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
    const offerStruct = event.params.offer;

    offer = new Offer(offerId.toString());
    offer.createdAt = event.block.timestamp;
    offer.price = offerStruct.price;
    offer.sellerDeposit = offerStruct.sellerDeposit;
    offer.buyerCancelPenalty = offerStruct.buyerCancelPenalty;
    offer.quantityInitial = offerStruct.quantityAvailable;
    offer.quantityAvailable = offerStruct.quantityAvailable;
    offer.validFromDate = offerStruct.validFromDate;
    offer.validUntilDate = offerStruct.validUntilDate;
    offer.redeemableFromDate = offerStruct.redeemableFromDate;
    offer.fulfillmentPeriodDuration = offerStruct.fulfillmentPeriodDuration;
    offer.voucherValidDuration = offerStruct.voucherValidDuration;
    offer.seller = offerStruct.sellerId.toString();
    offer.exchangeToken = offerStruct.exchangeToken.toHexString();
    offer.metadataUri = offerStruct.metadataUri;
    offer.offerChecksum = offerStruct.offerChecksum;
    offer.metadata = offerId.toString() + "-metadata";
    offer.voided = false;

    offer.save();

    saveExchangeToken(offerStruct.exchangeToken);
    saveMetadata(offer, event.block.timestamp);
  }
}

export function handleOfferVoidedEvent(event: OfferVoided): void {
  const offerId = event.params.offerId;

  const offer = Offer.load(offerId.toString());

  if (offer !== null) {
    offer.voided = true;
    offer.voidedAt = event.block.timestamp;

    offer.save();

    saveMetadata(offer, offer.createdAt);
  }
}
