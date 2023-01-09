import { subgraph } from "..";
import { ExchangeState } from "../subgraph";

export enum ExtendedExchangeState {
  NotRedeemableYet = "NOT REDEEMABLE YET",
  Expired = "EXPIRED"
}

export type AllExchangeStates = ExtendedExchangeState | ExchangeState;

export function getExchangeState(
  exchange: subgraph.ExchangeFieldsFragment
): AllExchangeStates {
  const { offer } = exchange;

  if (Number(offer.voucherRedeemableFromDate) * 1000 > Date.now()) {
    return ExtendedExchangeState.NotRedeemableYet;
  }

  if (
    exchange.state === ExchangeState.Committed &&
    Number(exchange.validUntilDate) * 1000 < Date.now()
  ) {
    return ExtendedExchangeState.Expired;
  }

  return exchange.state;
}
