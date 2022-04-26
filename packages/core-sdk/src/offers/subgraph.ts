import { BigNumberish } from "@ethersproject/bignumber";
import { fetchSubgraph, MultiQueryOpts } from "../utils/subgraph";
import { RawOfferFromSubgraph } from "./types";

export const offerFieldsFragment = `
fragment offerFields on Offer {
  id
  createdAt
  price
  sellerDeposit
  buyerCancelPenalty
  quantityAvailable
  validFromDate
  validUntilDate
  redeemableFromDate
  fulfillmentPeriodDuration
  voucherValidDuration
  metadataUri
  offerChecksum
  voidedAt
  seller {
    id
    operator
    admin
    clerk
    treasury
    active
  }
  exchangeToken {
    address
    decimals
    name
    symbol
  }
  metadata {
    name 
    description
    externalUrl
    schemaUrl
    type
  }
}
`;

export const getOfferByIdQuery = `
query GetOfferById($offerId: ID!) {
  offer(id: $offerId) {
    ...offerFields
  }
}
${offerFieldsFragment}
`;

export async function getOfferById(
  subgraphUrl: string,
  offerId: BigNumberish
): Promise<RawOfferFromSubgraph> {
  const { offer } = await fetchSubgraph<{ offer: RawOfferFromSubgraph }>(
    subgraphUrl,
    getOfferByIdQuery,
    { offerId: offerId.toString() }
  );

  return offer;
}

export const getAllOffersOfOperatorQuery = `
query GetAllOffersOfOperatorQuery(
  $operator: String!,
  $first: Int,
  $skip: Int,
  $orderBy: String,
  $orderDirection: String
) {
  sellers(where: {
    operator: $operator
  }) {
    offers(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      ...offerFields
    }
  }
}
${offerFieldsFragment}
`;

export async function getAllOffersOfOperator(
  subgraphUrl: string,
  operatorAddress: string,
  opts: MultiQueryOpts = {}
): Promise<RawOfferFromSubgraph[]> {
  const { sellers } = await fetchSubgraph<{
    sellers: { offers: RawOfferFromSubgraph[] };
  }>(subgraphUrl, getAllOffersOfOperatorQuery, {
    operator: operatorAddress.toLowerCase(),
    first: 100,
    skip: 0,
    orderBy: "createdAt",
    orderDirection: "desc",
    ...opts
  });

  if (!sellers) {
    return [];
  }

  return sellers[0].offers;
}
