import { parseEther } from "@ethersproject/units";
import { AddressZero } from "@ethersproject/constants";
import {
  IPFS_HASH,
  IPFS_URI,
  ADDRESS
} from "@bosonprotocol/common/tests/mocks";
import { CreateOfferArgs, RawOfferFromSubgraph } from "../src/offers/types";
import nock from "nock";

export const SUBGRAPH_URL = "https://subgraph.com/subgraphs";

export function interceptSubgraph() {
  return nock(SUBGRAPH_URL).post("", (body) => {
    return body.query && body.variables;
  });
}

export function mockCreateOfferArgs(
  overrides?: Partial<CreateOfferArgs>
): CreateOfferArgs {
  return {
    price: parseEther("1"),
    deposit: parseEther("1"),
    penalty: parseEther("1"),
    quantity: 10,
    validFromDateInMS: Date.now(),
    validUntilDateInMS: Date.now() + 2 * 60 * 1000,
    redeemableDateInMS: Date.now() + 1 * 60 * 1000,
    fulfillmentPeriodDurationInMS: 60 * 60 * 1000,
    voucherValidDurationInMS: 60 * 60 * 1000,
    seller: ADDRESS,
    exchangeToken: AddressZero,
    metadataUri: IPFS_URI,
    metadataHash: IPFS_HASH,
    ...overrides
  };
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
      title: "Title",
      description: "Description",
      ...metadata
    },
    ...restOverrides
  };
}
