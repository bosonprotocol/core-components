import { BigNumberish } from "@ethersproject/bignumber";
import { fetchSubgraph, MultiQueryOpts } from "../utils/subgraph";
import { RawOfferFromSubgraph } from "./types";

export const offerFieldsFragment = `
fragment offerFields on Offer {
  id
  createdAt
  price
  deposit
  penalty
  quantity
  validFromDate
  validUntilDate
  redeemableDate
  fulfillmentPeriodDuration
  voucherValidDuration
  metadataUri
  metadataHash
  voidedAt
  seller {
    address
  }
  exchangeToken {
    address
    decimals
    name
    symbol
  }
  metadata {
    title
    description
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

export const getAllOffersOfSellerQuery = `
query GetAllOffersOfSellerQuery(
  $seller: ID!,
  $first: Int,
  $skip: Int,
  $orderBy: String,
  $orderDirection: String
) {
  seller(id: $seller) {
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

export async function getAllOffersOfSeller(
  subgraphUrl: string,
  sellerAddress: string,
  opts: MultiQueryOpts = {}
): Promise<RawOfferFromSubgraph[]> {
  const { seller } = await fetchSubgraph<{
    seller: { offers: RawOfferFromSubgraph[] };
  }>(subgraphUrl, getAllOffersOfSellerQuery, {
    seller: sellerAddress.toLowerCase(),
    first: 100,
    skip: 0,
    orderBy: "createdAt",
    orderDirection: "desc",
    ...opts
  });

  if (!seller) {
    return [];
  }

  return seller.offers;
}
