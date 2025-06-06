import { OrchestrationMixin } from "./orchestration/mixin";
import { GroupsMixin } from "./groups/mixin";
import { NativeMetaTxMixin } from "./native-meta-tx/mixin";
import { MetaTxMixin } from "./meta-tx/mixin";
import { DisputesMixin } from "./disputes/mixin";
import { applyMixins, BaseCoreSDK } from "./mixins/base-core-sdk";
import {
  Web3LibAdapter,
  getEnvConfigById,
  ConfigId,
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
import { VoucherMixin } from "./voucher/mixin";
import { ERC20Mixin } from "./erc20/mixin";
import { ERC721Mixin } from "./erc721/mixin";
import { ERC1155Mixin } from "./erc1155/mixin";
import { ERC165Mixin } from "./erc165/mixin";
import { ProtocolConfigMixin } from "./protocol-config/mixin";
import { ErrorMixin } from "./errors/mixin";
import { SubgraphMixin } from "./subgraph/mixin";
import { PriceDiscoveryMixin } from "./price-discovery/mixin";
import { MarketplaceMixin } from "./marketplaces/mixin";

export class CoreSDK<T extends Web3LibAdapter> extends BaseCoreSDK<T> {
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
  static fromDefaultConfig<T extends Web3LibAdapter>(args: {
    web3Lib: T;
    envName: EnvironmentType;
    configId: ConfigId;
    metadataStorage?: MetadataStorage;
    theGraphStorage?: MetadataStorage;
    metaTx?: Partial<MetaTxConfig>;
  }) {
    const defaultConfig = getEnvConfigById(args.envName, args.configId);

    return new CoreSDK<T>({
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
      lens: defaultConfig.lens,
      contracts: defaultConfig.contracts
    });
  }

  public get lens() {
    return this._lens;
  }

  public get contracts() {
    return this._contracts;
  }

  public get subgraphUrl() {
    return this._subgraphUrl;
  }

  public get metaTxConfig() {
    return this._metaTxConfig;
  }

  public get isMetaTxConfigSet() {
    return this.checkMetaTxConfigSet();
  }

  public get getTxExplorerUrl() {
    return this._getTxExplorerUrl as (
      txHash?: string,
      isAddress?: boolean
    ) => string;
  }

  public get web3Lib() {
    return this._web3Lib;
  }

  public get uuid() {
    return this._uuid;
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
export interface CoreSDK<T extends Web3LibAdapter = Web3LibAdapter>
  extends MetadataMixin<T>,
    AccountsMixin<T>,
    OfferMixin<T>,
    FundsMixin<T>,
    ExchangesMixin<T>,
    DisputesMixin<T>,
    MetaTxMixin<T>,
    NativeMetaTxMixin<T>,
    GroupsMixin<T>,
    OrchestrationMixin<T>,
    EventLogsMixin<T>,
    VoucherMixin<T>,
    ERC20Mixin<T>,
    ERC721Mixin<T>,
    ERC1155Mixin<T>,
    ERC165Mixin<T>,
    ProtocolConfigMixin<T>,
    ErrorMixin<T>,
    SubgraphMixin<T>,
    PriceDiscoveryMixin<T>,
    MarketplaceMixin<T> {}
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
  EventLogsMixin,
  VoucherMixin,
  ERC20Mixin,
  ERC721Mixin,
  ERC1155Mixin,
  ERC165Mixin,
  ProtocolConfigMixin,
  ErrorMixin,
  SubgraphMixin,
  PriceDiscoveryMixin,
  MarketplaceMixin
]);
