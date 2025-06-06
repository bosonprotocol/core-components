import {
  ConditionStruct,
  TransactionResponse,
  Web3LibAdapter
} from "@bosonprotocol/common";
import { BigNumberish } from "@ethersproject/bignumber";
import { handler } from ".";
import { offers, accounts } from "..";
import { BaseCoreSDK } from "./../mixins/base-core-sdk";
import { PremintParametersStruct } from "@bosonprotocol/common/src";

export class OrchestrationMixin<
  T extends Web3LibAdapter
> extends BaseCoreSDK<T> {
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

  /**
   * Creates a preminted offer and adds it to an existing group
   * @param offerToCreate - Offer arguments.
   * @param reservedRangeLength - Already reserved range length.
   * @param groupId -  Group ID the offer will be added to
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
  public async createPremintedOfferAddToGroup(
    offerToCreate: offers.CreateOfferArgs,
    premintParameters: PremintParametersStruct,
    groupId: BigNumberish,
    overrides: Partial<{
      contractAddress: string;
    }> = {}
  ): Promise<TransactionResponse> {
    return handler.createPremintedOfferAddToGroup({
      offerToCreate,
      premintParameters,
      groupId,
      contractAddress: overrides.contractAddress || this._protocolDiamond,
      web3Lib: this._web3Lib,
      metadataStorage: this._metadataStorage,
      theGraphStorage: this._theGraphStorage
    });
  }

  /**
   * Creates a seller account and preminted offer
   * This transaction only succeeds if there is no existing seller account for the connected signer.
   * @param sellerToCreate - Addresses to set in the seller account.
   * @param offerToCreate - Offer arguments.
   * @param condition -  contract condition applied to the offer
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
  public async createSellerAndPremintedOffer(
    sellerToCreate: accounts.CreateSellerArgs,
    offerToCreate: offers.CreateOfferArgs,
    premintParameters: PremintParametersStruct,
    overrides: Partial<{
      contractAddress: string;
    }> = {}
  ): Promise<TransactionResponse> {
    return handler.createSellerAndPremintedOffer({
      sellerToCreate,
      offerToCreate,
      premintParameters,
      contractAddress: overrides.contractAddress || this._protocolDiamond,
      web3Lib: this._web3Lib,
      metadataStorage: this._metadataStorage,
      theGraphStorage: this._theGraphStorage
    });
  }

  /**
   * Creates a preminted offer and adds it to an existing group
   * @param offerToCreate - Offer arguments.
   * @param reservedRangeLength - Already reserved range length.
   * @param groupId -  Group ID the offer will be added to
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
  public async createPremintedOfferWithCondition(
    offerToCreate: offers.CreateOfferArgs,
    premintParameters: PremintParametersStruct,
    condition: ConditionStruct,
    overrides: Partial<{
      contractAddress: string;
    }> = {}
  ): Promise<TransactionResponse> {
    return handler.createPremintedOfferWithCondition({
      offerToCreate,
      premintParameters,
      condition,
      contractAddress: overrides.contractAddress || this._protocolDiamond,
      web3Lib: this._web3Lib,
      metadataStorage: this._metadataStorage,
      theGraphStorage: this._theGraphStorage
    });
  }

  /**
   * Creates a seller account and preminted offer with a specific conditions
   * This transaction only succeeds if there is no existing seller account for the connected signer.
   * @param sellerToCreate - Addresses to set in the seller account.
   * @param offerToCreate - Offer arguments.
   * @param reservedRangeLength -  Already reserved range length.
   * @param condition -  contract condition applied to the offer
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
  public async createSellerAndPremintedOfferWithCondition(
    sellerToCreate: accounts.CreateSellerArgs,
    offerToCreate: offers.CreateOfferArgs,
    premintParameters: PremintParametersStruct,
    condition: ConditionStruct,
    overrides: Partial<{
      contractAddress: string;
    }> = {}
  ): Promise<TransactionResponse> {
    return handler.createSellerAndPremintedOfferWithCondition({
      sellerToCreate,
      offerToCreate,
      premintParameters,
      contractAddress: overrides.contractAddress || this._protocolDiamond,
      web3Lib: this._web3Lib,
      metadataStorage: this._metadataStorage,
      theGraphStorage: this._theGraphStorage,
      condition
    });
  }

  /**
   * Raises a dispute and immediately escalates it
   * @param exchangeId - Exchange ID
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
  public async raiseAndEscalateDispute(
    exchangeId: BigNumberish,
    overrides: Partial<{
      contractAddress: string;
    }> = {}
  ): Promise<TransactionResponse> {
    return handler.raiseAndEscalateDispute({
      exchangeId,
      contractAddress: overrides.contractAddress || this._protocolDiamond,
      web3Lib: this._web3Lib,
      metadataStorage: this._metadataStorage,
      theGraphStorage: this._theGraphStorage
    });
  }
}
