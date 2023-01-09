import { BaseCoreSDK } from "./../mixins/base-core-sdk";
import * as subgraph from "../subgraph";
import { TransactionResponse } from "@bosonprotocol/common";
import { BigNumberish } from "@ethersproject/bignumber";
import { AddressZero } from "@ethersproject/constants";
import {
  withdrawFunds,
  withdrawAllAvailableFunds,
  depositFunds
} from "./handler";
import { getFundsById, getFunds } from "./subgraph";

export class FundsMixin extends BaseCoreSDK {
  /* -------------------------------------------------------------------------- */
  /*                            Funds related methods                           */
  /* -------------------------------------------------------------------------- */

  /**
   * Deposit funds by calling the `FundsHandlerFacet` contract.
   * @param sellerId - ID of seller account to deposit funds for.
   * @param fundsAmount - Amount of funds.
   * @param fundsTokenAddress - Address of funds token.
   * @returns Transaction response.
   */
  public async depositFunds(
    sellerId: BigNumberish,
    fundsAmount: BigNumberish,
    fundsTokenAddress: string = AddressZero
  ): Promise<TransactionResponse> {
    return depositFunds({
      sellerId,
      fundsAmount,
      fundsTokenAddress,
      contractAddress: this._protocolDiamond,
      web3Lib: this._web3Lib
    });
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

  /**
   * Withdraw selected funds by calling the `FundsHandlerFacet` contract.
   * @param sellerId - ID of seller account to withdraw funds for.
   * @param tokensToWithdraw - Addresses of funds tokens to withdraw.
   * @param amountsToWithdraw - Amounts of funds token to withdraw.
   * @returns Transaction response.
   */
  public async withdrawFunds(
    sellerId: BigNumberish,
    tokensToWithdraw: Array<string>,
    amountsToWithdraw: Array<BigNumberish>
  ): Promise<TransactionResponse> {
    return withdrawFunds({
      sellerId,
      tokensToWithdraw,
      amountsToWithdraw,
      contractAddress: this._protocolDiamond,
      web3Lib: this._web3Lib
    });
  }

  /**
   * Withdraw all available funds by calling the `FundsHandlerFacet` contract.
   * @param sellerId - ID of seller account to withdraw funds for.
   * @returns Transaction response.
   */
  public async withdrawAllAvailableFunds(
    sellerId: BigNumberish
  ): Promise<TransactionResponse> {
    return withdrawAllAvailableFunds({
      sellerId,
      subgraphUrl: this._subgraphUrl,
      contractAddress: this._protocolDiamond,
      web3Lib: this._web3Lib
    });
  }
}
