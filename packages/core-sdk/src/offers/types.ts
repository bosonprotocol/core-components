export { CreateOfferArgs } from "@bosonprotocol/common";

export type RawOfferFromSubgraph = {
  id: string;
  createdAt: string;
  price: string;
  sellerDeposit: string;
  protocolFee: string;
  buyerCancelPenalty: string;
  quantityAvailable: string;
  quantityInitial: string;
  validFromDate: string;
  validUntilDate: string;
  voucherRedeemableFromDate: string;
  voucherRedeemableUntilDate: string;
  fulfillmentPeriodDuration: string;
  voucherValidDuration: string;
  resolutionPeriodDuration: string;
  metadataUri: string;
  offerChecksum: string;
  voidedAt: null | string;
  disputeResolverId: string;
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
