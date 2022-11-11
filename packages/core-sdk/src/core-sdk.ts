import { OrchestrationMixin } from "./orchestration/mixin";
import { GroupsMixin } from "./groups/mixin";
import { NativeMetaTxMixin } from "./native-meta-tx/mixin";
import { MetaTxMixin } from "./meta-tx/mixin";
import { DisputesMixin } from "./disputes/mixin";
import { applyMixins, BaseCoreSDK } from "./mixins/base-core-sdk";
import {
  Web3LibAdapter,
  getDefaultConfig,
  MetadataStorage,
  MetaTxConfig
} from "@bosonprotocol/common";
import { EnvironmentType } from "@bosonprotocol/common/src/types";

import { MetadataMixin } from "./metadata/mixin";
import { AccountsMixin } from "./accounts/mixin";
import { OfferMixin } from "./offers/mixin";
import { FundsMixin } from "./funds/mixin";
import { ExchangesMixin } from "./exchanges/mixin";
import { EventLogsMixin } from "./event-logs/mixin";

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
    NativeMetaTxMixin,
    GroupsMixin,
    OrchestrationMixin,
    EventLogsMixin {}
applyMixins(CoreSDK, [
  MetadataMixin,
  AccountsMixin,
  OfferMixin,
  FundsMixin,
  ExchangesMixin,
  DisputesMixin,
  MetaTxMixin,
  NativeMetaTxMixin,
  GroupsMixin,
  OrchestrationMixin,
  EventLogsMixin
]);
