import { GraphQLClient } from "graphql-request";
import { getSdk } from "../subgraph";

export function getSubgraphSdk(subgraphUrl: string) {
  const client = new GraphQLClient(subgraphUrl);
  return getSdk(client);
}
