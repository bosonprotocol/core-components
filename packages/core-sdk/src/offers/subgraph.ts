import { BigNumberish } from "@ethersproject/bignumber";
import { getSubgraphSdk } from "../utils/graphql";
import {
  OfferFieldsFragment,
  GetOfferByIdQueryQueryVariables,
  GetOffersQueryQueryVariables
} from "../subgraph";

export type SingleOfferQueryVariables = Omit<
  GetOfferByIdQueryQueryVariables,
  "offerId"
>;

export async function getOfferById(
  subgraphUrl: string,
  offerId: BigNumberish,
  queryVars: SingleOfferQueryVariables = {}
): Promise<OfferFieldsFragment> {
  const subgraphSdk = getSubgraphSdk(subgraphUrl);
  const { offer } = await subgraphSdk.getOfferByIdQuery({
    offerId: offerId.toString(),
    ...queryVars
  });
  return offer;
}

export async function getOffers(
  subgraphUrl: string,
  queryVars: GetOffersQueryQueryVariables = {}
): Promise<OfferFieldsFragment[]> {
  const subgraphSdk = getSubgraphSdk(subgraphUrl);
  const { offers = [] } = await subgraphSdk.getOffersQuery({
    ...queryVars
  });

  return offers;
}
