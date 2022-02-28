import { OfferCreated } from "../generated/IBosonOfferHandler/IBosonOfferHandler";
import { Offer } from "../generated/schema";

export function handleOfferCreatedEvent(event: OfferCreated): void {
  const offerId = event.params.offerId;

  let offer = Offer.load(offerId.toString());

  if (offer === null) {
    offer = new Offer(offerId.toString());
  }

  offer.save();
}
