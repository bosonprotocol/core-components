import { ConditionStruct, TransactionResponse } from "@bosonprotocol/common";
import { handler } from ".";
import { offers, accounts } from "..";
import { BaseCoreSDK } from "./../mixins/base-core-sdk";

export class OrchestrationMixin extends BaseCoreSDK {
  /**
   * Creates an offer with a specific conditions
   * @param offerToCreate - Offer arguments.
   * @param condition -  contract condition applied to the offer
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
  public async createOfferWithCondition(
    offerToCreate: offers.CreateOfferArgs,
    condition: ConditionStruct,
    overrides: Partial<{
      contractAddress: string;
    }> = {}
  ): Promise<TransactionResponse> {
    return handler.createOfferWithCondition({
      offerToCreate,
      contractAddress: overrides.contractAddress || this._protocolDiamond,
      web3Lib: this._web3Lib,
      metadataStorage: this._metadataStorage,
      theGraphStorage: this._theGraphStorage,
      condition
    });
  }
  /**
   * Creates a seller account and offer with a specific conditions
   * This transaction only succeeds if there is no existing seller account for the connected signer.
   * @param sellerToCreate - Addresses to set in the seller account.
   * @param offerToCreate - Offer arguments.
   * @param condition -  contract condition applied to the offer
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
  public async createSellerAndOfferWithCondition(
    sellerToCreate: accounts.CreateSellerArgs,
    offerToCreate: offers.CreateOfferArgs,
    condition: ConditionStruct,
    overrides: Partial<{
      contractAddress: string;
    }> = {}
  ): Promise<TransactionResponse> {
    return handler.createSellerAndOfferWithCondition({
      sellerToCreate,
      offerToCreate,
      contractAddress: overrides.contractAddress || this._protocolDiamond,
      web3Lib: this._web3Lib,
      metadataStorage: this._metadataStorage,
      theGraphStorage: this._theGraphStorage,
      condition
    });
  }
}
