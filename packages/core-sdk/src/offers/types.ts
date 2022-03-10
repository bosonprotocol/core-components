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

export type RawOfferFromSubgraph = {
  id: string;
  createdAt: string;
  price: string;
  deposit: string;
  penalty: string;
  quantity: string;
  validFromDate: string;
  validUntilDate: string;
  redeemableDate: string;
  fulfillmentPeriodDuration: string;
  voucherValidDuration: string;
  metadataUri: string;
  metadataHash: string;
  voidedAt: null | string;
  seller: {
    address: string;
  };
  exchangeToken: {
    address: string;
    decimals: string;
    name: string;
    symbol: string;
  };
  metadata: null | {
    title: string;
    description: string;
  };
};
