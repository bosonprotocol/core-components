import { subgraph } from "@bosonprotocol/core-sdk";

export enum ExtendedExchangeState {
  NotRedeemableYet = "NOT REDEEMABLE YET",
  Expired = "EXPIRED"
}

export function getExchangeState(exchange: subgraph.ExchangeFieldsFragment) {
  const { offer } = exchange;

  if (Number(offer.voucherRedeemableFromDate) * 1000 > Date.now()) {
    return ExtendedExchangeState.NotRedeemableYet;
  }

  if (Number(exchange.validUntilDate) * 1000 < Date.now()) {
    return ExtendedExchangeState.Expired;
  }

  return exchange.state;
}
