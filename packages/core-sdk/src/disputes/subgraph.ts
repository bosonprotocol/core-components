import { getSubgraphSdk } from "../utils/graphql";
import {
  DisputeFieldsFragment,
  GetDisputesQueryQueryVariables,
  GetDisputeByIdQueryQueryVariables
} from "../subgraph";
import { BigNumberish } from "@ethersproject/bignumber";

export type SingleDisputeQueryVariables = Omit<
  GetDisputeByIdQueryQueryVariables,
  "disputeId"
>;

export async function getDisputeById(
  subgraphUrl: string,
  disputeId: BigNumberish,
  queryVars: SingleDisputeQueryVariables = {}
): Promise<DisputeFieldsFragment> {
  const sdk = getSubgraphSdk(subgraphUrl);
  const { dispute } = await sdk.getDisputeByIdQuery({
    disputeId: disputeId.toString(),
    ...queryVars
  });
  return dispute;
}

export async function getDisputes(
  subgraphUrl: string,
  queryVars: GetDisputesQueryQueryVariables = {}
): Promise<DisputeFieldsFragment[]> {
  const sdk = getSubgraphSdk(subgraphUrl);
  const { disputes = [] } = await sdk.getDisputesQuery(queryVars);
  return disputes;
}
