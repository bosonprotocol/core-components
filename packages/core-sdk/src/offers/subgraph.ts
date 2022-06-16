import { BigNumberish } from "@ethersproject/bignumber";
import { getSubgraphSdk } from "../utils/graphql";
import {
  OfferFieldsFragment,
  OrderDirection,
  Offer_OrderBy
} from "../subgraph";

export type MultiQueryOpts = {
  orderBy: Offer_OrderBy;
  orderDirection: OrderDirection;
};

export async function getOfferById(
  subgraphUrl: string,
  offerId: BigNumberish
): Promise<OfferFieldsFragment> {
  const subgraphSdk = getSubgraphSdk(subgraphUrl);

  const { offer } = await subgraphSdk.getOfferByIdQuery({
    offerId: offerId.toString()
  });

  return offer;
}

export async function getAllOffersOfOperator(
  subgraphUrl: string,
  operatorAddress: string,
  opts?: MultiQueryOpts
): Promise<OfferFieldsFragment[]> {
  const subgraphSdk = getSubgraphSdk(subgraphUrl);

  const { sellers = [] } = await subgraphSdk.getAllOffersOfOperatorQuery({
    operator: operatorAddress,
    orderBy: opts?.orderBy,
    orderDirection: opts?.orderDirection
  });

  if (!sellers || sellers.length === 0) {
    return [];
  }

  return sellers[0].offers;
}
