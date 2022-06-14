import { BigInt } from "@graphprotocol/graph-ts";
import { BuyerCommitted } from "../../generated/BosonExchangeHandler/IBosonExchangeHandler";
import { Exchange, Offer } from "../../generated/schema";

export function handleBuyerCommittedEvent(event: BuyerCommitted): void {
  const exchangeFromEvent = event.params.exchange;
  const exchangeId = exchangeFromEvent.id.toString();

  let exchange = Exchange.load(exchangeId);

  if (!exchange) {
    exchange = new Exchange(exchangeId);
  }

  const offer = Offer.load(exchangeFromEvent.offerId.toString());

  if (offer) {
    offer.quantityAvailable = offer.quantityAvailable.minus(BigInt.fromI32(1));
    offer.save();

    exchange.seller = offer.seller;
  }

  exchange.buyer = exchangeFromEvent.buyerId.toString();
  exchange.offer = exchangeFromEvent.offerId.toString();
  exchange.disputed = false;
  exchange.state = "COMMITTED";
  exchange.committedDate = event.block.timestamp;
  exchange.expired = false;

  exchange.save();
}
