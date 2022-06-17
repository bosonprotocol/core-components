import { getSubgraphSdk } from "../utils/graphql";
import {
  FundsEntityFieldsFragment,
  GetFundsByIdQueryVariables,
  GetFundsQueryVariables
} from "../subgraph";
import { BigNumberish } from "@ethersproject/bignumber";

export type SingleFundsQueryVariables = Omit<
  GetFundsByIdQueryVariables,
  "fundsId"
>;

export async function getFunds(
  subgraphUrl: string,
  queryVars: GetFundsQueryVariables = {}
): Promise<FundsEntityFieldsFragment[]> {
  const sdk = getSubgraphSdk(subgraphUrl);
  const { fundsEntities = [] } = await sdk.getFunds(queryVars);
  return fundsEntities;
}

export async function getFundsById(
  subgraphUrl: string,
  fundsId: BigNumberish,
  queryVars: SingleFundsQueryVariables = {}
): Promise<FundsEntityFieldsFragment> {
  const sdk = getSubgraphSdk(subgraphUrl);
  const { fundsEntity } = await sdk.getFundsById({
    fundsId: fundsId.toString(),
    ...queryVars
  });

  return fundsEntity;
}
