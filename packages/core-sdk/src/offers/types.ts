import { BigNumberish } from "@ethersproject/bignumber";

export type CreateOfferArgs = {
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
