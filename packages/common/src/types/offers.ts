import { BigNumberish } from "@ethersproject/bignumber";

export enum PriceType {
  Static = 0,
  Discovery = 1
}

export type RoyaltyInfo = {
  recipients: string[];
  bps: BigNumberish[];
};

export type CreateOfferArgs = {
  price: BigNumberish;
  sellerDeposit: BigNumberish;
  agentId: BigNumberish;
  buyerCancelPenalty: BigNumberish;
  quantityAvailable: BigNumberish;
  validFromDateInMS: BigNumberish;
  validUntilDateInMS: BigNumberish;
  voucherRedeemableFromDateInMS: BigNumberish;
  voucherRedeemableUntilDateInMS: BigNumberish;
  disputePeriodDurationInMS: BigNumberish;
  voucherValidDurationInMS?: BigNumberish;
  resolutionPeriodDurationInMS: BigNumberish;
  exchangeToken: string;
  disputeResolverId: BigNumberish;
  metadataUri: string;
  metadataHash: string;
  collectionIndex: BigNumberish;
  feeLimit?: BigNumberish;
  priceType?: PriceType;
  royaltyInfo?: RoyaltyInfo[];
};

export type OfferStruct = {
  id: BigNumberish;
  sellerId: BigNumberish;
  price: BigNumberish;
  sellerDeposit: BigNumberish;
  buyerCancelPenalty: BigNumberish;
  quantityAvailable: BigNumberish;
  exchangeToken: string;
  priceType: number;
  metadataUri: string;
  metadataHash: string;
  voided: boolean;
  collectionIndex: BigNumberish;
  royaltyInfo: RoyaltyInfo[];
};

export type OfferDatesStruct = {
  validFrom: BigNumberish;
  validUntil: BigNumberish;
  voucherRedeemableFrom: BigNumberish;
  voucherRedeemableUntil: BigNumberish;
};

export type OfferDurationsStruct = {
  disputePeriod: BigNumberish;
  voucherValid: BigNumberish;
  resolutionPeriod: BigNumberish;
};

export type DisputeResolutionTermsStruct = {
  disputeResolverId: BigNumberish;
  escalationResponsePeriod: BigNumberish;
  feeAmount: BigNumberish;
  buyerEscalationDeposit: BigNumberish;
};

export type PremintParametersStruct = {
  reservedRangeLength: BigNumberish;
  to: string;
};

export enum Side {
  Ask = 0,
  Bid = 1,
  Wrapper = 2
}

export type PriceDiscoveryStruct = {
  price: BigNumberish;
  side: Side;
  priceDiscoveryContract: string;
  conduit: string;
  priceDiscoveryData: string;
};
