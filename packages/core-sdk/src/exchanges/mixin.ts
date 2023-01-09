import { BaseCoreSDK } from "./../mixins/base-core-sdk";
import * as subgraph from "../subgraph";
import { TransactionResponse, Log } from "@bosonprotocol/common";
import { BigNumberish } from "@ethersproject/bignumber";
import { getValueFromLogs } from "../utils/logs";
import {
  commitToOffer,
  revokeVoucher,
  cancelVoucher,
  redeemVoucher,
  completeExchange,
  completeExchangeBatch,
  expireVoucher
} from "./handler";
import { getExchangeById, getExchanges } from "./subgraph";
import { bosonExchangeHandlerIface } from "./interface";

export class ExchangesMixin extends BaseCoreSDK {
  /* -------------------------------------------------------------------------- */
  /*                          Exchange related methods                          */
  /* -------------------------------------------------------------------------- */

  /**
   * Returns exchange entity from subgraph.
   * @param exchangeId - ID of exchange entity.
   * @param queryVars - Optional query variables to skip, order or filter.
   * @returns Exchange entity from subgraph.
   */
  public async getExchangeById(
    exchangeId: BigNumberish,
    queryVars?: subgraph.GetExchangeByIdQueryQueryVariables
  ): Promise<subgraph.ExchangeFieldsFragment> {
    return getExchangeById(this._subgraphUrl, exchangeId, queryVars);
  }

  /**
   * Returns exchange entities from subgraph.
   * @param queryVars - Optional query variables to skip, order or filter.
   * @returns Exchange entities from subgraph.
   */
  public async getExchanges(
    queryVars?: subgraph.GetExchangesQueryQueryVariables
  ): Promise<subgraph.ExchangeFieldsFragment[]> {
    return getExchanges(this._subgraphUrl, queryVars);
  }

  /**
   * Commits to an offer by calling the `ExchangeHandlerContract`.
   * This transaction only succeeds if the seller has deposited funds.
   * @param offerId - ID of offer to commit to.
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
  public async commitToOffer(
    offerId: BigNumberish,
    overrides: Partial<{
      buyer: string;
    }> = {}
  ): Promise<TransactionResponse> {
    const buyer = overrides.buyer || (await this._web3Lib.getSignerAddress());
    return commitToOffer({
      buyer,
      offerId,
      web3Lib: this._web3Lib,
      subgraphUrl: this._subgraphUrl,
      contractAddress: this._protocolDiamond
    });
  }

  /**
   * Utility method to retrieve the created `exchangeId` from logs after calling `commitToOffer`.
   * @param logs - Logs to search in.
   * @returns Created exchange id.
   */
  public getCommittedExchangeIdFromLogs(logs: Log[]): string | null {
    return getValueFromLogs({
      iface: bosonExchangeHandlerIface,
      logs,
      eventArgsKey: "exchangeId",
      eventName: "BuyerCommitted"
    });
  }

  /**
   * Revokes an existing voucher by calling the `ExchangeHandlerContract`.
   * Callable by seller `operator`.
   * @param exchangeId - ID of exchange to revoke.
   * @returns Transaction response.
   */
  public async revokeVoucher(
    exchangeId: BigNumberish
  ): Promise<TransactionResponse> {
    return revokeVoucher({
      web3Lib: this._web3Lib,
      contractAddress: this._protocolDiamond,
      exchangeId,
      subgraphUrl: this._subgraphUrl
    });
  }

  /**
   * Cancels an existing voucher by calling the `ExchangeHandlerContract`.
   * Callable by buyer.
   * @param exchangeId - ID of exchange to cancel.
   * @returns Transaction response.
   */
  public async cancelVoucher(
    exchangeId: BigNumberish
  ): Promise<TransactionResponse> {
    return cancelVoucher({
      web3Lib: this._web3Lib,
      contractAddress: this._protocolDiamond,
      exchangeId,
      subgraphUrl: this._subgraphUrl
    });
  }

  /**
   * Redeems an existing voucher by calling the `ExchangeHandlerContract`.
   * Callable by buyer.
   * @param exchangeId - ID of exchange to redeem.
   * @returns Transaction response.
   */
  public async redeemVoucher(
    exchangeId: BigNumberish
  ): Promise<TransactionResponse> {
    return redeemVoucher({
      web3Lib: this._web3Lib,
      contractAddress: this._protocolDiamond,
      exchangeId,
      subgraphUrl: this._subgraphUrl
    });
  }

  /**
   * Completes an existing voucher by calling the `ExchangeHandlerContract`.
   * Callable by buyer or seller operator.
   * @param exchangeId - ID of exchange to complete.
   * @returns Transaction response.
   */
  public async completeExchange(
    exchangeId: BigNumberish
  ): Promise<TransactionResponse> {
    return completeExchange({
      web3Lib: this._web3Lib,
      contractAddress: this._protocolDiamond,
      exchangeId,
      subgraphUrl: this._subgraphUrl
    });
  }

  /**
   * Completes a batch of existing vouchers by calling the `ExchangeHandlerContract`.
   * Callable by buyer or seller operator.
   * @param exchangeIds - IDs of exchange to complete.
   * @returns Transaction response.
   */
  public async completeExchangeBatch(
    exchangeIds: BigNumberish[]
  ): Promise<TransactionResponse> {
    return completeExchangeBatch({
      web3Lib: this._web3Lib,
      contractAddress: this._protocolDiamond,
      exchangeIds,
      subgraphUrl: this._subgraphUrl
    });
  }

  /**
   * Expires an existing voucher by calling the `ExchangeHandlerContract`.
   * @param exchangeId - ID of exchange to expire.
   * @returns Transaction response.
   */
  public async expireVoucher(
    exchangeId: BigNumberish
  ): Promise<TransactionResponse> {
    return expireVoucher({
      web3Lib: this._web3Lib,
      contractAddress: this._protocolDiamond,
      exchangeId,
      subgraphUrl: this._subgraphUrl
    });
  }
}
