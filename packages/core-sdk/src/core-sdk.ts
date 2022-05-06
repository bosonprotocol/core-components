import {
  Web3LibAdapter,
  TransactionResponse,
  getDefaultConfig,
  MetadataStorage,
  AnyMetadata,
  Log
} from "@bosonprotocol/common";
import { BigNumberish } from "@ethersproject/bignumber";
import * as accounts from "./accounts";
import * as exchanges from "./exchanges";
import * as offers from "./offers";
import * as orchestration from "./orchestration";
import * as erc20 from "./erc20";
import { getValueFromLogs } from "./utils/logs";
import { MultiQueryOpts } from "./utils/subgraph";

export class CoreSDK {
  private _web3Lib: Web3LibAdapter;
  private _metadataStorage?: MetadataStorage;
  private _theGraphStorage?: MetadataStorage;

  private _subgraphUrl: string;
  private _protocolDiamond: string;

  constructor(opts: {
    web3Lib: Web3LibAdapter;
    subgraphUrl: string;
    protocolDiamond: string;
    metadataStorage?: MetadataStorage;
    theGraphStorage?: MetadataStorage;
  }) {
    this._web3Lib = opts.web3Lib;
    this._subgraphUrl = opts.subgraphUrl;
    this._protocolDiamond = opts.protocolDiamond;
    this._metadataStorage = opts.metadataStorage;
    this._theGraphStorage = opts.theGraphStorage;
  }

  static fromDefaultConfig(args: {
    web3Lib: Web3LibAdapter;
    envName?: string;
    chainId?: number;
    metadataStorage?: MetadataStorage;
    theGraphStorage?: MetadataStorage;
  }) {
    const defaultConfig = getDefaultConfig({
      envName: args.envName,
      chainId: args.chainId
    });

    return new CoreSDK({
      web3Lib: args.web3Lib,
      metadataStorage: args.metadataStorage,
      theGraphStorage: args.theGraphStorage,
      subgraphUrl: defaultConfig.subgraphUrl,
      protocolDiamond: defaultConfig.contracts.protocolDiamond
    });
  }

  public async storeMetadata(metadata: AnyMetadata): Promise<string> {
    if (!this._metadataStorage) {
      throw new Error("No metadata storage set");
    }

    return this._metadataStorage.storeMetadata(metadata);
  }

  public async getMetadata(metadataHashOrUri: string): Promise<AnyMetadata> {
    if (!this._metadataStorage) {
      throw new Error("No metadata storage set");
    }

    return this._metadataStorage.getMetadata(metadataHashOrUri);
  }

  public async getSellerByOperator(
    operator: string
  ): Promise<accounts.RawSellerFromSubgraph> {
    return accounts.subgraph.getSellerByOperator(this._subgraphUrl, operator);
  }

  public async getSellerByClerk(
    clerk: string
  ): Promise<accounts.RawSellerFromSubgraph> {
    return accounts.subgraph.getSellerByClerk(this._subgraphUrl, clerk);
  }

  public async getSellerByAddress(
    address: string
  ): Promise<accounts.RawSellerFromSubgraph> {
    return accounts.subgraph.getSellerByAddress(this._subgraphUrl, address);
  }

  public async createSellerAndOffer(
    sellerToCreate: accounts.CreateSellerArgs,
    offerToCreate: offers.CreateOfferArgs,
    overrides: Partial<{
      contractAddress: string;
    }> = {}
  ): Promise<TransactionResponse> {
    return orchestration.handler.createOfferAndSeller({
      sellerToCreate,
      offerToCreate,
      web3Lib: this._web3Lib,
      theGraphStorage: this._theGraphStorage,
      metadataStorage: this._metadataStorage,
      contractAddress: overrides.contractAddress || this._protocolDiamond
    });
  }

