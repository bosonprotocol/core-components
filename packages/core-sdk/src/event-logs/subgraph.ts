import { getSubgraphSdk } from "../utils/graphql";
import {
  GetEventLogsQueryQueryVariables,
  BaseEventLogFieldsFragment,
  GetConditionalCommitAuthorizedEventLogsQueryQueryVariables,
  BaseConditionalCommitAuthorizedEventLogsFieldsFragment
} from "../subgraph";

export async function getEventLogs(
  subgraphUrl: string,
  queryVars: GetEventLogsQueryQueryVariables = {}
): Promise<BaseEventLogFieldsFragment[]> {
  const subgraphSdk = getSubgraphSdk(subgraphUrl);
  const { eventLogs = [] } = await subgraphSdk.getEventLogsQuery(queryVars);
  return eventLogs;
}

export async function getConditionalCommitAuthorizedEventLogs(
  subgraphUrl: string,
  queryVars: GetConditionalCommitAuthorizedEventLogsQueryQueryVariables = {}
): Promise<BaseConditionalCommitAuthorizedEventLogsFieldsFragment[]> {
  const subgraphSdk = getSubgraphSdk(subgraphUrl);
  const { conditionalCommitAuthorizedEventLogs = [] } =
    await subgraphSdk.getConditionalCommitAuthorizedEventLogsQuery(queryVars);
  return conditionalCommitAuthorizedEventLogs;
}
