import {
  Web3LibAdapter,
  MetadataStorage,
  MetaTxConfig,
  LensContracts
} from "@bosonprotocol/common";
import { TokenInfoManager } from "../utils/tokenInfoManager";

export class BaseCoreSDK {
  protected _web3Lib: Web3LibAdapter;
  protected _metadataStorage?: MetadataStorage;
  protected _theGraphStorage?: MetadataStorage;

  protected _subgraphUrl: string;
  protected _protocolDiamond: string;
  protected _chainId: number;
  protected _tokenInfoManager: TokenInfoManager;

  protected _metaTxConfig?: Partial<MetaTxConfig>;
  protected _lensContracts?: LensContracts;

  /**
   * Creates an instance of `BaseCoreSDK`
   * @param args - Constructor args
   */
  constructor(opts: {
    web3Lib: Web3LibAdapter;
    subgraphUrl: string;
    protocolDiamond: string;
    metadataStorage?: MetadataStorage;
    theGraphStorage?: MetadataStorage;
    chainId: number;
    metaTx?: Partial<MetaTxConfig>;
    lensContracts?: LensContracts;
  }) {
    this._web3Lib = opts.web3Lib;
    this._subgraphUrl = opts.subgraphUrl;
    this._protocolDiamond = opts.protocolDiamond;
    this._metadataStorage = opts.metadataStorage;
    this._theGraphStorage = opts.theGraphStorage;
    this._chainId = opts.chainId;
    this._metaTxConfig = opts.metaTx;
    this._lensContracts = opts.lensContracts;
  }

  protected assertAndGetMetaTxConfig(
    overrides: Partial<{
      contractAddress: string;
      metaTxConfig: Partial<Omit<MetaTxConfig, "apiIds"> & { apiId: string }>;
      metaTransactionMethod: string;
    }> = {}
  ) {
    const contractAddress = overrides.contractAddress || this._protocolDiamond;
    const metaTransactionMethod =
      overrides.metaTransactionMethod || "executeMetaTransaction";
    const metaTxRelayerUrl =
      overrides.metaTxConfig?.relayerUrl || this._metaTxConfig?.relayerUrl;
    const metaTxApiKey =
      overrides.metaTxConfig?.apiKey || this._metaTxConfig?.apiKey;
    // metaTxApiId is depending on the contract/method(=executeMetaTransaction) to be called with Biconomy
    const apiIds = this._metaTxConfig?.apiIds[contractAddress.toLowerCase()];
    const metaTxApiId =
      overrides.metaTxConfig?.apiId ||
      (apiIds && apiIds[metaTransactionMethod]);

    if (!(metaTxRelayerUrl && metaTxApiKey && metaTxApiId)) {
      throw new Error(
        "CoreSDK not configured to relay meta transactions. Either pass in 'relayerUrl', 'apiKey' and 'apiId' during initialization OR as overrides arguments."
      );
    }

    return {
      metaTxRelayerUrl,
      metaTxApiId,
      metaTxApiKey,
      contractAddress
    };
  }
}

// Doc: https://www.typescriptlang.org/docs/handbook/mixins.html#alternative-pattern
export function applyMixins(
  derivedCtor: typeof BaseCoreSDK,
  constructors: typeof BaseCoreSDK[]
) {
  constructors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
          Object.create(null)
      );
    });
  });
}
