export { CreateOfferArgs } from "@bosonprotocol/common";

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
    additionalProperties?: string;
  };
};
