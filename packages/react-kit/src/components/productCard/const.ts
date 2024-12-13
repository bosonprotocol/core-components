import { subgraph } from "@bosonprotocol/core-sdk";

export enum ProductType {
  phygital = "Phygital",
  physical = "Physical",
  digital = "Digital"
}

export const LabelType = {
  purchased: "purchased",
  shipped: "shipped",
  cancelled: "cancelled",
  disputed: "disputed",
  completed: "completed",
  revoked: "revoked"
} as const;

export const exchangeStateToLabelType = {
  [subgraph.ExchangeState.COMMITTED]: "purchased",
  [subgraph.ExchangeState.REDEEMED]: "shipped",
  [subgraph.ExchangeState.CANCELLED]: "cancelled",
  [subgraph.ExchangeState.DISPUTED]: "disputed",
  [subgraph.ExchangeState.COMPLETED]: "completed",
  [subgraph.ExchangeState.REVOKED]: "revoked"
} as const satisfies Record<
  subgraph.ExchangeState,
  (typeof LabelType)[keyof typeof LabelType]
>;

export const labelValueToText = {
  [LabelType.purchased]: "Purchased",
  [LabelType.shipped]: "Shipped",
  [LabelType.cancelled]: "Cancelled",
  [LabelType.disputed]: "Disputed",
  [LabelType.completed]: "Completed",
  [LabelType.revoked]: "Revoked"
} as const satisfies Record<(typeof LabelType)[keyof typeof LabelType], string>;
