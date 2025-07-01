import {
  Web3LibAdapter,
  MetadataStorage,
  MetaTxConfig,
  ContractAddresses,
  Lens,
  ErrorFragment
} from "@bosonprotocol/common";
import { TokenInfoManager } from "../utils/tokenInfoManager";
import { Biconomy } from "../meta-tx/biconomy";

export class BaseCoreSDK<T extends Web3LibAdapter = Web3LibAdapter> {
  protected _web3Lib: T;
  protected _metadataStorage?: MetadataStorage;
  protected _theGraphStorage?: MetadataStorage;

  protected _subgraphUrl: string;
  protected _protocolDiamond: string;
  protected _chainId: number;
  protected _tokenInfoManager: TokenInfoManager;

  protected _errorsMap = new Map<string, ErrorFragment>();

  protected _metaTxConfig?: Partial<MetaTxConfig>;
  protected _lens?: Lens;
  protected _contracts?: ContractAddresses;
  protected _uuid: string;
  protected _getTxExplorerUrl?: (
    txHash?: string,
    isAddress?: boolean
  ) => string;

  /**
   * Creates an instance of `BaseCoreSDK`
   * @param args - Constructor args
   */
  constructor(opts: {
    web3Lib: T;
    subgraphUrl: string;
    protocolDiamond: string;
    metadataStorage?: MetadataStorage;
    theGraphStorage?: MetadataStorage;
    chainId: number;
    metaTx?: Partial<MetaTxConfig>;
    lens?: Lens;
    contracts?: ContractAddresses;
    getTxExplorerUrl?: (txHash?: string, isAddress?: boolean) => string;
  }) {
    this._web3Lib = opts.web3Lib;
    this._subgraphUrl = opts.subgraphUrl;
    this._protocolDiamond = opts.protocolDiamond;
    this._metadataStorage = opts.metadataStorage;
    this._theGraphStorage = opts.theGraphStorage;
    this._chainId = opts.chainId;
    this._metaTxConfig = opts.metaTx;
    this._lens = opts.lens;
    this._contracts = opts.contracts;
    this._uuid = crypto.randomUUID();
    this._getTxExplorerUrl = opts.getTxExplorerUrl;
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

  protected async assertAndGetMetaTxConfig2(
    overrides: Partial<{
      verifierAddress: string;
      metaTxConfig: Partial<Omit<MetaTxConfig, "apiIds"> & { apiId: string }>;
      metaTransactionMethod: string;
    }> = {}
  ) {
    const ret = this.assertAndGetMetaTxConfig(overrides);

    // Check the meta-tx gateway is ready and accepts relaying transaction to the targeted contract
    const biconomy = new Biconomy(
      ret.metaTxRelayerUrl,
      ret.metaTxApiKey,
      ret.metaTxApiId
    );
    const ready = await biconomy.check({
      contract: ret.contractAddress
    });

    return ready ? ret : undefined;
  }
}

// Doc: https://www.typescriptlang.org/docs/handbook/mixins.html#alternative-pattern
export function applyMixins(
  derivedCtor: typeof BaseCoreSDK<Web3LibAdapter>,
  constructors: (typeof BaseCoreSDK<Web3LibAdapter>)[]
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
