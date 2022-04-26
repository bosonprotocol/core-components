import { RawOfferFromSubgraph } from "../src/offers/types";
import { MetadataType } from "@bosonprotocol/common";
import nock from "nock";

export const SUBGRAPH_URL = "https://subgraph.com/subgraphs";

export function interceptSubgraph() {
  return nock(SUBGRAPH_URL).post("", (body) => {
    return body.query && body.variables;
  });
}

export function mockRawOfferFromSubgraph(
  overrides: Partial<RawOfferFromSubgraph> = {}
): RawOfferFromSubgraph {
  const {
    seller = {},
    exchangeToken = {},
    metadata = {},
    ...restOverrides
  } = overrides;

  return {
    id: "1",
    createdAt: "1646910946",
    price: "1",
    sellerDeposit: "2",
    buyerCancelPenalty: "0",
    quantityAvailable: "10",
    validFromDate: "1646997184",
    validUntilDate: "1647083584",
    redeemableFromDate: "1647083584",
    fulfillmentPeriodDuration: "864000",
    voucherValidDuration: "86400",
    metadataUri: "ipfs:///QmUttPYRg6mgDAzpjBjMTCvmfsqcgD6UpXj5PRqjvj6nT6",
    offerChecksum: "QmUttPYRg6mgDAzpjBjMTCvmfsqcgD6UpXj5PRqjvj6nT6",
    voidedAt: null,
    seller: {
      id: "1",
      operator: "0x0000000000000000000000000000000000000000",
      admin: "0x0000000000000000000000000000000000000000",
      clerk: "0x0000000000000000000000000000000000000000",
      treasury: "0x0000000000000000000000000000000000000000",
      active: true,
      ...seller
    },
    exchangeToken: {
      address: "0x0000000000000000000000000000000000000000",
      decimals: "18",
      name: "Ether",
      symbol: "ETH",
      ...exchangeToken
    },
    metadata: {
      name: "Name",
      description: "Description",
      externalUrl: "externalUrl",
      schemaUrl: "schemaUrl",
      type: MetadataType.BASE,
      ...metadata
    },
    ...restOverrides
  };
}
