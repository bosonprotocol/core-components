import { BaseCoreSDK } from "./../mixins/base-core-sdk";
import * as subgraph from "../subgraph";
import {
  getEventLogs,
  getConditionalCommitAuthorizedEventLogs
} from "./subgraph";

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
  /**
   * Returns conditionalCommitAuthorized event logs from subgraph.
   * @param queryVars - Optional query variables to skip, order or filter.
   * @returns ConditionalCommitAuthorized event log entities from subgraph.
   */
  public async getConditionalCommitAuthorizedEventLogs(
    queryVars?: subgraph.GetConditionalCommitAuthorizedEventLogsQueryQueryVariables
  ) {
    return getConditionalCommitAuthorizedEventLogs(
      this._subgraphUrl,
      queryVars
    );
  }
}
