/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { BaseContract, BigNumber, BigNumberish, Signer, utils } from "ethers";
import { EventFragment } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export declare namespace BosonTypes {
  export type SellerStruct = {
    id: BigNumberish;
    assistant: string;
    admin: string;
    clerk: string;
    treasury: string;
    active: boolean;
  };

  export type SellerStructOutput = [
    BigNumber,
    string,
    string,
    string,
    string,
    boolean
  ] & {
    id: BigNumber;
    assistant: string;
    admin: string;
    clerk: string;
    treasury: string;
    active: boolean;
  };

  export type AuthTokenStruct = {
    tokenId: BigNumberish;
    tokenType: BigNumberish;
  };

  export type AuthTokenStructOutput = [BigNumber, number] & {
    tokenId: BigNumber;
    tokenType: number;
  };

  export type DisputeResolverStruct = {
    id: BigNumberish;
    escalationResponsePeriod: BigNumberish;
    assistant: string;
    admin: string;
    clerk: string;
    treasury: string;
    metadataUri: string;
    active: boolean;
  };

  export type DisputeResolverStructOutput = [
    BigNumber,
    BigNumber,
    string,
    string,
    string,
    string,
    string,
    boolean
  ] & {
    id: BigNumber;
    escalationResponsePeriod: BigNumber;
    assistant: string;
    admin: string;
    clerk: string;
    treasury: string;
    metadataUri: string;
    active: boolean;
  };
}

export interface IBosonAccountHandlerLegacyInterface extends utils.Interface {
  contractName: "IBosonAccountHandlerLegacy";
  functions: {};

  events: {
    "SellerUpdateApplied(uint256,tuple,tuple,tuple,tuple,address)": EventFragment;
    "SellerCreated(uint256,tuple,address,tuple,address)": EventFragment;
    "SellerUpdatePending(uint256,tuple,tuple,address)": EventFragment;
    "SellerUpdated(uint256,tuple,tuple,address)": EventFragment;
    "DisputeResolverUpdated(uint256,tuple,address)": EventFragment;
    "DisputeResolverActivated(uint256,tuple,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "SellerUpdateApplied"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SellerCreated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SellerUpdatePending"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SellerUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "DisputeResolverUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "DisputeResolverActivated"): EventFragment;
}

export type SellerUpdateAppliedEvent = TypedEvent<
  [
    BigNumber,
    BosonTypes.SellerStructOutput,
    BosonTypes.SellerStructOutput,
    BosonTypes.AuthTokenStructOutput,
    BosonTypes.AuthTokenStructOutput,
    string
  ],
  {
    sellerId: BigNumber;
    seller: BosonTypes.SellerStructOutput;
    pendingSeller: BosonTypes.SellerStructOutput;
    authToken: BosonTypes.AuthTokenStructOutput;
    pendingAuthToken: BosonTypes.AuthTokenStructOutput;
    executedBy: string;
  }
>;

export type SellerUpdateAppliedEventFilter =
  TypedEventFilter<SellerUpdateAppliedEvent>;

export type SellerCreatedEvent = TypedEvent<
  [
    BigNumber,
    BosonTypes.SellerStructOutput,
    string,
    BosonTypes.AuthTokenStructOutput,
    string
  ],
  {
    sellerId: BigNumber;
    seller: BosonTypes.SellerStructOutput;
    voucherCloneAddress: string;
    authToken: BosonTypes.AuthTokenStructOutput;
    executedBy: string;
  }
>;

export type SellerCreatedEventFilter = TypedEventFilter<SellerCreatedEvent>;

export type SellerUpdatePendingEvent = TypedEvent<
  [
    BigNumber,
    BosonTypes.SellerStructOutput,
    BosonTypes.AuthTokenStructOutput,
    string
  ],
  {
    sellerId: BigNumber;
    pendingSeller: BosonTypes.SellerStructOutput;
    pendingAuthToken: BosonTypes.AuthTokenStructOutput;
    executedBy: string;
  }
>;

export type SellerUpdatePendingEventFilter =
  TypedEventFilter<SellerUpdatePendingEvent>;

export type SellerUpdatedEvent = TypedEvent<
  [
    BigNumber,
    BosonTypes.SellerStructOutput,
    BosonTypes.AuthTokenStructOutput,
    string
  ],
  {
    sellerId: BigNumber;
    seller: BosonTypes.SellerStructOutput;
    authToken: BosonTypes.AuthTokenStructOutput;
    executedBy: string;
  }
>;

export type SellerUpdatedEventFilter = TypedEventFilter<SellerUpdatedEvent>;

export type DisputeResolverUpdatedEvent = TypedEvent<
  [BigNumber, BosonTypes.DisputeResolverStructOutput, string],
  {
    disputeResolverId: BigNumber;
    disputeResolver: BosonTypes.DisputeResolverStructOutput;
    executedBy: string;
  }
>;

export type DisputeResolverUpdatedEventFilter =
  TypedEventFilter<DisputeResolverUpdatedEvent>;

export type DisputeResolverActivatedEvent = TypedEvent<
  [BigNumber, BosonTypes.DisputeResolverStructOutput, string],
  {
    disputeResolverId: BigNumber;
    disputeResolver: BosonTypes.DisputeResolverStructOutput;
    executedBy: string;
  }
>;

export type DisputeResolverActivatedEventFilter =
  TypedEventFilter<DisputeResolverActivatedEvent>;

export interface IBosonAccountHandlerLegacy extends BaseContract {
  contractName: "IBosonAccountHandlerLegacy";
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IBosonAccountHandlerLegacyInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {};

