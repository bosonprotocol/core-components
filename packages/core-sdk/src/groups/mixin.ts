import { CreateGroupArgs, TransactionResponse } from "@bosonprotocol/common";
import { handler } from ".";
import { BaseCoreSDK } from "./../mixins/base-core-sdk";

export class GroupsMixin extends BaseCoreSDK {
  /**
   * Creates a group of contract addresses
   * @param groupToCreate -  group with the contract condition
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
  public async createGroup(
    groupToCreate: CreateGroupArgs,
    overrides: Partial<{
      contractAddress: string;
    }> = {}
  ): Promise<TransactionResponse> {
    return handler.createGroup({
      groupToCreate,
      contractAddress: overrides.contractAddress || this._protocolDiamond,
      web3Lib: this._web3Lib
    });
  }
}
