import { BigInt } from "@graphprotocol/graph-ts";
import {
  BuyerCommitted,
  VoucherCanceled,
  VoucherRevoked,
  VoucherRedeemed,
  ExchangeCompleted
} from "../../generated/BosonExchangeHandler/IBosonExchangeHandler";
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
    exchange.validUntilDate = exchangeFromEvent.voucher.validUntilDate;
  }

  exchange.buyer = exchangeFromEvent.buyerId.toString();
  exchange.offer = exchangeFromEvent.offerId.toString();
  exchange.disputed = false;
  exchange.state = "COMMITTED";
  exchange.committedDate = event.block.timestamp;
  exchange.expired = false;

  exchange.save();
}

export function handleVoucherRevokedEvent(event: VoucherRevoked): void {
  const exchangeId = event.params.exchangeId;

  const exchange = Exchange.load(exchangeId.toString());

  if (exchange) {
    exchange.state = "REVOKED";
    exchange.revokedDate = event.block.timestamp;
    exchange.save();
  }
}

export function handleVoucherCanceledEvent(event: VoucherCanceled): void {
  const exchangeId = event.params.exchangeId;

  const exchange = Exchange.load(exchangeId.toString());

  if (exchange) {
    exchange.state = "CANCELLED";
    exchange.cancelledDate = event.block.timestamp;
    exchange.save();
  }
}

export function handleVoucherRedeemedEvent(event: VoucherRedeemed): void {
  const exchangeId = event.params.exchangeId;

  const exchange = Exchange.load(exchangeId.toString());

  if (exchange) {
    exchange.state = "REDEEMED";
    exchange.redeemedDate = event.block.timestamp;
    exchange.save();
  }
}

export function handleExchangeCompletedEvent(event: ExchangeCompleted): void {
  const exchangeId = event.params.exchangeId;

  const exchange = Exchange.load(exchangeId.toString());

  if (exchange) {
    exchange.state = "COMPLETED";
    exchange.completedDate = event.block.timestamp;
    exchange.save();
  }
}