  callStatic: {};

  filters: {
    "SellerUpdateApplied(uint256,tuple,tuple,tuple,tuple,address)"(
      sellerId?: BigNumberish | null,
      seller?: null,
      pendingSeller?: null,
      authToken?: null,
      pendingAuthToken?: null,
      executedBy?: string | null
    ): SellerUpdateAppliedEventFilter;
    SellerUpdateApplied(
      sellerId?: BigNumberish | null,
      seller?: null,
      pendingSeller?: null,
      authToken?: null,
      pendingAuthToken?: null,
      executedBy?: string | null
    ): SellerUpdateAppliedEventFilter;

    "SellerCreated(uint256,tuple,address,tuple,address)"(
      sellerId?: BigNumberish | null,
      seller?: null,
      voucherCloneAddress?: null,
      authToken?: null,
      executedBy?: string | null
    ): SellerCreatedEventFilter;
    SellerCreated(
      sellerId?: BigNumberish | null,
      seller?: null,
      voucherCloneAddress?: null,
      authToken?: null,
      executedBy?: string | null
    ): SellerCreatedEventFilter;

    "SellerUpdatePending(uint256,tuple,tuple,address)"(
      sellerId?: BigNumberish | null,
      pendingSeller?: null,
      pendingAuthToken?: null,
      executedBy?: string | null
    ): SellerUpdatePendingEventFilter;
    SellerUpdatePending(
      sellerId?: BigNumberish | null,
      pendingSeller?: null,
      pendingAuthToken?: null,
      executedBy?: string | null
    ): SellerUpdatePendingEventFilter;

    "SellerUpdated(uint256,tuple,tuple,address)"(
      sellerId?: BigNumberish | null,
      seller?: null,
      authToken?: null,
      executedBy?: string | null
    ): SellerUpdatedEventFilter;
    SellerUpdated(
      sellerId?: BigNumberish | null,
      seller?: null,
      authToken?: null,
      executedBy?: string | null
    ): SellerUpdatedEventFilter;

    "DisputeResolverUpdated(uint256,tuple,address)"(
      disputeResolverId?: BigNumberish | null,
      disputeResolver?: null,
      executedBy?: string | null
    ): DisputeResolverUpdatedEventFilter;
    DisputeResolverUpdated(
      disputeResolverId?: BigNumberish | null,
      disputeResolver?: null,
      executedBy?: string | null
    ): DisputeResolverUpdatedEventFilter;

    "DisputeResolverActivated(uint256,tuple,address)"(
      disputeResolverId?: BigNumberish | null,
      disputeResolver?: null,
      executedBy?: string | null
    ): DisputeResolverActivatedEventFilter;
    DisputeResolverActivated(
      disputeResolverId?: BigNumberish | null,
      disputeResolver?: null,
      executedBy?: string | null
    ): DisputeResolverActivatedEventFilter;
  };

  estimateGas: {};

  populateTransaction: {};
}
