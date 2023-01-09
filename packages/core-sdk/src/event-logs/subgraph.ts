import { getSubgraphSdk } from "../utils/graphql";
import {
  GetEventLogsQueryQueryVariables,
  BaseEventLogFieldsFragment
} from "../subgraph";

export async function getEventLogs(
  subgraphUrl: string,
  queryVars: GetEventLogsQueryQueryVariables = {}
): Promise<BaseEventLogFieldsFragment[]> {
  const subgraphSdk = getSubgraphSdk(subgraphUrl);
  const { eventLogs = [] } = await subgraphSdk.getEventLogsQuery(queryVars);
  return eventLogs;
}