  public async createOffer(
    offerToCreate: offers.CreateOfferArgs,
    overrides: Partial<{
      contractAddress: string;
    }> = {}
  ): Promise<TransactionResponse> {
    return offers.handler.createOffer({
      offerToCreate,
      web3Lib: this._web3Lib,
      theGraphStorage: this._theGraphStorage,
      metadataStorage: this._metadataStorage,
      contractAddress: overrides.contractAddress || this._protocolDiamond
    });
  }

  public getCreatedOfferIdFromLogs(logs: Log[]): string | null {
    const offerId = getValueFromLogs({
      iface: offers.iface.bosonOfferHandlerIface,
      logs,
      eventArgsKey: "offerId",
      eventName: "OfferCreated"
    });

    return (
      offerId ||
      getValueFromLogs({
        iface: orchestration.iface.bosonOrchestrationHandlerIface,
        logs,
        eventArgsKey: "offerId",
        eventName: "OfferCreated"
      })
    );
  }

  public async voidOffer(
    offerId: BigNumberish,
    overrides: Partial<{
      contractAddress: string;
    }> = {}
  ): Promise<TransactionResponse> {
    return offers.handler.voidOffer({
      offerId,
      web3Lib: this._web3Lib,
      subgraphUrl: this._subgraphUrl,
      contractAddress: overrides.contractAddress || this._protocolDiamond
    });
  }

  public async getOfferById(
    offerId: BigNumberish
  ): Promise<offers.RawOfferFromSubgraph> {
    return offers.subgraph.getOfferById(this._subgraphUrl, offerId);
  }

  public async getAllOffersOfSeller(
    sellerFilter: {
      operatorAddress: string;
      // TODO: add support for sellerId, adminAddress, clerkAddress, treasuryAddress
    },
    opts: MultiQueryOpts = {}
  ): Promise<offers.RawOfferFromSubgraph[]> {
    if (sellerFilter.operatorAddress) {
      return offers.subgraph.getAllOffersOfOperator(
        this._subgraphUrl,
        sellerFilter.operatorAddress,
        opts
      );
    }
    return [];
  }

  public async commitToOffer(
    offerId: BigNumberish,
    overrides: Partial<{
      buyer: string;
    }> = {}
  ): Promise<TransactionResponse> {
    return exchanges.handler.commitToOffer({
      buyer: overrides.buyer || (await this._web3Lib.getSignerAddress()),
      offerId,
      web3Lib: this._web3Lib,
      subgraphUrl: this._subgraphUrl,
      contractAddress: this._protocolDiamond
    });
  }

  public getCommittedExchangeIdFromLogs(logs: Log[]): string | null {
    return getValueFromLogs({
      iface: exchanges.iface.bosonExchangeHandlerIface,
      logs,
      eventArgsKey: "exchangeId",
      eventName: "BuyerCommitted"
    });
  }

  public async getExchangeTokenAllowance(
    exchangeToken: string,
    overrides: Partial<{
      spender: string;
      owner: string;
    }> = {}
  ): Promise<string> {
    return erc20.handler.getAllowance({
      web3Lib: this._web3Lib,
      contractAddress: exchangeToken,
      spender: overrides.spender || this._protocolDiamond,
      owner: overrides.owner || (await this._web3Lib.getSignerAddress())
    });
  }

  public async getExchangeTokenInfo(exchangeToken: string): Promise<{
    name: string;
    decimals: number;
    symbol: string;
  }> {
    const args = {
      web3Lib: this._web3Lib,
      contractAddress: exchangeToken
    };
    const [decimals, name, symbol] = await Promise.all([
      erc20.handler.getDecimals(args),
      erc20.handler.getName(args),
      erc20.handler.getSymbol(args)
    ]);

    return { decimals, name, symbol };
  }

  public async approveExchangeToken(
    exchangeToken: string,
    value: BigNumberish,
    overrides: Partial<{
      spender: string;
    }> = {}
  ): Promise<TransactionResponse> {
    return erc20.handler.approve({
      contractAddress: exchangeToken,
      spender: overrides.spender || this._protocolDiamond,
      value,
      web3Lib: this._web3Lib
    });
  }
}
