import { BigNumberish } from "@ethersproject/bignumber";
import { fetchSubgraph } from "../utils/subgraph";
import { RawOfferFromSubgraph } from "./types";

export const getOfferByIdQuery = `
query GetOfferById($offerId: ID) {
  offer(id: $offerId) {
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
}
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
