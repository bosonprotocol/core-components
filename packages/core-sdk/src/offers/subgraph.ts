import { BigNumberish } from "@ethersproject/bignumber";
import { getSubgraphSdk } from "../utils/graphql";
import { OfferFieldsFragment, QueryOffersArgs } from "../subgraph";

export type AllOffersQueryOpts = Pick<
  QueryOffersArgs,
  "first" | "orderBy" | "orderDirection" | "skip"
>;

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
  opts: AllOffersQueryOpts = {}
): Promise<OfferFieldsFragment[]> {
  const subgraphSdk = getSubgraphSdk(subgraphUrl);

  const { sellers = [] } = await subgraphSdk.getAllOffersOfOperatorQuery({
    operator: operatorAddress,
    ...opts
  });

  if (!sellers || sellers.length === 0) {
    return [];
  }

  return sellers[0].offers;
}
