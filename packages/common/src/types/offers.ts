import { BigNumberish } from "@ethersproject/bignumber";

export type CreateOfferArgs = {
  price: BigNumberish;
  sellerDeposit: BigNumberish;
  buyerCancelPenalty: BigNumberish;
  quantityAvailable: BigNumberish;
  validFromDateInMS: BigNumberish;
  validUntilDateInMS: BigNumberish;
  redeemableFromDateInMS: BigNumberish;
  fulfillmentPeriodDurationInMS: BigNumberish;
  voucherValidDurationInMS: BigNumberish;
  exchangeToken: string;
  metadataUri: string;
  offerChecksum: string;
};

export type OfferStruct = {
  id: BigNumberish;
  sellerId: BigNumberish;
  price: BigNumberish;
  sellerDeposit: BigNumberish;
  buyerCancelPenalty: BigNumberish;
  quantityAvailable: BigNumberish;
  validFromDate: BigNumberish;
  validUntilDate: BigNumberish;
  redeemableFromDate: BigNumberish;
  fulfillmentPeriodDuration: BigNumberish;
  voucherValidDuration: BigNumberish;
  exchangeToken: string;
  metadataUri: string;
  offerChecksum: string;
  voided: boolean;
};
