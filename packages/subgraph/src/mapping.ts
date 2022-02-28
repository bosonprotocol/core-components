import {
  IBosonOfferHandler,
  OfferCreated
} from "../generated/IBosonOfferHandler/IBosonOfferHandler";
import { Offer } from "../generated/schema";

import { saveIpfsMetadata } from "./utils/metadata";
import { saveExchangeToken } from "./utils/token";
import { saveSeller } from "./utils/seller";

export function handleOfferCreatedEvent(event: OfferCreated): void {
  const offerId = event.params.offerId;

  let offer = Offer.load(offerId.toString());

  if (offer === null) {
    const contract = IBosonOfferHandler.bind(event.address);
    const result = contract.try_getOffer(offerId);

    if (!result.reverted && result.value.value0) {
      const offerFromContract = result.value.value1;

      saveIpfsMetadata(offerFromContract.metadataHash, offerId.toString());
      saveExchangeToken(offerFromContract.exchangeToken);
      saveSeller(offerFromContract.seller);

      offer = new Offer(offerId.toString());
      offer.price = offerFromContract.price;
      offer.deposit = offerFromContract.deposit;
      offer.penalty = offerFromContract.penalty;
      offer.quantity = offerFromContract.quantity;
      offer.validFromDate = offerFromContract.validFromDate;
      offer.validUntilDate = offerFromContract.validUntilDate;
      offer.redeemableDate = offerFromContract.redeemableDate;
      offer.fulfillmentPeriodDuration =
        offerFromContract.fulfillmentPeriodDuration;
      offer.voucherValidDuration = offerFromContract.voucherValidDuration;
      offer.seller = offerFromContract.seller.toHexString();
      offer.exchangeToken = offerFromContract.exchangeToken.toHexString();
      offer.metadataUri = offerFromContract.metadataUri;
      offer.metadataHash = offerFromContract.metadataHash;
      offer.metadata = offerId.toString() + "-metadata";
      offer.voided = false;

      offer.save();
    }
  }
}
