import { BigNumberish } from "@ethersproject/bignumber";

export type CreateOfferArgs = {
  price: BigNumberish;
  sellerDeposit: BigNumberish;
  protocolFee: BigNumberish;
  buyerCancelPenalty: BigNumberish;
  quantityAvailable: BigNumberish;
  validFromDateInMS: BigNumberish;
  validUntilDateInMS: BigNumberish;
  voucherRedeemableFromDateInMS: BigNumberish;
  voucherRedeemableUntilDateInMS: BigNumberish;
  fulfillmentPeriodDurationInMS: BigNumberish;
  voucherValidDurationInMS?: BigNumberish;
  resolutionPeriodDurationInMS: BigNumberish;
  exchangeToken: string;
  disputeResolverId: BigNumberish;
  metadataUri: string;
  metadataHash: string;
};

export type OfferStruct = {
  id: BigNumberish;
  sellerId: BigNumberish;
  disputeResolverId: BigNumberish;
  price: BigNumberish;
  sellerDeposit: BigNumberish;
  protocolFee: BigNumberish;
  buyerCancelPenalty: BigNumberish;
  quantityAvailable: BigNumberish;
  exchangeToken: string;
  metadataUri: string;
  metadataHash: string;
  voided: boolean;
};

export type OfferDatesStruct = {
  validFrom: BigNumberish;
  validUntil: BigNumberish;
  voucherRedeemableFrom: BigNumberish;
  voucherRedeemableUntil: BigNumberish;
};

export type OfferDurationsStruct = {
  fulfillmentPeriod: BigNumberish;
  voucherValid: BigNumberish;
  resolutionPeriod: BigNumberish;
};
