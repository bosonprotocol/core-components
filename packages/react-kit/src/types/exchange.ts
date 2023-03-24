import { subgraph } from "@bosonprotocol/core-sdk";
import { Offer } from "./offer";

export type Exchange = subgraph.ExchangeFieldsFragment & {
  offer: Offer;
};
