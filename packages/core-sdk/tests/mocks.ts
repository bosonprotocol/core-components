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
const sellerMetadataUri =
  "ipfs://Qmcp1cqzUu62CggNpA45p4LmQuExYjoW4yazv11JdEMESj";
export const BICONOMY_URL = "https://biconomy.io";

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
    assistant: ZERO_ADDRESS,
    treasury: ZERO_ADDRESS,
    authTokenId: "0",
    authTokenType: 0,
    voucherCloneAddress: ZERO_ADDRESS,
    active: true,
    royaltyRecipients: [
      {
        id: "1-royalty-0x0000000000000000000000000000000000000000",
        recipient: {
          id: "0x0000000000000000000000000000000000000000",
          wallet: "0x0000000000000000000000000000000000000000",
          royalties: [
            {
              bps: "0",
              offer: {
                id: "1"
              }
            }
          ]
        },
        minRoyaltyPercentage: "0"
      }
    ],
    funds: [],
    offers: [],
    collections: [],
    exchanges: [],
    metadataUri: sellerMetadataUri,
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
    collectionIndex: "0",
    collection: {
      id: "1-collection-0",
      collectionContract: {
        address: ZERO_ADDRESS,
        contractUri: "ipfs://seller-contract-uri"
      },
      collectionIndex: "0",
      externalId: "initial",
      externalIdHash: "0x00",
      sellerId: "1"
    },
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
    priceType: 0,
    royaltyInfos: [
      {
        timestamp: "1710251696",
        recipients: [
          {
            bps: "0",
            recipient: {
              id: "0x0000000000000000000000000000000000000000",
              wallet: "0x0000000000000000000000000000000000000000"
            }
          }
        ]
      }
    ],
    seller: {
      id: "1",
      assistant: ZERO_ADDRESS,
      admin: ZERO_ADDRESS,
      clerk: ZERO_ADDRESS,
      treasury: ZERO_ADDRESS,
      authTokenId: "0",
      authTokenType: 0,
      voucherCloneAddress: ZERO_ADDRESS,
      active: true,
      metadataUri: sellerMetadataUri,
      royaltyRecipients: [
        {
          id: "1-royalty-0x0000000000000000000000000000000000000000",
          recipient: {
            id: "0x0000000000000000000000000000000000000000",
            wallet: "0x0000000000000000000000000000000000000000",
            royalties: [
              {
                bps: "0",
                offer: {
                  id: "1"
                }
              }
            ]
          },
          minRoyaltyPercentage: "0"
        }
      ],
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
      type: MetadataType.BASE,
      image: "imageUrl",
      ...metadata
    } as OfferFieldsFragment["metadata"],
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
      assistant: ZERO_ADDRESS,
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
  const { buyer = {}, seller = {}, ...restOverrides } = overrides;

  return {
    id: "1",
    disputed: false,
    state: ExchangeState.COMMITTED,
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
      assistant: ZERO_ADDRESS,
      admin: ZERO_ADDRESS,
      clerk: ZERO_ADDRESS,
      treasury: ZERO_ADDRESS,
      authTokenId: "0",
      authTokenType: 0,
      voucherCloneAddress: ZERO_ADDRESS,
      active: true,
      metadataUri: sellerMetadataUri,
      royaltyRecipients: [
        {
          id: "1-royalty-0x0000000000000000000000000000000000000000",
          recipient: {
            id: "0x0000000000000000000000000000000000000000",
            wallet: "0x0000000000000000000000000000000000000000",
            royalties: [
              {
                bps: "0",
                offer: {
                  id: "1"
                }
              }
            ]
          },
          minRoyaltyPercentage: "0"
        }
      ],
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
    type: subgraph.MetadataType.PRODUCT_V1,
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
  } as OfferFieldsFragment["metadata"];
}
