import { NativeMetaTxMixin } from "./native-meta-tx/mixin";
import { MetaTxMixin } from "./meta-tx/mixin";
import { DisputesMixin } from "./disputes/mixin";
import { applyMixins, BaseCoreSDK } from "./mixins/base-core-sdk";
import {
  Web3LibAdapter,
  TransactionResponse,
  getDefaultConfig,
  MetadataStorage,
  MetaTxConfig,
  CreateGroupArgs,
  ConditionStruct
} from "@bosonprotocol/common";
import { EnvironmentType } from "@bosonprotocol/common/src/types";

import * as accounts from "./accounts";
import * as offers from "./offers";
import * as orchestration from "./orchestration";
import * as groups from "./groups";
import * as subgraph from "./subgraph";
import * as eventLogs from "./event-logs";

import { MetadataMixin } from "./metadata/mixin";
import { AccountsMixin } from "./accounts/mixin";
import { OfferMixin } from "./offers/mixin";
import { FundsMixin } from "./funds/mixin";
import { ExchangesMixin } from "./exchanges/mixin";

export class CoreSDK extends BaseCoreSDK {
  /**
   * Creates an instance of `CoreSDK` by using default values derived either from
   * `args.envName` or `args.chainId`.
   *
   * @example
   * Instance which uses the default contract address and subgraph url of mainnet:
   * ```ts
   * const coreSdk = CoreSDK.fromDefaultConfig({
   *   ...otherArgs,
   *   chainId: 137
   * })
   * ```
   *
   * @param args - Constructor args.
   * @returns CoreSDK instance with default values.
   */
  static fromDefaultConfig(args: {
    web3Lib: Web3LibAdapter;
    envName: EnvironmentType;
    metadataStorage?: MetadataStorage;
    theGraphStorage?: MetadataStorage;
    metaTx?: Partial<MetaTxConfig>;
  }) {
    const defaultConfig = getDefaultConfig(args.envName);

    return new CoreSDK({
      web3Lib: args.web3Lib,
      metadataStorage: args.metadataStorage,
      theGraphStorage: args.theGraphStorage,
      subgraphUrl: defaultConfig.subgraphUrl,
      protocolDiamond: defaultConfig.contracts.protocolDiamond,
      chainId: defaultConfig.chainId,
      metaTx: {
        ...defaultConfig.metaTx,
        ...args.metaTx
      },
      lensContracts: defaultConfig.lens
    });
  }

  public get metaTxConfig() {
    return this._metaTxConfig;
  }

  public get isMetaTxConfigSet() {
    return this.checkMetaTxConfigSet();
  }

  public checkMetaTxConfigSet(
    args: {
      contractAddress?: string;
      metaTransactionMethod?: string;
    } = {}
  ) {
    const contractAddress = (
      args.contractAddress || this._protocolDiamond
    ).toLowerCase();
    const metaTransactionMethod =
      args.metaTransactionMethod || "executeMetaTransaction";
    return (
      !!this._metaTxConfig &&
      !!this._metaTxConfig.apiIds &&
      !!this._metaTxConfig.apiIds[contractAddress] &&
      !!this._metaTxConfig.apiIds[contractAddress][metaTransactionMethod] &&
      !!this._metaTxConfig.apiKey &&
      !!this._metaTxConfig.relayerUrl
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                                 Event logs                                 */
  /* -------------------------------------------------------------------------- */

  /**
   * Returns event logs from subgraph.
   * @param queryVars - Optional query variables to skip, order or filter.
   * @returns Event log entities from subgraph.
   */
  public async getEventLogs(
    queryVars?: subgraph.GetEventLogsQueryQueryVariables
  ) {
    return eventLogs.subgraph.getEventLogs(this._subgraphUrl, queryVars);
  }

  /* -------------------------------------------------------------------------- */
  /*                             Groups                                         */
  /* -------------------------------------------------------------------------- */

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
    return groups.handler.createGroup({
      groupToCreate,
      contractAddress: overrides.contractAddress || this._protocolDiamond,
      web3Lib: this._web3Lib
    });
  }

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
    return orchestration.handler.createOfferWithCondition({
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
    return orchestration.handler.createSellerAndOfferWithCondition({
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

// Doc: https://www.typescriptlang.org/docs/handbook/mixins.html#alternative-pattern
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CoreSDK
  extends MetadataMixin,
    AccountsMixin,
    OfferMixin,
    FundsMixin,
    ExchangesMixin,
    DisputesMixin,
    MetaTxMixin,
    NativeMetaTxMixin {}
applyMixins(CoreSDK, [
  MetadataMixin,
  AccountsMixin,
  OfferMixin,
  FundsMixin,
  ExchangesMixin,
  DisputesMixin,
  MetaTxMixin,
  NativeMetaTxMixin
]);
