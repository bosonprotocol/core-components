import { RawOfferFromSubgraph } from "../src/offers/types";
import { MetadataType, utils } from "@bosonprotocol/common";
import nock from "nock";

export const SUBGRAPH_URL = "https://subgraph.com/subgraphs";

export const DAY_IN_MS = 24 * 60 * 60 * 1000;

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
    createdAt: utils.timestamp.msToSec(Date.now() - DAY_IN_MS).toString(),
    price: "1",
    sellerDeposit: "2",
    buyerCancelPenalty: "0",
    quantityAvailable: "10",
    validFromDate: utils.timestamp.msToSec(Date.now() - DAY_IN_MS).toString(),
    validUntilDate: utils.timestamp.msToSec(Date.now() + DAY_IN_MS).toString(),
    redeemableFromDate: utils.timestamp.msToSec(Date.now()).toString(),
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
