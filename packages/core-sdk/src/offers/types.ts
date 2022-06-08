export { CreateOfferArgs } from "@bosonprotocol/common";

export type RawOfferFromSubgraph = {
  id: string;
  createdAt: string;
  price: string;
  sellerDeposit: string;
  buyerCancelPenalty: string;
  quantityAvailable: string;
  validFromDate: string;
  validUntilDate: string;
  redeemableFromDate: string;
  fulfillmentPeriodDuration: string;
  voucherValidDuration: string;
  metadataUri: string;
  offerChecksum: string;
  voidedAt: null | string;
  seller: {
    id: string;
    operator: string;
    admin: string;
    clerk: string;
    treasury: string;
    active: boolean;
  };
  exchangeToken: {
    address: string;
    decimals: string;
    name: string;
    symbol: string;
  };
  metadata: null | {
    name: string;
    description: string;
    externalUrl: string;
    schemaUrl: string;
    type: string;
  };
  exchanges: {
    id: string;
    committedDate: string;
    disputed: boolean;
    expired: boolean;
    finalizedDate: string;
    redeemedDate: string;
  }[];
};
