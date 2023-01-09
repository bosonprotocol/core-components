import { utils } from "@bosonprotocol/common";
import {
  SellerFieldsFragment,
  OfferFieldsFragment,
  ExchangeFieldsFragment,
  MetadataType,
  ExchangeState
} from "../src/subgraph";
import nock from "nock";
import { subgraph } from "../src";

export const SUBGRAPH_URL = "https://subgraph.com/subgraphs";
export const DAY_IN_MIN = 24 * 60;
export const DAY_IN_SEC = DAY_IN_MIN * 60;
export const DAY_IN_MS = DAY_IN_SEC * 1000;
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export function interceptSubgraph(operationName?: string) {
  return nock(SUBGRAPH_URL).post("", (body) => {
    return (
      body.query &&
      body.variables &&
      (!operationName || operationName === body.operationName)
    );
  });
}

export function mockRawSellerFromSubgraph(
  overrides: Partial<SellerFieldsFragment> = {}
): SellerFieldsFragment {
  return {
    id: "1",
    admin: ZERO_ADDRESS,
    clerk: ZERO_ADDRESS,
    operator: ZERO_ADDRESS,
    treasury: ZERO_ADDRESS,
    authTokenId: "0",
    authTokenType: 0,
    voucherCloneAddress: ZERO_ADDRESS,
    active: true,
    royaltyPercentage: "0",
    contractURI: "ipfs://seller-contract-uri",
    funds: [],
    offers: [],
    exchanges: [],
    ...overrides
  };
}

export function mockRawOfferFromSubgraph(
  overrides: Partial<OfferFieldsFragment> = {}
): OfferFieldsFragment {
  const {
    seller = {},
    exchangeToken = {},
    metadata = {},
    disputeResolutionTerms = {},
    disputeResolver = {},
    ...restOverrides
  } = overrides;

  return {
    id: "1",
    disputeResolverId: "1",
    createdAt: utils.timestamp.msToSec(Date.now() - DAY_IN_MS).toString(),
    price: "1",
    sellerDeposit: "2",
    buyerCancelPenalty: "0",
    quantityInitial: "10",
    quantityAvailable: "10",
    validFromDate: utils.timestamp.msToSec(Date.now() - DAY_IN_MS).toString(),
    validUntilDate: utils.timestamp.msToSec(Date.now() + DAY_IN_MS).toString(),
    voucherRedeemableFromDate: utils.timestamp
      .msToSec(Date.now() + DAY_IN_MS)
      .toString(),
    voucherRedeemableUntilDate: utils.timestamp
      .msToSec(Date.now() + 2 * DAY_IN_MS)
      .toString(),
    disputePeriodDuration: "864000",
    voucherValidDuration: "86400",
    resolutionPeriodDuration: "86400",
    metadataUri: "ipfs:///QmUttPYRg6mgDAzpjBjMTCvmfsqcgD6UpXj5PRqjvj6nT6",
    metadataHash: "QmUttPYRg6mgDAzpjBjMTCvmfsqcgD6UpXj5PRqjvj6nT6",
    voidedAt: null,
    voided: false,
    protocolFee: "1",
    agentFee: "0",
    agentId: "0",
    numberOfCommits: "0",
    numberOfRedemptions: "0",
    seller: {
      id: "1",
      operator: ZERO_ADDRESS,
      admin: ZERO_ADDRESS,
      clerk: ZERO_ADDRESS,
      treasury: ZERO_ADDRESS,
      authTokenId: "0",
      authTokenType: 0,
      voucherCloneAddress: ZERO_ADDRESS,
      active: true,
      royaltyPercentage: "0",
      contractURI: "ipfs://seller-contract-uri",
      ...seller
    },
    exchangeToken: {
      id: ZERO_ADDRESS,
      address: ZERO_ADDRESS,
      decimals: "18",
      name: "Ether",
      symbol: "ETH",
      ...exchangeToken
    },
    metadata: {
      name: "Name",
      description: "Description",
      externalUrl: "externalUrl",
      animationUrl: "animationUrl",
      licenseUrl: "licenseUrl",
      schemaUrl: "schemaUrl",
      type: MetadataType.Base,
      image: "imageUrl",
      ...metadata
    },
    exchanges: [],
    disputeResolutionTerms: {
      id: "1-1-terms",
      disputeResolverId: "1",
      escalationResponsePeriod: utils.timestamp
        .msToSec(7 * DAY_IN_MS)
        .toString(),
      feeAmount: "0",
      buyerEscalationDeposit: "0",
      ...disputeResolutionTerms
    },
    disputeResolver: {
      id: "1",
      escalationResponsePeriod: utils.timestamp
        .msToSec(7 * DAY_IN_MS)
        .toString(),
      admin: ZERO_ADDRESS,
      clerk: ZERO_ADDRESS,
      treasury: ZERO_ADDRESS,
      operator: ZERO_ADDRESS,
      // TODO: replace with valid uri
      metadataUri: "ipfs://dispute-resolver-uri",
      active: true,
      sellerAllowList: [],
      fees: [],
      ...disputeResolver
    },
    ...restOverrides
  };
}

export function mockRawExchangeFromSubgraph(
  overrides: Partial<ExchangeFieldsFragment> = {},
  offerOverrides: Partial<OfferFieldsFragment> = {}
): ExchangeFieldsFragment {
  const { buyer = {}, seller = {}, offer = {}, ...restOverrides } = overrides;

  return {
    id: "1",
    disputed: false,
    state: ExchangeState.Committed,
    committedDate: utils.timestamp.msToSec(Date.now() - DAY_IN_MS).toString(),
    validUntilDate: utils.timestamp
      .msToSec(Date.now() + 3 * DAY_IN_MS)
      .toString(),
    expired: false,
    buyer: {
      id: "2",
      wallet: ZERO_ADDRESS,
      active: true,
      ...buyer
    },
    seller: {
      id: "3",
      operator: ZERO_ADDRESS,
      admin: ZERO_ADDRESS,
      clerk: ZERO_ADDRESS,
      treasury: ZERO_ADDRESS,
      authTokenId: "0",
      authTokenType: 0,
      voucherCloneAddress: ZERO_ADDRESS,
      active: true,
      royaltyPercentage: "0",
      contractURI: "ipfs://seller-contract-uri",
      ...seller
    },
    offer: mockRawOfferFromSubgraph(offerOverrides),
    ...restOverrides
  };
}

export function buildProductV1Metadata(template: string) {
  return {
    name: "Name",
    description: "Description",
    externalUrl: "externalUrl",
    animationUrl: "animationUrl",
    licenseUrl: "licenseUrl",
    schemaUrl: "schemaUrl",
    image: "imageUrl",
    type: subgraph.MetadataType.ProductV1,
    exchangePolicy: {
      template,
      sellerContactMethod: "Chat App in the dApp",
      disputeResolverContactMethod: "email to: disputes@redeemeum.com"
    },
    productV1Seller: {
      name: "Best Brand Ever"
    },
    shipping: {
      returnPeriodInDays: 15
    }
  };
}
