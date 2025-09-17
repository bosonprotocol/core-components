import { BaseCoreSDK } from "./../mixins/base-core-sdk";
import * as subgraph from "../subgraph";
import {
  TransactionResponse,
  TransactionRequest,
  Web3LibAdapter
} from "@bosonprotocol/common";
import { BigNumberish } from "@ethersproject/bignumber";
import { AddressZero } from "@ethersproject/constants";
import {
  withdrawFunds,
  withdrawAllAvailableFunds,
  depositFunds
} from "./handler";
import { getFundsById, getFunds } from "./subgraph";

export class FundsMixin<T extends Web3LibAdapter> extends BaseCoreSDK<T> {
  /* -------------------------------------------------------------------------- */
  /*                            Funds related methods                           */
  /* -------------------------------------------------------------------------- */

  /**
   * Deposit funds by calling the `FundsHandlerFacet` contract.
   * This transaction only succeeds if there is an existing entity account for connected signer.
   * @param entityId - ID of the account to deposit funds for.
   * @param fundsAmount - Amount of funds.
   * @param fundsTokenAddress - Address of funds token.
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
  // Overload: returnTxInfo is true → returns TransactionRequest
  public async depositFunds(
    entityId: BigNumberish,
    fundsAmount: BigNumberish,
    fundsTokenAddress: string,
    overrides: Partial<{
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo: true;
    }>
  ): Promise<TransactionRequest>;

  // Overload: returnTxInfo is false or undefined → returns TransactionResponse
  public async depositFunds(
    entityId: BigNumberish,
    fundsAmount: BigNumberish,
    fundsTokenAddress?: string,
    overrides?: Partial<{
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo?: false | undefined;
    }>
  ): Promise<TransactionResponse>;

  // Implementation
  public async depositFunds(
    entityId: BigNumberish,
    fundsAmount: BigNumberish,
    fundsTokenAddress: string = AddressZero,
    overrides: Partial<{
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo?: boolean;
    }> = {}
  ): Promise<TransactionResponse | TransactionRequest> {
    const { returnTxInfo } = overrides;

    const depositArgs = {
      entityId,
      fundsAmount,
      fundsTokenAddress,
      web3Lib: this._web3Lib,
      contractAddress: overrides.contractAddress || this._protocolDiamond
    } as const satisfies Parameters<typeof depositFunds>[0];

    if (returnTxInfo === true) {
      return depositFunds({
        ...depositArgs,
        returnTxInfo: true
      });
    } else {
      return depositFunds({
        ...depositArgs,
        returnTxInfo: false
      });
    }
  }

  /**
   * Withdraw selected funds by calling the `FundsHandlerFacet` contract.
   * This transaction only succeeds if there is an existing account for connected signer.
   * @param entityId - ID of seller/buyer/agent account to withdraw funds for.
   * @param tokensToWithdraw - Addresses of funds tokens to withdraw.
   * @param amountsToWithdraw - Amounts of funds token to withdraw.
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
  // Overload: returnTxInfo is true → returns TransactionRequest
  public async withdrawFunds(
    entityId: BigNumberish,
    tokensToWithdraw: Array<string>,
    amountsToWithdraw: Array<BigNumberish>,
    overrides: Partial<{
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo: true;
    }>
  ): Promise<TransactionRequest>;

  // Overload: returnTxInfo is false or undefined → returns TransactionResponse
  public async withdrawFunds(
    entityId: BigNumberish,
    tokensToWithdraw: Array<string>,
    amountsToWithdraw: Array<BigNumberish>,
    overrides?: Partial<{
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo?: false | undefined;
    }>
  ): Promise<TransactionResponse>;

  // Implementation
  public async withdrawFunds(
    entityId: BigNumberish,
    tokensToWithdraw: Array<string>,
    amountsToWithdraw: Array<BigNumberish>,
    overrides: Partial<{
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo?: boolean;
    }> = {}
  ): Promise<TransactionResponse | TransactionRequest> {
    const { returnTxInfo } = overrides;

    const withdrawArgs = {
      entityId,
      tokensToWithdraw,
      amountsToWithdraw,
      contractAddress: this._protocolDiamond,
      web3Lib: this._web3Lib
    } as const satisfies Parameters<typeof withdrawFunds>[0];

    if (returnTxInfo === true) {
      return withdrawFunds({
        ...withdrawArgs,
        returnTxInfo: true
      });
    } else {
      return withdrawFunds({
        ...withdrawArgs,
        returnTxInfo: false
      });
    }
  }

  /**
   * Withdraw all available funds by calling the `FundsHandlerFacet` contract.
   * This transaction only succeeds if there is an existing account for connected signer.
   * @param entityId - ID of seller/buyer/agent account to withdraw funds for.
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
  // Overload: returnTxInfo is true → returns TransactionRequest
  public async withdrawAllAvailableFunds(
    entityId: BigNumberish,
    overrides: Partial<{
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo: true;
    }>
  ): Promise<TransactionRequest>;

  // Overload: returnTxInfo is false or undefined → returns TransactionResponse
  public async withdrawAllAvailableFunds(
    entityId: BigNumberish,
    overrides?: Partial<{
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo?: false | undefined;
    }>
  ): Promise<TransactionResponse>;

  // Implementation
  public async withdrawAllAvailableFunds(
    entityId: BigNumberish,
    overrides: Partial<{
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo?: boolean;
    }> = {}
  ): Promise<TransactionResponse | TransactionRequest> {
    const { returnTxInfo } = overrides;

    const withdrawAllArgs = {
      entityId,
      subgraphUrl: this._subgraphUrl,
      contractAddress: this._protocolDiamond,
      web3Lib: this._web3Lib
    } as const satisfies Parameters<typeof withdrawAllAvailableFunds>[0];

    if (returnTxInfo === true) {
      return withdrawAllAvailableFunds({
        ...withdrawAllArgs,
        returnTxInfo: true
      });
    } else {
      return withdrawAllAvailableFunds({
        ...withdrawAllArgs,
        returnTxInfo: false
      });
    }
  }

  /**
   * Returns funds entity from subgraph.
   * @param fundsId - ID of funds entity.
   * @param queryVars - Optional query variables to skip, order or filter.
   * @returns Funds entity from subgraph.
   */
  public async getFundsById(
    fundsId: BigNumberish,
    queryVars?: subgraph.GetFundsByIdQueryVariables
  ): Promise<subgraph.FundsEntityFieldsFragment> {
    return getFundsById(this._subgraphUrl, fundsId, queryVars);
  }

  /**
   * Returns funds entities from subgraph.
   * @param queryVars - Optional query variables to skip, order or filter.
   * @returns Funds entities from subgraph.
   */
  public async getFunds(
    queryVars?: subgraph.GetFundsQueryVariables
  ): Promise<subgraph.FundsEntityFieldsFragment[]> {
    return getFunds(this._subgraphUrl, queryVars);
  }
}
