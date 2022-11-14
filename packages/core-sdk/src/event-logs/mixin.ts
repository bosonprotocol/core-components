import { BaseCoreSDK } from "./../mixins/base-core-sdk";
import * as subgraph from "../subgraph";
import { getEventLogs } from "./subgraph";

export class EventLogsMixin extends BaseCoreSDK {
  /**
   * Returns event logs from subgraph.
   * @param queryVars - Optional query variables to skip, order or filter.
   * @returns Event log entities from subgraph.
   */
  public async getEventLogs(
    queryVars?: subgraph.GetEventLogsQueryQueryVariables
  ) {
    return getEventLogs(this._subgraphUrl, queryVars);
  }
}
