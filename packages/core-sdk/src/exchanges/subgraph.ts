import { getSubgraphSdk } from "../utils/graphql";
import {
  ExchangeFieldsFragment,
  GetExchangesQueryQueryVariables,
  GetExchangeByIdQueryQueryVariables
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
