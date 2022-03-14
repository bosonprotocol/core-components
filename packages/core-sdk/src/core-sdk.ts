import {
  Web3LibAdapter,
  TransactionResponse,
  defaultConfigs,
  MetadataStorage,
  Metadata,
  Log
} from "@bosonprotocol/common";
import { BigNumberish } from "@ethersproject/bignumber";
import * as offers from "./offers";
import * as erc20 from "./erc20";

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
  }

  static async fromDefaultConfig(opts: {
    web3Lib: Web3LibAdapter;
    metadataStorage?: MetadataStorage;
    theGraphStorage?: MetadataStorage;
    envName?: string;
    chainId?: number;
  }) {
    const fallbackChainId = await opts.web3Lib.getChainId();

    const [defaultConfig] = defaultConfigs.filter((config) => {
      if (opts.envName) {
        return config.envName === opts.envName;
      }

      return config.chainId === (opts.chainId || fallbackChainId);
    });

    if (!defaultConfig) {
      throw new Error(
        `Could not find default config for ${JSON.stringify(
          opts.envName
            ? { envName: opts.envName }
            : {
                chainId: opts.chainId || fallbackChainId
              }
        )}`
      );
    }

    return new CoreSDK({
      web3Lib: opts.web3Lib,
      metadataStorage: opts.metadataStorage,
      theGraphStorage: opts.theGraphStorage,
      subgraphUrl: defaultConfig.subgraphUrl,
      protocolDiamond: defaultConfig.contracts.protocolDiamond
    });
  }

  public async storeMetadata(metadata: Metadata): Promise<string> {
    if (!this._metadataStorage) {
      throw new Error("No metadataStorage set");
    }

    return this._metadataStorage.storeMetadata(metadata);
  }

  public async createOffer(
    offerToCreate: offers.CreateOfferArgs,
    opts: Partial<{
      contractAddress: string;
    }> = {}
  ): Promise<TransactionResponse> {
    return offers.handler.createOffer({
      offerToCreate,
      web3Lib: this._web3Lib,
      theGraphStorage: this._theGraphStorage,
      metadataStorage: this._metadataStorage,
      contractAddress: opts.contractAddress || this._protocolDiamond
    });
  }

  public getCreatedOfferIdFromLogs(logs: Log[]): string | null {
    return offers.iface.getCreatedOfferIdFromLogs(logs);
  }

  public async getOfferById(
    offerId: BigNumberish
  ): Promise<offers.RawOfferFromSubgraph> {
    return offers.subgraph.getOfferById(this._subgraphUrl, offerId);
  }

  public async getExchangeTokenAllowance(
    exchangeToken: string
  ): Promise<string> {
    return erc20.handler.getAllowance({
      web3Lib: this._web3Lib,
      contractAddress: exchangeToken,
      spender: this._protocolDiamond,
      owner: await this._web3Lib.getSignerAddress()
    });
  }

  public async getExchangeTokenInfo(exchangeToken: string): Promise<{
    name: string;
    decimals: number;
    symbol: string;
  }> {
    return erc20.handler.getTokenInfo({
      contractAddress: exchangeToken,
      web3Lib: this._web3Lib
    });
  }
}
