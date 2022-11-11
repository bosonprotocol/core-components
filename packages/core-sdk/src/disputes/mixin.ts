import { BaseCoreSDK } from "./../mixins/base-core-sdk";
import * as subgraph from "../subgraph";
import { TransactionResponse } from "@bosonprotocol/common";
import { BigNumberish } from "@ethersproject/bignumber";
import { BytesLike } from "@ethersproject/bytes";
import {
  raiseDispute,
  retractDispute,
  extendDisputeTimeout,
  expireDispute,
  expireDisputeBatch,
  resolveDispute,
  escalateDispute,
  decideDispute,
  refuseEscalatedDispute,
  expireEscalatedDispute,
  signResolutionProposal
} from "./handler";
import {
  SingleDisputeQueryVariables,
  getDisputeById,
  getDisputes
} from "./subgraph";

export class DisputesMixin extends BaseCoreSDK {
  /* -------------------------------------------------------------------------- */
  /*                           Dispute related methods                          */
  /* -------------------------------------------------------------------------- */

  /**
   * Returns dispute entity from subgraph.
   * @param disputeId - ID of dispute entity.
   * @param queryVars - Optional query variables to skip, order or filter.
   * @returns Dispute entity from subgraph.
   */
  public async getDisputeById(
    disputeId: BigNumberish,
    queryVars?: SingleDisputeQueryVariables
  ) {
    return getDisputeById(this._subgraphUrl, disputeId, queryVars);
  }

  /**
   * Returns dispute entities from subgraph.
   * @param queryVars - Optional query variables to skip, order or filter.
   * @returns Dispute entities from subgraph.
   */
  public async getDisputes(
    queryVars?: subgraph.GetDisputesQueryQueryVariables
  ) {
    return getDisputes(this._subgraphUrl, queryVars);
  }

  /**
   * Raises a dispute by calling the `DisputeHandlerContract`.
   * @param exchangeId - ID of exchange to dispute.
   * @returns Transaction response.
   */
  public async raiseDispute(
    exchangeId: BigNumberish
  ): Promise<TransactionResponse> {
    return raiseDispute({
      exchangeId,
      contractAddress: this._protocolDiamond,
      web3Lib: this._web3Lib
    });
  }

  /**
   * Retracts a dispute by calling the `DisputeHandlerContract`.
   * @param exchangeId - ID of disputed exchange.
   * @returns Transaction response.
   */
  public async retractDispute(
    exchangeId: BigNumberish
  ): Promise<TransactionResponse> {
    return retractDispute({
      exchangeId,
      contractAddress: this._protocolDiamond,
      web3Lib: this._web3Lib
    });
  }

  /**
   * Extends the dispute timeout by calling the `DisputeHandlerContract`.
   * @param exchangeId - ID of disputed exchange.
   * @param newDisputeTimeout - New dispute timeout in seconds.
   * @returns Transaction response.
   */
  public async extendDisputeTimeout(
    exchangeId: BigNumberish,
    newDisputeTimeout: BigNumberish
  ): Promise<TransactionResponse> {
    return extendDisputeTimeout({
      exchangeId,
      newDisputeTimeout,
      contractAddress: this._protocolDiamond,
      web3Lib: this._web3Lib
    });
  }

  /**
   * Expires a dispute by calling the `DisputeHandlerContract`.
   * @param exchangeId - ID of disputed exchange.
   * @returns Transaction response.
   */
  public async expireDispute(
    exchangeId: BigNumberish
  ): Promise<TransactionResponse> {
    return expireDispute({
      exchangeId,
      contractAddress: this._protocolDiamond,
      web3Lib: this._web3Lib
    });
  }

  /**
   * Expires many disputes by calling the `DisputeHandlerContract`.
   * @param exchangeIds - IDs of disputed exchanges.
   * @returns Transaction response.
   */
  public async expireDisputeBatch(
    exchangeIds: BigNumberish[]
  ): Promise<TransactionResponse> {
    return expireDisputeBatch({
      exchangeIds,
      contractAddress: this._protocolDiamond,
      web3Lib: this._web3Lib
    });
  }

  /**
   * Resolves dispute by calling the `DisputeHandlerContract`. If caller is `buyer` then
   * signature of `seller` is required as an argument. If caller if `seller` then vice-versa.
   * The signature can be retrieved by calling the method
   * `CoreSDK.signDisputeResolutionProposal`.
   * @param args - Dispute resolve arguments:
   * - `args.exchangeId` - ID of disputed exchange.
   * - `args.buyerPercent` - Percentage of deposit the buyer gets.
   * - `args.sigR` - r signature value of counterparty.
   * - `args.sigS` - s signature value of counterparty.
   * - `args.sigV` - v signature value of counterparty.
   * @returns Transaction response.
   */
  public async resolveDispute(args: {
    exchangeId: BigNumberish;
    buyerPercentBasisPoints: BigNumberish;
    sigR: BytesLike;
    sigS: BytesLike;
    sigV: BigNumberish;
  }): Promise<TransactionResponse> {
    return resolveDispute({
      ...args,
      contractAddress: this._protocolDiamond,
      web3Lib: this._web3Lib
    });
  }

  /**
   * Escalates dispute by calling the `DisputeHandlerContract`.
   * @param exchangeId - ID of disputed exchange.
   * @returns Transaction response.
   */
  public async escalateDispute(
    exchangeId: BigNumberish
  ): Promise<TransactionResponse> {
    return escalateDispute({
      exchangeId,
      contractAddress: this._protocolDiamond,
      web3Lib: this._web3Lib
    });
  }

  /**
   * Decides dispute by calling the `DisputeHandlerContract`.
   * @param exchangeId - ID of disputed exchange.
   * @param buyerPercent - Percentage of deposit buyer gets.
   * @returns Transaction response.
   */
  public async decideDispute(
    exchangeId: BigNumberish,
    buyerPercent: BigNumberish
  ): Promise<TransactionResponse> {
    return decideDispute({
      exchangeId,
      buyerPercent,
      contractAddress: this._protocolDiamond,
      web3Lib: this._web3Lib
    });
  }

  /**
   * Refuses escalated dispute by calling the `DisputeHandlerContract`.
   * @param exchangeId - ID of disputed exchange.
   * @returns Transaction response.
   */
  public async refuseEscalatedDispute(
    exchangeId: BigNumberish
  ): Promise<TransactionResponse> {
    return refuseEscalatedDispute({
      exchangeId,
      contractAddress: this._protocolDiamond,
      web3Lib: this._web3Lib
    });
  }

  /**
   * Expires escalated dispute by calling the `DisputeHandlerContract`.
   * @param exchangeId - ID of disputed exchange.
   * @returns Transaction response.
   */
  public async expireEscalatedDispute(
    exchangeId: BigNumberish
  ): Promise<TransactionResponse> {
    return expireEscalatedDispute({
      exchangeId,
      contractAddress: this._protocolDiamond,
      web3Lib: this._web3Lib
    });
  }

  /**
   * Signs dispute resolution message.
   * @param args - Dispute resolve arguments:
   * - `args.exchangeId` - ID of disputed exchange.
   * - `args.buyerPercentBasisPoints` - Percentage of deposit the buyer gets.
   * @returns Signature.
   */
  public async signDisputeResolutionProposal(args: {
    exchangeId: BigNumberish;
    buyerPercentBasisPoints: BigNumberish;
  }) {
    return signResolutionProposal({
      ...args,
      web3Lib: this._web3Lib,
      contractAddress: this._protocolDiamond,
      chainId: this._chainId
    });
  }
}
