import { BigNumberish } from "@ethersproject/bignumber";

export type CreateOfferArgs = {
  id?: BigNumberish;
  price: BigNumberish;
  deposit: BigNumberish;
  penalty: BigNumberish;
  quantity: BigNumberish;
  validFromDateInMS: BigNumberish;
  validUntilDateInMS: BigNumberish;
  redeemableDateInMS: BigNumberish;
  fulfillmentPeriodDurationInMS: BigNumberish;
  voucherValidDurationInMS: BigNumberish;
  seller: string;
  exchangeToken: string;
  metadataUri: string;
  metadataHash: string;
};

export type OfferStruct = {
  id: BigNumberish;
  price: BigNumberish;
  deposit: BigNumberish;
  penalty: BigNumberish;
  quantity: BigNumberish;
  validFromDate: BigNumberish;
  validUntilDate: BigNumberish;
  redeemableDate: BigNumberish;
  fulfillmentPeriodDuration: BigNumberish;
  voucherValidDuration: BigNumberish;
  seller: string;
  exchangeToken: string;
  metadataUri: string;
  metadataHash: string;
  voided: boolean;
};
