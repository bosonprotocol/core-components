import {
  CreateGroupArgs,
  TransactionResponse,
  TransactionRequest,
  Web3LibAdapter
} from "@bosonprotocol/common";
import { handler } from ".";
import { BaseCoreSDK } from "./../mixins/base-core-sdk";

export class GroupsMixin<T extends Web3LibAdapter> extends BaseCoreSDK<T> {
  /**
   * Creates a group of contract addresses by calling the contract.
   * This transaction only succeeds if there is an existing account for connected signer.
   * @param groupToCreate - Group with the contract condition.
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
  // Overload: returnTxInfo is true → returns TransactionRequest
  public async createGroup(
    groupToCreate: CreateGroupArgs,
    overrides: Partial<{
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo: true;
    }>
  ): Promise<TransactionRequest>;

  // Overload: returnTxInfo is false or undefined → returns TransactionResponse
  public async createGroup(
    groupToCreate: CreateGroupArgs,
    overrides?: Partial<{
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo?: false | undefined;
    }>
  ): Promise<TransactionResponse>;

  // Implementation
  public async createGroup(
    groupToCreate: CreateGroupArgs,
    overrides: Partial<{
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo?: boolean;
    }> = {}
  ): Promise<TransactionResponse | TransactionRequest> {
    const { returnTxInfo } = overrides;

    const groupArgs = {
      groupToCreate,
      contractAddress: overrides.contractAddress || this._protocolDiamond,
      web3Lib: this._web3Lib
    } as const satisfies Parameters<typeof handler.createGroup>[0];

    if (returnTxInfo === true) {
      return handler.createGroup({
        ...groupArgs,
        returnTxInfo: true
      });
    } else {
      return handler.createGroup({
        ...groupArgs,
        returnTxInfo: false
      });
    }
  }
}
