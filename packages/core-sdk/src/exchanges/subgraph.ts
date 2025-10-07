import { getSubgraphSdk } from "../utils/graphql";
import {
  ExchangeFieldsFragment,
  GetExchangesQueryQueryVariables,
  GetExchangeByIdQueryQueryVariables,
  GetNonListedOfferVoidedQueryQueryVariables,
  NonListedOfferVoidedFieldsFragment
} from "../subgraph";
import { BigNumberish } from "@ethersproject/bignumber";

export type SingleExchangeQueryVariables = Omit<
  GetExchangeByIdQueryQueryVariables,
  "exchangeId"
>;

export async function getExchanges(
  subgraphUrl: string,
  queryVars: GetExchangesQueryQueryVariables = {}
): Promise<ExchangeFieldsFragment[]> {
  const sdk = getSubgraphSdk(subgraphUrl);
  const { exchanges = [] } = await sdk.getExchangesQuery(queryVars);
  return exchanges;
}

export async function getExchangeById(
  subgraphUrl: string,
  exchangeId: BigNumberish,
  queryVars: SingleExchangeQueryVariables = {}
): Promise<ExchangeFieldsFragment> {
  const sdk = getSubgraphSdk(subgraphUrl);
  const { exchange } = await sdk.getExchangeByIdQuery({
    exchangeId: exchangeId.toString(),
    ...queryVars
  });

  return exchange;
}

export async function getNonListedOfferVoided(
  subgraphUrl: string,
  queryVars: GetNonListedOfferVoidedQueryQueryVariables = {}
): Promise<NonListedOfferVoidedFieldsFragment[]> {
  const sdk = getSubgraphSdk(subgraphUrl);
  const { nonListedOfferVoideds } = await sdk.getNonListedOfferVoidedQuery(queryVars);
  return nonListedOfferVoideds;
}
