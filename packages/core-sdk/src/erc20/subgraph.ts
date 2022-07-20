import { getSubgraphSdk } from "../utils/graphql";
import {
  ExchangeTokenFieldsFragment,
  GetExchangeTokenByIdQueryQueryVariables,
  GetExchangeTokensQueryQueryVariables
} from "../subgraph";

export type SingleExchangeTokenQueryVariables = Omit<
  GetExchangeTokenByIdQueryQueryVariables,
  "exchangeTokenId"
>;

export async function getExchangeTokenById(
  subgraphUrl: string,
  exchangeTokenId: string,
  queryVars: SingleExchangeTokenQueryVariables = {}
): Promise<ExchangeTokenFieldsFragment> {
  const sdk = getSubgraphSdk(subgraphUrl);
  const { exchangeToken } = await sdk.getExchangeTokenByIdQuery({
    exchangeTokenId: exchangeTokenId.toLowerCase(),
    ...queryVars
  });
  return exchangeToken;
}

export async function getExchangeTokens(
  subgraphUrl: string,
  queryVars: GetExchangeTokensQueryQueryVariables = {}
): Promise<ExchangeTokenFieldsFragment[]> {
  const sdk = getSubgraphSdk(subgraphUrl);
  const { exchangeTokens = [] } = await sdk.getExchangeTokensQuery(queryVars);
  return exchangeTokens;
}
