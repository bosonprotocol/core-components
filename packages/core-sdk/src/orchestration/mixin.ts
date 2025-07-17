import {
  ConditionStruct,
  TransactionResponse,
  TransactionRequest,
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
  // Overload: returnTxInfo is true → returns TransactionRequest
  public async createOfferWithCondition(
    offerToCreate: offers.CreateOfferArgs,
    condition: ConditionStruct,
    overrides: Partial<{
      contractAddress: string;
      returnTxInfo: true;
    }>
  ): Promise<TransactionRequest>;

  // Overload: returnTxInfo is false or undefined → returns TransactionResponse
  public async createOfferWithCondition(
    offerToCreate: offers.CreateOfferArgs,
    condition: ConditionStruct,
    overrides?: Partial<{
      contractAddress: string;
      returnTxInfo?: false;
    }>
  ): Promise<TransactionResponse>;

  // Implementation
  public async createOfferWithCondition(
    offerToCreate: offers.CreateOfferArgs,
    condition: ConditionStruct,
    overrides: Partial<{
      contractAddress: string;
      returnTxInfo?: boolean;
    }> = {}
  ): Promise<TransactionResponse | TransactionRequest> {
    const { returnTxInfo } = overrides;

    const createArgs = {
      offerToCreate,
      condition,
      web3Lib: this._web3Lib,
      metadataStorage: this._metadataStorage,
      theGraphStorage: this._theGraphStorage,
      contractAddress: overrides.contractAddress || this._protocolDiamond
    } as const satisfies Parameters<typeof handler.createOfferWithCondition>[0];

    if (returnTxInfo === true) {
      return handler.createOfferWithCondition({
        ...createArgs,
        returnTxInfo: true
      });
    } else {
      return handler.createOfferWithCondition({
        ...createArgs,
        returnTxInfo: false
      });
    }
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
  // Overload: returnTxInfo is true → returns TransactionRequest
  public async createSellerAndOfferWithCondition(
    sellerToCreate: accounts.CreateSellerArgs,
    offerToCreate: offers.CreateOfferArgs,
    condition: ConditionStruct,
    overrides: Partial<{
      contractAddress: string;
      returnTxInfo: true;
    }>
  ): Promise<TransactionRequest>;

  // Overload: returnTxInfo is false or undefined → returns TransactionResponse
  public async createSellerAndOfferWithCondition(
    sellerToCreate: accounts.CreateSellerArgs,
    offerToCreate: offers.CreateOfferArgs,
    condition: ConditionStruct,
    overrides?: Partial<{
      contractAddress: string;
      returnTxInfo?: false;
    }>
  ): Promise<TransactionResponse>;

  // Implementation
  public async createSellerAndOfferWithCondition(
    sellerToCreate: accounts.CreateSellerArgs,
    offerToCreate: offers.CreateOfferArgs,
    condition: ConditionStruct,
    overrides: Partial<{
      contractAddress: string;
      returnTxInfo?: boolean;
    }> = {}
  ): Promise<TransactionResponse | TransactionRequest> {
    const { returnTxInfo } = overrides;

    const createArgs = {
      sellerToCreate,
      offerToCreate,
      condition,
      web3Lib: this._web3Lib,
      metadataStorage: this._metadataStorage,
      theGraphStorage: this._theGraphStorage,
      contractAddress: overrides.contractAddress || this._protocolDiamond
    } as const satisfies Parameters<
      typeof handler.createSellerAndOfferWithCondition
    >[0];

    if (returnTxInfo === true) {
      return handler.createSellerAndOfferWithCondition({
        ...createArgs,
        returnTxInfo: true
      });
    } else {
      return handler.createSellerAndOfferWithCondition({
        ...createArgs,
        returnTxInfo: false
      });
    }
  }

  /**
   * Creates a preminted offer and adds it to an existing group
   * @param offerToCreate - Offer arguments.
   * @param premintParameters - Premint parameters.
   * @param groupId -  Group ID the offer will be added to
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
  // Overload: returnTxInfo is true → returns TransactionRequest
  public async createPremintedOfferAddToGroup(
    offerToCreate: offers.CreateOfferArgs,
    premintParameters: PremintParametersStruct,
    groupId: BigNumberish,
    overrides: Partial<{
      contractAddress: string;
      returnTxInfo: true;
    }>
  ): Promise<TransactionRequest>;

  // Overload: returnTxInfo is false or undefined → returns TransactionResponse
  public async createPremintedOfferAddToGroup(
    offerToCreate: offers.CreateOfferArgs,
    premintParameters: PremintParametersStruct,
    groupId: BigNumberish,
    overrides?: Partial<{
      contractAddress: string;
      returnTxInfo?: false;
    }>
  ): Promise<TransactionResponse>;

  // Implementation
  public async createPremintedOfferAddToGroup(
    offerToCreate: offers.CreateOfferArgs,
    premintParameters: PremintParametersStruct,
    groupId: BigNumberish,
    overrides: Partial<{
      contractAddress: string;
      returnTxInfo?: boolean;
    }> = {}
  ): Promise<TransactionResponse | TransactionRequest> {
    const { returnTxInfo } = overrides;

    const createArgs = {
      offerToCreate,
      premintParameters,
      groupId,
      web3Lib: this._web3Lib,
      metadataStorage: this._metadataStorage,
      theGraphStorage: this._theGraphStorage,
      contractAddress: overrides.contractAddress || this._protocolDiamond
    } as const satisfies Parameters<
      typeof handler.createPremintedOfferAddToGroup
    >[0];

    if (returnTxInfo === true) {
      return handler.createPremintedOfferAddToGroup({
        ...createArgs,
        returnTxInfo: true
      });
    } else {
      return handler.createPremintedOfferAddToGroup({
        ...createArgs,
        returnTxInfo: false
      });
    }
  }

  /**
   * Creates a seller account and preminted offer
   * This transaction only succeeds if there is no existing seller account for the connected signer.
   * @param sellerToCreate - Addresses to set in the seller account.
   * @param offerToCreate - Offer arguments.
   * @param premintParameters - Premint parameters.
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
  // Overload: returnTxInfo is true → returns TransactionRequest
  public async createSellerAndPremintedOffer(
    sellerToCreate: accounts.CreateSellerArgs,
    offerToCreate: offers.CreateOfferArgs,
    premintParameters: PremintParametersStruct,
    overrides: Partial<{
      contractAddress: string;
      returnTxInfo: true;
    }>
  ): Promise<TransactionRequest>;

  // Overload: returnTxInfo is false or undefined → returns TransactionResponse
  public async createSellerAndPremintedOffer(
    sellerToCreate: accounts.CreateSellerArgs,
    offerToCreate: offers.CreateOfferArgs,
    premintParameters: PremintParametersStruct,
    overrides?: Partial<{
      contractAddress: string;
      returnTxInfo?: false;
    }>
  ): Promise<TransactionResponse>;

  // Implementation
  public async createSellerAndPremintedOffer(
    sellerToCreate: accounts.CreateSellerArgs,
    offerToCreate: offers.CreateOfferArgs,
    premintParameters: PremintParametersStruct,
    overrides: Partial<{
      contractAddress: string;
      returnTxInfo?: boolean;
    }> = {}
  ): Promise<TransactionResponse | TransactionRequest> {
    const { returnTxInfo } = overrides;

    const createArgs = {
      sellerToCreate,
      offerToCreate,
      premintParameters,
      web3Lib: this._web3Lib,
      metadataStorage: this._metadataStorage,
      theGraphStorage: this._theGraphStorage,
      contractAddress: overrides.contractAddress || this._protocolDiamond
    } as const satisfies Parameters<
      typeof handler.createSellerAndPremintedOffer
    >[0];

    if (returnTxInfo === true) {
      return handler.createSellerAndPremintedOffer({
        ...createArgs,
        returnTxInfo: true
      });
    } else {
      return handler.createSellerAndPremintedOffer({
        ...createArgs,
        returnTxInfo: false
      });
    }
  }

  /**
   * Creates a preminted offer with condition
   * @param offerToCreate - Offer arguments.
   * @param premintParameters - Premint parameters.
   * @param condition - Contract condition applied to the offer.
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
  // Overload: returnTxInfo is true → returns TransactionRequest
  public async createPremintedOfferWithCondition(
    offerToCreate: offers.CreateOfferArgs,
    premintParameters: PremintParametersStruct,
    condition: ConditionStruct,
    overrides: Partial<{
      contractAddress: string;
      returnTxInfo: true;
    }>
  ): Promise<TransactionRequest>;

  // Overload: returnTxInfo is false or undefined → returns TransactionResponse
  public async createPremintedOfferWithCondition(
    offerToCreate: offers.CreateOfferArgs,
    premintParameters: PremintParametersStruct,
    condition: ConditionStruct,
    overrides?: Partial<{
      contractAddress: string;
      returnTxInfo?: false;
    }>
  ): Promise<TransactionResponse>;

  // Implementation
  public async createPremintedOfferWithCondition(
    offerToCreate: offers.CreateOfferArgs,
    premintParameters: PremintParametersStruct,
    condition: ConditionStruct,
    overrides: Partial<{
      contractAddress: string;
      returnTxInfo?: boolean;
    }> = {}
  ): Promise<TransactionResponse | TransactionRequest> {
    const { returnTxInfo } = overrides;

    const createArgs = {
      offerToCreate,
      premintParameters,
      condition,
      web3Lib: this._web3Lib,
      metadataStorage: this._metadataStorage,
      theGraphStorage: this._theGraphStorage,
      contractAddress: overrides.contractAddress || this._protocolDiamond
    } as const satisfies Parameters<
      typeof handler.createPremintedOfferWithCondition
    >[0];

    if (returnTxInfo === true) {
      return handler.createPremintedOfferWithCondition({
        ...createArgs,
        returnTxInfo: true
      });
    } else {
      return handler.createPremintedOfferWithCondition({
        ...createArgs,
        returnTxInfo: false
      });
    }
  }

  /**
   * Creates a seller account and preminted offer with a specific conditions
   * This transaction only succeeds if there is no existing seller account for the connected signer.
   * @param sellerToCreate - Addresses to set in the seller account.
   * @param offerToCreate - Offer arguments.
   * @param premintParameters - Premint parameters.
   * @param condition - Contract condition applied to the offer.
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
  // Overload: returnTxInfo is true → returns TransactionRequest
  public async createSellerAndPremintedOfferWithCondition(
    sellerToCreate: accounts.CreateSellerArgs,
    offerToCreate: offers.CreateOfferArgs,
    premintParameters: PremintParametersStruct,
    condition: ConditionStruct,
    overrides: Partial<{
      contractAddress: string;
      returnTxInfo: true;
    }>
  ): Promise<TransactionRequest>;

  // Overload: returnTxInfo is false or undefined → returns TransactionResponse
  public async createSellerAndPremintedOfferWithCondition(
    sellerToCreate: accounts.CreateSellerArgs,
    offerToCreate: offers.CreateOfferArgs,
    premintParameters: PremintParametersStruct,
    condition: ConditionStruct,
    overrides?: Partial<{
      contractAddress: string;
      returnTxInfo?: false;
    }>
  ): Promise<TransactionResponse>;

  // Implementation
  public async createSellerAndPremintedOfferWithCondition(
    sellerToCreate: accounts.CreateSellerArgs,
    offerToCreate: offers.CreateOfferArgs,
    premintParameters: PremintParametersStruct,
    condition: ConditionStruct,
    overrides: Partial<{
      contractAddress: string;
      returnTxInfo?: boolean;
    }> = {}
  ): Promise<TransactionResponse | TransactionRequest> {
    const { returnTxInfo } = overrides;

    const createArgs = {
      sellerToCreate,
      offerToCreate,
      premintParameters,
      condition,
      web3Lib: this._web3Lib,
      metadataStorage: this._metadataStorage,
      theGraphStorage: this._theGraphStorage,
      contractAddress: overrides.contractAddress || this._protocolDiamond
    } as const satisfies Parameters<
      typeof handler.createSellerAndPremintedOfferWithCondition
    >[0];

    if (returnTxInfo === true) {
      return handler.createSellerAndPremintedOfferWithCondition({
        ...createArgs,
        returnTxInfo: true
      });
    } else {
      return handler.createSellerAndPremintedOfferWithCondition({
        ...createArgs,
        returnTxInfo: false
      });
    }
  }

  /**
   * Raises a dispute and immediately escalates it
   * @param exchangeId - Exchange ID
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
  // Overload: returnTxInfo is true → returns TransactionRequest
  public async raiseAndEscalateDispute(
    exchangeId: BigNumberish,
    overrides: Partial<{
      contractAddress: string;
      returnTxInfo: true;
    }>
  ): Promise<TransactionRequest>;

  // Overload: returnTxInfo is false or undefined → returns TransactionResponse
  public async raiseAndEscalateDispute(
    exchangeId: BigNumberish,
    overrides?: Partial<{
      contractAddress: string;
      returnTxInfo?: false;
    }>
  ): Promise<TransactionResponse>;

  // Implementation
  public async raiseAndEscalateDispute(
    exchangeId: BigNumberish,
    overrides: Partial<{
      contractAddress: string;
      returnTxInfo?: boolean;
    }> = {}
  ): Promise<TransactionResponse | TransactionRequest> {
    const { returnTxInfo } = overrides;

    const disputeArgs = {
      exchangeId,
      web3Lib: this._web3Lib,
      metadataStorage: this._metadataStorage,
      theGraphStorage: this._theGraphStorage,
      contractAddress: overrides.contractAddress || this._protocolDiamond
    } as const satisfies Parameters<typeof handler.raiseAndEscalateDispute>[0];

    if (returnTxInfo === true) {
      return handler.raiseAndEscalateDispute({
        ...disputeArgs,
        returnTxInfo: true
      });
    } else {
      return handler.raiseAndEscalateDispute({
        ...disputeArgs,
        returnTxInfo: false
      });
    }
  }
}
