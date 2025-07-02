import { BaseCoreSDK } from "./../mixins/base-core-sdk";
import * as subgraph from "../subgraph";
import {
  TransactionResponse,
  TransactionRequest,
  Web3LibAdapter
} from "@bosonprotocol/common";
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
import { getSignatureParameters, StructuredData } from "../utils/signature";

export class DisputesMixin<T extends Web3LibAdapter> extends BaseCoreSDK<T> {
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
    exchangeId: BigNumberish,
    returnTxInfo: true
  ): Promise<TransactionRequest>;
  public async raiseDispute(
    exchangeId: BigNumberish,
    returnTxInfo?: false | undefined
  ): Promise<TransactionResponse>;
  public async raiseDispute(
    exchangeId: BigNumberish,
    returnTxInfo?: boolean
  ): Promise<TransactionResponse | TransactionRequest> {
    const raiseArgs = {
      exchangeId,
      contractAddress: this._protocolDiamond,
      web3Lib: this._web3Lib
    } as const satisfies Parameters<typeof raiseDispute>[0];

    if (returnTxInfo === true) {
      return raiseDispute({
        ...raiseArgs,
        returnTxInfo: true
      });
    } else {
      return raiseDispute({
        ...raiseArgs,
        returnTxInfo: false
      });
    }
  }

  /**
   * Retracts a dispute by calling the `DisputeHandlerContract`.
   * @param exchangeId - ID of disputed exchange.
   * @returns Transaction response.
   */
  public async retractDispute(
    exchangeId: BigNumberish,
    returnTxInfo: true
  ): Promise<TransactionRequest>;
  public async retractDispute(
    exchangeId: BigNumberish,
    returnTxInfo?: false | undefined
  ): Promise<TransactionResponse>;
  public async retractDispute(
    exchangeId: BigNumberish,
    returnTxInfo?: boolean
  ): Promise<TransactionResponse | TransactionRequest> {
    const retractArgs = {
      exchangeId,
      contractAddress: this._protocolDiamond,
      web3Lib: this._web3Lib
    } as const satisfies Parameters<typeof retractDispute>[0];

    if (returnTxInfo === true) {
      return retractDispute({
        ...retractArgs,
        returnTxInfo: true
      });
    } else {
      return retractDispute({
        ...retractArgs,
        returnTxInfo: false
      });
    }
  }

  /**
   * Extends the dispute timeout by calling the `DisputeHandlerContract`.
   * @param exchangeId - ID of disputed exchange.
   * @param newDisputeTimeout - New dispute timeout in seconds.
   * @returns Transaction response.
   */
  public async extendDisputeTimeout(
    exchangeId: BigNumberish,
    newDisputeTimeout: BigNumberish,
    returnTxInfo: true
  ): Promise<TransactionRequest>;
  public async extendDisputeTimeout(
    exchangeId: BigNumberish,
    newDisputeTimeout: BigNumberish,
    returnTxInfo?: false | undefined
  ): Promise<TransactionResponse>;
  public async extendDisputeTimeout(
    exchangeId: BigNumberish,
    newDisputeTimeout: BigNumberish,
    returnTxInfo?: boolean
  ): Promise<TransactionResponse | TransactionRequest> {
    const extendArgs = {
      exchangeId,
      newDisputeTimeout,
      contractAddress: this._protocolDiamond,
      web3Lib: this._web3Lib
    } as const satisfies Parameters<typeof extendDisputeTimeout>[0];

    if (returnTxInfo === true) {
      return extendDisputeTimeout({
        ...extendArgs,
        returnTxInfo: true
      });
    } else {
      return extendDisputeTimeout({
        ...extendArgs,
        returnTxInfo: false
      });
    }
  }

  /**
   * Expires a dispute by calling the `DisputeHandlerContract`.
   * @param exchangeId - ID of disputed exchange.
   * @returns Transaction response.
   */
  public async expireDispute(
    exchangeId: BigNumberish,
    returnTxInfo: true
  ): Promise<TransactionRequest>;
  public async expireDispute(
    exchangeId: BigNumberish,
    returnTxInfo?: false | undefined
  ): Promise<TransactionResponse>;
  public async expireDispute(
    exchangeId: BigNumberish,
    returnTxInfo?: boolean
  ): Promise<TransactionResponse | TransactionRequest> {
    const expireArgs = {
      exchangeId,
      contractAddress: this._protocolDiamond,
      web3Lib: this._web3Lib
    } as const satisfies Parameters<typeof expireDispute>[0];

    if (returnTxInfo === true) {
      return expireDispute({
        ...expireArgs,
        returnTxInfo: true
      });
    } else {
      return expireDispute({
        ...expireArgs,
        returnTxInfo: false
      });
    }
  }

  /**
   * Expires many disputes by calling the `DisputeHandlerContract`.
   * @param exchangeIds - IDs of disputed exchanges.
   * @returns Transaction response.
   */
  public async expireDisputeBatch(
    exchangeIds: BigNumberish[],
    returnTxInfo: true
  ): Promise<TransactionRequest>;
  public async expireDisputeBatch(
    exchangeIds: BigNumberish[],
    returnTxInfo?: false | undefined
  ): Promise<TransactionResponse>;
  public async expireDisputeBatch(
    exchangeIds: BigNumberish[],
    returnTxInfo?: boolean
  ): Promise<TransactionResponse | TransactionRequest> {
    const batchArgs = {
      exchangeIds,
      contractAddress: this._protocolDiamond,
      web3Lib: this._web3Lib
    } as const satisfies Parameters<typeof expireDisputeBatch>[0];

    if (returnTxInfo === true) {
      return expireDisputeBatch({
        ...batchArgs,
        returnTxInfo: true
      });
    } else {
      return expireDisputeBatch({
        ...batchArgs,
        returnTxInfo: false
      });
    }
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
    returnTxInfo: true;
  }): Promise<TransactionRequest>;
  public async resolveDispute(args: {
    exchangeId: BigNumberish;
    buyerPercentBasisPoints: BigNumberish;
    sigR: BytesLike;
    sigS: BytesLike;
    sigV: BigNumberish;
    returnTxInfo?: false | undefined;
  }): Promise<TransactionResponse>;
  public async resolveDispute(args: {
    exchangeId: BigNumberish;
    buyerPercentBasisPoints: BigNumberish;
    sigR: BytesLike;
    sigS: BytesLike;
    sigV: BigNumberish;
    returnTxInfo?: boolean;
  }): Promise<TransactionResponse | TransactionRequest> {
    const { returnTxInfo } = args;
    const resolveArgs = {
      exchangeId: args.exchangeId,
      buyerPercentBasisPoints: args.buyerPercentBasisPoints,
      sigR: args.sigR,
      sigS: args.sigS,
      sigV: args.sigV,
      contractAddress: this._protocolDiamond,
      web3Lib: this._web3Lib
    } as const satisfies Parameters<typeof resolveDispute>[0];

    if (returnTxInfo === true) {
      return resolveDispute({
        ...resolveArgs,
        returnTxInfo: true
      });
    } else {
      return resolveDispute({
        ...resolveArgs,
        returnTxInfo: false
      });
    }
  }

  /**
   * Escalates dispute by calling the `DisputeHandlerContract`.
   * @param exchangeId - ID of disputed exchange.
   * @returns Transaction response.
   */
  public async escalateDispute(
    exchangeId: BigNumberish,
    returnTxInfo: true
  ): Promise<TransactionRequest>;
  public async escalateDispute(
    exchangeId: BigNumberish,
    returnTxInfo?: false | undefined
  ): Promise<TransactionResponse>;
  public async escalateDispute(
    exchangeId: BigNumberish,
    returnTxInfo?: boolean
  ): Promise<TransactionResponse | TransactionRequest> {
    const escalateArgs = {
      exchangeId,
      contractAddress: this._protocolDiamond,
      web3Lib: this._web3Lib
    } as const satisfies Parameters<typeof escalateDispute>[0];

    if (returnTxInfo === true) {
      return escalateDispute({
        ...escalateArgs,
        returnTxInfo: true
      });
    } else {
      return escalateDispute({
        ...escalateArgs,
        returnTxInfo: false
      });
    }
  }

  /**
   * Decides dispute by calling the `DisputeHandlerContract`.
   * @param exchangeId - ID of disputed exchange.
   * @param buyerPercent - Percentage of deposit buyer gets.
   * @returns Transaction response.
   */
  public async decideDispute(
    exchangeId: BigNumberish,
    buyerPercent: BigNumberish,
    returnTxInfo: true
  ): Promise<TransactionRequest>;
  public async decideDispute(
    exchangeId: BigNumberish,
    buyerPercent: BigNumberish,
    returnTxInfo?: false | undefined
  ): Promise<TransactionResponse>;
  public async decideDispute(
    exchangeId: BigNumberish,
    buyerPercent: BigNumberish,
    returnTxInfo?: boolean
  ): Promise<TransactionResponse | TransactionRequest> {
    const decideArgs = {
      exchangeId,
      buyerPercent,
      contractAddress: this._protocolDiamond,
      web3Lib: this._web3Lib
    } as const satisfies Parameters<typeof decideDispute>[0];

    if (returnTxInfo === true) {
      return decideDispute({
        ...decideArgs,
        returnTxInfo: true
      });
    } else {
      return decideDispute({
        ...decideArgs,
        returnTxInfo: false
      });
    }
  }

  /**
   * Refuses escalated dispute by calling the `DisputeHandlerContract`.
   * @param exchangeId - ID of disputed exchange.
   * @returns Transaction response.
   */
  public async refuseEscalatedDispute(
    exchangeId: BigNumberish,
    returnTxInfo: true
  ): Promise<TransactionRequest>;
  public async refuseEscalatedDispute(
    exchangeId: BigNumberish,
    returnTxInfo?: false | undefined
  ): Promise<TransactionResponse>;
  public async refuseEscalatedDispute(
    exchangeId: BigNumberish,
    returnTxInfo?: boolean
  ): Promise<TransactionResponse | TransactionRequest> {
    const refuseArgs = {
      exchangeId,
      contractAddress: this._protocolDiamond,
      web3Lib: this._web3Lib
    } as const satisfies Parameters<typeof refuseEscalatedDispute>[0];

    if (returnTxInfo === true) {
      return refuseEscalatedDispute({
        ...refuseArgs,
        returnTxInfo: true
      });
    } else {
      return refuseEscalatedDispute({
        ...refuseArgs,
        returnTxInfo: false
      });
    }
  }

  /**
   * Expires escalated dispute by calling the `DisputeHandlerContract`.
   * @param exchangeId - ID of disputed exchange.
   * @returns Transaction response.
   */
  public async expireEscalatedDispute(
    exchangeId: BigNumberish,
    returnTxInfo: true
  ): Promise<TransactionRequest>;
  public async expireEscalatedDispute(
    exchangeId: BigNumberish,
    returnTxInfo?: false | undefined
  ): Promise<TransactionResponse>;
  public async expireEscalatedDispute(
    exchangeId: BigNumberish,
    returnTxInfo?: boolean
  ): Promise<TransactionResponse | TransactionRequest> {
    const expireEscalatedArgs = {
      exchangeId,
      contractAddress: this._protocolDiamond,
      web3Lib: this._web3Lib
    } as const satisfies Parameters<typeof expireEscalatedDispute>[0];

    if (returnTxInfo === true) {
      return expireEscalatedDispute({
        ...expireEscalatedArgs,
        returnTxInfo: true
      });
    } else {
      return expireEscalatedDispute({
        ...expireEscalatedArgs,
        returnTxInfo: false
      });
    }
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
    returnTypedDataToSign: true;
  }): Promise<StructuredData>;
  public async signDisputeResolutionProposal(args: {
    exchangeId: BigNumberish;
    buyerPercentBasisPoints: BigNumberish;
    returnTypedDataToSign?: false;
  }): Promise<ReturnType<typeof getSignatureParameters>>;
  public async signDisputeResolutionProposal(args: {
    exchangeId: BigNumberish;
    buyerPercentBasisPoints: BigNumberish;
    returnTypedDataToSign?: boolean;
  }): Promise<StructuredData | ReturnType<typeof getSignatureParameters>> {
    const { returnTypedDataToSign, ...argsWithoutReturnTypedDataToSign } = args;
    const params = {
      ...argsWithoutReturnTypedDataToSign,
      web3Lib: this._web3Lib,
      contractAddress: this._protocolDiamond,
      chainId: this._chainId
    };
    if (returnTypedDataToSign === true) {
      return signResolutionProposal({
        ...params,
        returnTypedDataToSign: true
      });
    } else {
      return signResolutionProposal({
        ...params,
        returnTypedDataToSign: false
      });
    }
  }
}
