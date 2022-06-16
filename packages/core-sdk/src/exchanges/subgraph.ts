import { getSubgraphSdk } from "../utils/graphql";
import { ExchangeFieldsFragment, QueryExchangesArgs } from "../subgraph";
import { BigNumberish } from "@ethersproject/bignumber";

export type ExchangesQueryOpts = Pick<
  QueryExchangesArgs,
  "first" | "orderBy" | "orderDirection" | "skip"
>;

export async function getExchangeById(
  subgraphUrl: string,
  exchangeId: BigNumberish
): Promise<ExchangeFieldsFragment> {
  const sdk = getSubgraphSdk(subgraphUrl);
  const { exchange } = await sdk.getExchangeByIdQuery({
    exchangeId: exchangeId.toString()
  });

  return exchange;
}

export async function getExchangesByOfferId(
  subgraphUrl: string,
  offerId: BigNumberish,
  opts: ExchangesQueryOpts = {}
): Promise<ExchangeFieldsFragment[]> {
  const sdk = getSubgraphSdk(subgraphUrl);
  const { exchanges = [] } = await sdk.getExchangesByOfferId({
    offerId: offerId.toString(),
    ...opts
  });

  return exchanges;
}
