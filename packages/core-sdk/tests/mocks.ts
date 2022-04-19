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
    deposit: "2",
    penalty: "0",
    quantity: "10",
    validFromDate: "1646997184",
    validUntilDate: "1647083584",
    redeemableDate: "1647083584",
    fulfillmentPeriodDuration: "864000",
    voucherValidDuration: "86400",
    metadataUri:
      "https://ipfs.io/ipfs/QmUttPYRg6mgDAzpjBjMTCvmfsqcgD6UpXj5PRqjvj6nT6",
    metadataHash: "QmUttPYRg6mgDAzpjBjMTCvmfsqcgD6UpXj5PRqjvj6nT6",
    voidedAt: null,
    seller: {
      address: "0x0000000000000000000000000000000000000000",
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
