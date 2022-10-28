import { ITokenInfo, TokenInfoManager } from "./utils/tokenInfoManager";
import {
  Web3LibAdapter,
  TransactionResponse,
  getDefaultConfig,
  MetadataStorage,
  AnyMetadata,
  Log,
  MetaTxConfig,
  LensContracts,
  AuthTokenType,
  CreateGroupArgs,
  ConditionStruct
} from "@bosonprotocol/common";
import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { AddressZero } from "@ethersproject/constants";
import { BytesLike } from "@ethersproject/bytes";
import { EnvironmentType } from "@bosonprotocol/common/src/types";

import * as accounts from "./accounts";
import * as disputes from "./disputes";
import * as exchanges from "./exchanges";
import * as offers from "./offers";
import * as orchestration from "./orchestration";
import * as groups from "./groups";
import * as erc20 from "./erc20";
import * as erc721 from "./erc721";
import * as funds from "./funds";
import * as metaTx from "./meta-tx";
import * as nativeMetaTx from "./native-meta-tx";
import * as metadata from "./metadata";
import * as subgraph from "./subgraph";
import * as eventLogs from "./event-logs";

import { getValueFromLogs, getValuesFromLogs } from "./utils/logs";
import { GetRetriedHashesData } from "./meta-tx/biconomy";

export class CoreSDK {
  private _web3Lib: Web3LibAdapter;
  private _metadataStorage?: MetadataStorage;
  private _theGraphStorage?: MetadataStorage;

  private _subgraphUrl: string;
  private _protocolDiamond: string;
  private _chainId: number;
  private _tokenInfoManager: TokenInfoManager;

  private _metaTxConfig?: Partial<MetaTxConfig>;
  private _lensContracts?: LensContracts;

  /**
   * Creates an instance of `CoreSDK`
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
  /*                          Metadata related methods                          */
  /* -------------------------------------------------------------------------- */

  /**
   * Stores supported offer metadata via the MetadataStorage instance which was passed in
   * at construction.
   * @param metadata - Offer metadata of type `BASE` or `PRODUCT_V1`.
   * @returns Metadata hash / identifier.
   */
  public async storeMetadata(metadata: AnyMetadata): Promise<string> {
    if (!this._metadataStorage) {
      throw new Error("No metadata storage set");
    }

    return this._metadataStorage.storeMetadata(metadata);
  }

  /**
   * Returns supported offer metadata from passed in `MetadataStorage` instance.
   * @param metadataHashOrUri - Metadata hash or uri that can be handled by the
   * storage instance.
   * @returns Offer metadata.
   */
  public async getMetadata(metadataHashOrUri: string): Promise<AnyMetadata> {
    if (!this._metadataStorage) {
      throw new Error("No metadata storage set");
    }

    return this._metadataStorage.getMetadata(metadataHashOrUri);
  }

  /**
   * Returns `BASE` type offer metadata entities from subgraph.
   * @param queryVars - Optional query variables to skip, order or filter.
   * @returns BaseMetadataEntities from subgraph.
   */
  public async getBaseMetadataEntities(
    queryVars?: subgraph.GetBaseMetadataEntitiesQueryQueryVariables
  ): Promise<subgraph.BaseMetadataEntityFieldsFragment[]> {
    return metadata.subgraph.getBaseMetadataEntities(
      this._subgraphUrl,
      queryVars
    );
  }

  /**
   * Returns `PRODUCT_V1` type offer metadata entities from subgraph.
   * @param queryVars - Optional query variables to skip, order or filter.
   * @returns ProductV1MetadataEntities from subgraph.
   */
  public async getProductV1MetadataEntities(
    queryVars?: subgraph.GetProductV1MetadataEntitiesQueryQueryVariables
  ): Promise<subgraph.ProductV1MetadataEntityFieldsFragment[]> {
    return metadata.subgraph.getProductV1MetadataEntities(
      this._subgraphUrl,
      queryVars
    );
  }

  public async getProductV1Products(
    queryVars?: subgraph.GetProductV1ProductsQueryQueryVariables
  ): Promise<subgraph.BaseProductV1ProductFieldsFragment[]> {
    return metadata.subgraph.getProductV1Products(this._subgraphUrl, queryVars);
  }

  public async getProductWithVariants(productUuid: string): Promise<{
    product: subgraph.BaseProductV1ProductFieldsFragment;
    variants: Array<{
      offer: subgraph.OfferFieldsFragment;
      variations: Array<subgraph.ProductV1Variation>;
    }>;
  } | null> {
    return metadata.subgraph.getProductWithVariants(
      this._subgraphUrl,
      productUuid
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                           Account related methods                          */
  /* -------------------------------------------------------------------------- */

  /* --------------------------------- Seller --------------------------------- */

  /**
   * Returns seller entity from subgraph.
   * @param sellerId - ID of seller entity to query for.
   * @param queryVars - Optional query variables to skip, order or filter.
   * @returns Seller entity from subgraph.
   */
  public async getSellerById(
    sellerId: BigNumberish,
    queryVars?: accounts.subgraph.SingleSellerQueryVariables
  ): Promise<subgraph.SellerFieldsFragment> {
    return accounts.subgraph.getSellerById(
      this._subgraphUrl,
      sellerId,
      queryVars
    );
  }

  /**
   * Returns seller entity from subgraph.
   * @param operator - Operator address of seller entity to query for.
   * @param queryVars - Optional query variables to skip, order or filter.
   * @returns Seller entity from subgraph.
   */
  public async getSellerByOperator(
    operator: string,
    queryVars?: subgraph.GetSellersQueryQueryVariables
  ): Promise<subgraph.SellerFieldsFragment> {
    return accounts.subgraph.getSellerByOperator(
      this._subgraphUrl,
      operator,
      queryVars
    );
  }

  /**
   * Returns seller entity from subgraph.
   * @param clerk - Clerk address of seller entity to query for.
   * @param queryVars - Optional query variables to skip, order or filter.
   * @returns Seller entity from subgraph.
   */
  public async getSellerByClerk(
    clerk: string,
    queryVars?: subgraph.GetSellersQueryQueryVariables
  ): Promise<subgraph.SellerFieldsFragment> {
    return accounts.subgraph.getSellerByClerk(
      this._subgraphUrl,
      clerk,
      queryVars
    );
  }

  /**
   * Returns seller entity from subgraph.
   * @param admin - Admin address of seller entity to query for.
   * @param queryVars - Optional query variables to skip, order or filter.
   * @returns Seller entity from subgraph.
   */
  public async getSellerByAdmin(
    admin: string,
    queryVars?: subgraph.GetSellersQueryQueryVariables
  ): Promise<subgraph.SellerFieldsFragment> {
    return accounts.subgraph.getSellerByAdmin(
      this._subgraphUrl,
      admin,
      queryVars
    );
  }

  /**
   * Returns seller entity from subgraph.
   * @param treasury - Treasury address of seller entity to query for.
   * @param queryVars - Optional query variables to skip, order or filter.
   * @returns Seller entity from subgraph.
   */
  public async getSellerByTreasury(
    treasury: string,
    queryVars?: subgraph.GetSellersQueryQueryVariables
  ): Promise<subgraph.SellerFieldsFragment> {
    return accounts.subgraph.getSellerByTreasury(
      this._subgraphUrl,
      treasury,
      queryVars
    );
  }

  /**
   * Returns seller entity from subgraph. Matches `operator`, `clerk`, `admin` or `treasury`.
   * @param address - Address of seller entity to query for.
   * @param queryVars - Optional query variables to skip, order or filter.
   * @returns Seller entity from subgraph.
   */
  public async getSellersByAddress(
    address: string,
    queryVars?: subgraph.GetSellersQueryQueryVariables
  ): Promise<subgraph.SellerFieldsFragment[]> {
    if (address === AddressZero) {
      throw new Error(`Unsupported search address '${AddressZero}'`);
    }
    const seller = await accounts.subgraph.getSellerByAddress(
      this._subgraphUrl,
      address,
      queryVars
    );
    if (!seller && this._lensContracts?.LENS_HUB_CONTRACT) {
      // If seller is not found per address, try to find per authToken
      const tokenType = AuthTokenType.LENS; // only LENS for now
      const tokenIds = await this.fetchUserAuthTokens(address, tokenType);
      const promises: Promise<subgraph.SellerFieldsFragment>[] = [];
      for (const tokenId of tokenIds) {
        // Just in case the user owns several auth tokens
        const sellerPromise = this.getSellerByAuthToken(
          tokenId,
          tokenType,
          queryVars
        );
        promises.push(sellerPromise);
      }
      return (await Promise.all(promises)).filter((seller) => !!seller);
    }
    return [seller].filter((seller) => !!seller);
  }

  /**
   * Returns the array of LENS tokenIds owned by a specified address
   * @param address - Address of seller entity to query for.
   * @param queryVars - Optional query variables to skip, order or filter.
   * @returns Array of tokenIds
   */
  public async fetchUserAuthTokens(
    address: string,
    tokenType: number
  ): Promise<Array<string>> {
    if (tokenType !== AuthTokenType.LENS) {
      // only LENS for now
      throw new Error(`Unsupported authTokenType '${tokenType}'`);
    }
    if (!this._lensContracts || !this._lensContracts?.LENS_HUB_CONTRACT) {
      throw new Error("LENS contract is not configured in Core-SDK");
    }
    const balance = await erc721.handler.balanceOf({
      contractAddress: this._lensContracts?.LENS_HUB_CONTRACT,
      owner: address,
      web3Lib: this._web3Lib
    });

    const balanceBN = BigNumber.from(balance);
    const promises: Promise<string>[] = [];
    for (let index = 0; balanceBN.gt(index); index++) {
      const tokenIdPromise = erc721.handler.tokenOfOwnerByIndex({
        contractAddress: this._lensContracts?.LENS_HUB_CONTRACT,
        owner: address,
        index,
        web3Lib: this._web3Lib
      });
      promises.push(tokenIdPromise);
    }
    const ret = await Promise.all(promises);
    return ret;
  }

  /**
   * Returns seller entity from subgraph that owns the given auth token (if any).
   * @param tokenId - tokenId of the Auth Token.
   * @param tokenType - Type of the Auth Token (1 for LENS, ...).
   * @param queryVars - Optional query variables to skip, order or filter.
   * @returns Seller entity from subgraph.
   */
  public async getSellerByAuthToken(
    tokenId: string,
    tokenType: number,
    queryVars?: subgraph.GetSellersQueryQueryVariables
  ): Promise<subgraph.SellerFieldsFragment> {
    if (tokenType !== AuthTokenType.LENS) {
      // only LENS for now
      throw new Error(`Unsupported authTokenType '${tokenType}'`);
    }
    return accounts.subgraph.getSellerByAuthToken(
      this._subgraphUrl,
      tokenId,
      tokenType,
      queryVars
    );
  }

  /**
   * Returns seller entities from subgraph.
   * @param queryVars - Optional query variables to skip, order or filter.
   * @returns Seller entities from subgraph.
   */
  public async getSellers(
    queryVars?: subgraph.GetSellersQueryQueryVariables
  ): Promise<subgraph.SellerFieldsFragment[]> {
    return accounts.subgraph.getSellers(this._subgraphUrl, queryVars);
  }

  /**
   * Creates seller account by calling the `AccountHandlerFacet` contract.
   * @param sellerToCreate - Addresses and contract URI to set in the seller account.
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
  public async createSeller(
    sellerToCreate: accounts.CreateSellerArgs,
    overrides: Partial<{
      contractAddress: string;
    }> = {}
  ): Promise<TransactionResponse> {
    return accounts.handler.createSeller({
      sellerToCreate,
      web3Lib: this._web3Lib,
      contractAddress: overrides.contractAddress || this._protocolDiamond
    });
  }

  /**
   * Creates seller account and offer by calling the `OrchestrationHandlerFacet` contract.
   * This transaction only succeeds if there is no existing seller account for the connected signer.
   * @param sellerToCreate - Addresses to set in the seller account.
   * @param offerToCreate - Offer arguments.
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
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

  /**
   * Updates seller account by calling the `AccountHandlerFacet` contract. Only callable
   * by admin.
   * @param sellerUpdates - Values to update.
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
  public async updateSeller(
    sellerUpdates: accounts.UpdateSellerArgs,
    overrides: Partial<{
      contractAddress: string;
    }> = {}
  ): Promise<TransactionResponse> {
    return accounts.handler.updateSeller({
      sellerUpdates,
      web3Lib: this._web3Lib,
      contractAddress: overrides.contractAddress || this._protocolDiamond
    });
  }

  /* ---------------------------------- Buyer --------------------------------- */

  /**
   * Returns buyer entity from subgraph.
   * @param buyerId - ID of buyer entity to query for.
   * @param queryVars - Optional query variables to skip, order or filter.
   * @returns Buyer entity from subgraph.
   */
  public async getBuyerById(
    buyerId: BigNumberish,
    queryVars?: accounts.subgraph.SingleBuyerQueryVariables
  ): Promise<subgraph.BuyerFieldsFragment> {
    return accounts.subgraph.getBuyerById(
      this._subgraphUrl,
      buyerId,
      queryVars
    );
  }

  /**
   * Returns buyer entities from subgraph.
   * @param queryVars - Optional query variables to skip, order or filter.
   * @returns Buyer entities from subgraph.
   */
  public async getBuyers(
    queryVars?: subgraph.GetBuyersQueryQueryVariables
  ): Promise<subgraph.BuyerFieldsFragment[]> {
    return accounts.subgraph.getBuyers(this._subgraphUrl, queryVars);
  }

  /* ---------------------------- Dispute Resolver ---------------------------- */

  /**
   * Creates a dispute resolver account by calling the `AccountHandlerFacet` contract.
   * @param disputeResolverToCreate - Dispute resolver arguments.
   * @returns Transaction response.
   */
  public async createDisputeResolver(
    disputeResolverToCreate: accounts.CreateDisputeResolverArgs
  ): Promise<TransactionResponse> {
    return accounts.handler.createDisputeResolver({
      disputeResolverToCreate,
      contractAddress: this._protocolDiamond,
      web3Lib: this._web3Lib
    });
  }

  /**
   * Utility method to retrieve the created `exchangeId` from logs after calling `commitToOffer`.
   * @param logs - Logs to search in.
   * @returns Created exchange id.
   */
  public getDisputeResolverIdFromLogs(logs: Log[]): string | null {
    return getValueFromLogs({
      iface: accounts.iface.bosonAccountHandlerIface,
      logs,
      eventArgsKey: "disputeResolverId",
      eventName: "DisputeResolverCreated"
    });
  }

  /**
   * Updates a dispute resolver account by calling the `AccountHandlerFacet` contract.
   * Note, that the caller must be the specified `admin` address of the dispute resolver account.
   * @param disputeResolverId - Id of dispute resolver to update.
   * @param updates - Values to update for the given dispute resolver.
   * @returns Transaction response.
   */
  public async updateDisputeResolver(
    disputeResolverId: BigNumberish,
    updates: accounts.DisputeResolverUpdates
  ): Promise<TransactionResponse> {
    return accounts.handler.updateDisputeResolver({
      disputeResolverId,
      updates,
      subgraphUrl: this._subgraphUrl,
      contractAddress: this._protocolDiamond,
      web3Lib: this._web3Lib
    });
  }

  /**
   * Activates a dispute resolver account by calling the `AccountHandlerFacet` contract.
   * Note, that the caller needs to have the ADMIN role.
   * @param disputeResolverId - Id of dispute resolver to activate.
   * @returns Transaction response.
   */
  public async activateDisputeResolver(
    disputeResolverId: BigNumberish
  ): Promise<TransactionResponse> {
    return accounts.handler.activateDisputeResolver({
      disputeResolverId,
      contractAddress: this._protocolDiamond,
      web3Lib: this._web3Lib
    });
  }

  /**
   * Adds fees to a dispute resolver account by calling the `AccountHandlerFacet`
   * contract. Note, that the caller must be the specified `admin` address of the dispute
   * resolver account.
   * @param disputeResolverId - Id of dispute resolver.
   * @param fees - Dispute resolution fees. Should only contain token addresses that are
   * not already specified.
   * @returns Transaction response.
   */
  public async addFeesToDisputeResolver(
    disputeResolverId: BigNumberish,
    fees: accounts.DisputeResolutionFee[]
  ): Promise<TransactionResponse> {
    return accounts.handler.addFeesToDisputeResolver({
      disputeResolverId,
      fees,
      contractAddress: this._protocolDiamond,
      web3Lib: this._web3Lib
    });
  }

  /**
   * Adds sellers to the allow list of a dispute resolver account by calling the
   * `AccountHandlerFacet` contract. Note, that the caller must be the specified
   * `admin` address of the dispute resolver account.
   * @param disputeResolverId - Id of dispute resolver.
   * @param sellerAllowList - List of seller ids that are allowed to use the dispute resolver.
   *  Should only contain seller ids that are not part of the current allow list.
   * @returns Transaction response.
   */
  public async addSellersToDisputeResolverAllowList(
    disputeResolverId: BigNumberish,
    sellerAllowList: BigNumberish[]
  ): Promise<TransactionResponse> {
    return accounts.handler.addSellersToAllowList({
      disputeResolverId,
      sellerAllowList,
      contractAddress: this._protocolDiamond,
      web3Lib: this._web3Lib
    });
  }

  /**
   * Removes fees from a dispute resolver account by calling the `AccountHandlerFacet`
   * contract. Note, that the caller must be the specified `admin` address of the dispute
   * resolver account.
   * @param disputeResolverId - Id of dispute resolver.
   * @param feeTokenAddresses - Addresses of fee tokens to remove.
   * @returns Transaction response.
   */
  public async removeFeesFromDisputeResolver(
    disputeResolverId: BigNumberish,
    feeTokenAddresses: string[]
  ): Promise<TransactionResponse> {
    return accounts.handler.removeFeesFromDisputeResolver({
      disputeResolverId,
      feeTokenAddresses,
      contractAddress: this._protocolDiamond,
      web3Lib: this._web3Lib
    });
  }

  /**
   * Removes sellers from the allow list of a dispute resolver account by calling the
   * `AccountHandlerFacet` contract. Note, that the caller must be the specified
   * `admin` address of the dispute resolver account.
   * @param disputeResolverId - Id of dispute resolver.
   * @param sellerAllowList - List of seller ids that should be removed from the allow
   * list of a dispute resolver.
   * @returns Transaction response.
   */
  public async removeSellersFromDisputeResolverAllowList(
    disputeResolverId: BigNumberish,
    sellerAllowList: string[]
  ): Promise<TransactionResponse> {
    return accounts.handler.removeSellersFromAllowList({
      disputeResolverId,
      sellerAllowList,
      contractAddress: this._protocolDiamond,
      web3Lib: this._web3Lib
    });
  }

  /**
   * Returns dispute resolver entity from subgraph.
   * @param disputeResolverId - ID of dispute resolver entity to query for.
   * @param queryVars - Optional query variables to skip, order or filter.
   * @returns Dispute resolver entity from subgraph.
   */
  public async getDisputeResolverById(
    disputeResolverId: BigNumberish,
    queryVars?: accounts.subgraph.SingleDisputeResolverQueryVariables
  ): Promise<subgraph.DisputeResolverFieldsFragment> {
    return accounts.subgraph.getDisputeResolverById(
      this._subgraphUrl,
      disputeResolverId,
      queryVars
    );
  }

  /**
   * Returns dispute resolver entities from subgraph.
   * @param queryVars - Optional query variables to skip, order or filter.
   * @returns Dispute resolver entities from subgraph.
   */
  public async getDisputeResolvers(
    queryVars?: subgraph.GetDisputeResolversQueryQueryVariables
  ): Promise<subgraph.DisputeResolverFieldsFragment[]> {
    return accounts.subgraph.getDisputeResolvers(this._subgraphUrl, queryVars);
  }

  /* -------------------------------------------------------------------------- */
  /*                            Offer related methods                           */
  /* -------------------------------------------------------------------------- */

  /**
   * Creates offer by calling the `OfferHandlerFacet` contract.
   * This transaction only succeeds if there is an existing seller account for connected signer.
   * @param offerToCreate - Offer arguments.
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
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

  /**
   * Creates a batch of offers by calling the `OfferHandlerFacet` contract.
   * This transaction only succeeds if there is an existing seller account for connected signer.
   * @param offersToCreate - Offer arguments.
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
  public async createOfferBatch(
    offersToCreate: offers.CreateOfferArgs[],
    overrides: Partial<{
      contractAddress: string;
    }> = {}
  ): Promise<TransactionResponse> {
    return offers.handler.createOfferBatch({
      offersToCreate,
      web3Lib: this._web3Lib,
      theGraphStorage: this._theGraphStorage,
      metadataStorage: this._metadataStorage,
      contractAddress: overrides.contractAddress || this._protocolDiamond
    });
  }

  /**
   * Utility method to retrieve the created `offerId` from logs after calling `createOffer`
   * or `createOfferAndSeller`.
   * @param logs - Logs to search in.
   * @returns Created offer id.
   */
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

  /**
   * Utility method to retrieve the created `offerIds` from logs after calling `createOfferBatch`
   * @param logs - Logs to search in.
   * @returns Array of created offerIds.
   */
  public getCreatedOfferIdsFromLogs(logs: Log[]): string[] {
    return getValuesFromLogs({
      iface: offers.iface.bosonOfferHandlerIface,
      logs,
      eventArgsKey: "offerId",
      eventName: "OfferCreated"
    });
  }

  /**
   * Utility method to retrieve the created `groupIds` from logs after calling `createGroup`
   * @param logs - Logs to search in.
   * @returns Array of group Ids.
   */
  public getCreatedGroupIdsFromLogs(logs: Log[]): string[] {
    return getValuesFromLogs({
      iface: groups.iface.bosonGroupHandlerIface,
      logs,
      eventArgsKey: "groupId",
      eventName: "GroupCreated"
    });
  }

  /**
   * Utility method to retrieve the created `sellerId` from logs after calling `createSeller`
   * or `createOfferAndSeller`.
   * @param logs - Logs to search in.
   * @returns Created offer id.
   */
  public getCreatedSellerIdFromLogs(logs: Log[]): string | null {
    const sellerId = getValueFromLogs({
      iface: accounts.iface.bosonAccountHandlerIface,
      logs,
      eventArgsKey: "sellerId",
      eventName: "SellerCreated"
    });

    return (
      sellerId ||
      getValueFromLogs({
        iface: orchestration.iface.bosonOrchestrationHandlerIface,
        logs,
        eventArgsKey: "sellerId",
        eventName: "SellerCreated"
      })
    );
  }

  /**
   * Voids an existing offer by calling the `OfferHandlerFacet` contract.
   * This transaction only succeeds if the connected signer is the `operator`.
   * @param offerId - ID of offer to void.
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
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

  /**
   * Voids a batch of existing offers by calling the `OfferHandlerFacet` contract.
   * This transaction only succeeds if the connected signer is the `operator` of all
   * provided offers.
   * @param offerIds - IDs of offers to void.
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
  public async voidOfferBatch(
    offerIds: BigNumberish[],
    overrides: Partial<{
      contractAddress: string;
    }> = {}
  ): Promise<TransactionResponse> {
    return offers.handler.voidOfferBatch({
      offerIds,
      web3Lib: this._web3Lib,
      subgraphUrl: this._subgraphUrl,
      contractAddress: overrides.contractAddress || this._protocolDiamond
    });
  }

  /**
   * Returns offer from subgraph.
   * @param offerId - ID of offer.
   * @param queryVars - Optional query variables to skip, order or filter.
   * @returns Offer entity from subgraph.
   */
  public async getOfferById(
    offerId: BigNumberish,
    queryVars?: offers.subgraph.SingleOfferQueryVariables
  ): Promise<subgraph.OfferFieldsFragment> {
    return offers.subgraph.getOfferById(this._subgraphUrl, offerId, queryVars);
  }

  /**
   * Returns offers from subgraph.
   * @param queryVars - Optional query variables to skip, order or filter.
   * @returns Offer entities from subgraph.
   */
  public async getOffers(
    queryVars?: subgraph.GetOffersQueryQueryVariables
  ): Promise<subgraph.OfferFieldsFragment[]> {
    return offers.subgraph.getOffers(this._subgraphUrl, queryVars);
  }

  /**
   * Renders contractual agreement for given offer.
   * @param offerId - Id of offer to render agreement for.
   * @returns Contractual agreement as string.
   */
  public async renderContractualAgreementForOffer(
    offerId: BigNumberish
  ): Promise<string> {
    const offerData = await offers.subgraph.getOfferById(
      this._subgraphUrl,
      offerId
    );
    return offers.renderContractualAgreementForOffer(offerData);
  }

  /**
   * Renders contractual agreement for given offer.
   * @param template - Mustache syntax based template.
   * @param offerData - Offer data.
   * @returns Contractual agreement as string.
   */
  public async renderContractualAgreement(
    template: string,
    offerData: offers.CreateOfferArgs,
    offerMetadata: offers.AdditionalOfferMetadata
  ): Promise<string> {
    const tokenInfo = await this.getExchangeTokenInfo(offerData.exchangeToken);
    return offers.renderContractualAgreement(
      template,
      offerData,
      offerMetadata,
      tokenInfo
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                   ERC20 / Exchange Token related methods                   */
  /* -------------------------------------------------------------------------- */

  /**
   * Returns the current allowance of the given token by calling the contract.
   * @param exchangeToken - Address of exchange token.
   * @param overrides - Optional overrides.
   * @returns Allowance for given signer.
   */
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

  /**
   * Returns `name`, `decimals` and `symbol` of the given token by calling the contract.
   * @param exchangeToken - Address exchange token.
   * @returns Decimals, name and symbol.
   */
  public async getExchangeTokenInfo(
    exchangeToken: string
  ): Promise<ITokenInfo> {
    if (this._tokenInfoManager === undefined) {
      this._tokenInfoManager = new TokenInfoManager(
        this._chainId,
        this._web3Lib
      );
    }

    return this._tokenInfoManager.getExchangeTokenInfo(exchangeToken);
  }

  /**
   * Approves the given amount for the main protocol contract.
   * @param exchangeToken - Address of token to approve.
   * @param value - Amount of allowance.
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
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

  public async getProtocolAllowance(
    exchangeToken: string,
    overrides: Partial<{
      spender: string;
      owner: string;
    }> = {}
  ): Promise<string> {
    return erc20.handler.getAllowance({
      contractAddress: exchangeToken,
      owner: overrides.owner || (await this._web3Lib.getSignerAddress()),
      spender: overrides.spender || this._protocolDiamond,
      web3Lib: this._web3Lib
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                            Funds related methods                           */
  /* -------------------------------------------------------------------------- */

  /**
   * Deposit funds by calling the `FundsHandlerFacet` contract.
   * @param sellerId - ID of seller account to deposit funds for.
   * @param fundsAmount - Amount of funds.
   * @param fundsTokenAddress - Address of funds token.
   * @returns Transaction response.
   */
  public async depositFunds(
    sellerId: BigNumberish,
    fundsAmount: BigNumberish,
    fundsTokenAddress: string = AddressZero
  ): Promise<TransactionResponse> {
    return funds.handler.depositFunds({
      sellerId,
      fundsAmount,
      fundsTokenAddress,
      contractAddress: this._protocolDiamond,
      web3Lib: this._web3Lib
    });
  }

  /**
   * Returns funds entity from subgraph.
   * @param fundsId - ID of funds entity.
   * @param queryVars - Optional query variables to skip, order or filter.
   * @returns Funds entity from subgraph.
   */
  public async getFundsById(
    fundsId: BigNumberish,
    queryVars?: subgraph.GetFundsByIdQueryVariables
  ): Promise<subgraph.FundsEntityFieldsFragment> {
    return funds.subgraph.getFundsById(this._subgraphUrl, fundsId, queryVars);
  }

  /**
   * Returns funds entities from subgraph.
   * @param queryVars - Optional query variables to skip, order or filter.
   * @returns Funds entities from subgraph.
   */
  public async getFunds(
    queryVars?: subgraph.GetFundsQueryVariables
  ): Promise<subgraph.FundsEntityFieldsFragment[]> {
    return funds.subgraph.getFunds(this._subgraphUrl, queryVars);
  }

  /**
   * Withdraw selected funds by calling the `FundsHandlerFacet` contract.
   * @param sellerId - ID of seller account to withdraw funds for.
   * @param tokensToWithdraw - Addresses of funds tokens to withdraw.
   * @param amountsToWithdraw - Amounts of funds token to withdraw.
   * @returns Transaction response.
   */
  public async withdrawFunds(
    sellerId: BigNumberish,
    tokensToWithdraw: Array<string>,
    amountsToWithdraw: Array<BigNumberish>
  ): Promise<TransactionResponse> {
    return funds.handler.withdrawFunds({
      sellerId,
      tokensToWithdraw,
      amountsToWithdraw,
      contractAddress: this._protocolDiamond,
      web3Lib: this._web3Lib
    });
  }

  /**
   * Withdraw all available funds by calling the `FundsHandlerFacet` contract.
   * @param sellerId - ID of seller account to withdraw funds for.
   * @returns Transaction response.
   */
  public async withdrawAllAvailableFunds(
    sellerId: BigNumberish
  ): Promise<TransactionResponse> {
    return funds.handler.withdrawAllAvailableFunds({
      sellerId,
      subgraphUrl: this._subgraphUrl,
      contractAddress: this._protocolDiamond,
      web3Lib: this._web3Lib
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                          Exchange related methods                          */
  /* -------------------------------------------------------------------------- */

  /**
   * Returns exchange entity from subgraph.
   * @param exchangeId - ID of exchange entity.
   * @param queryVars - Optional query variables to skip, order or filter.
   * @returns Exchange entity from subgraph.
   */
  public async getExchangeById(
    exchangeId: BigNumberish,
    queryVars?: subgraph.GetExchangeByIdQueryQueryVariables
  ): Promise<subgraph.ExchangeFieldsFragment> {
    return exchanges.subgraph.getExchangeById(
      this._subgraphUrl,
      exchangeId,
      queryVars
    );
  }

  /**
   * Returns exchange entities from subgraph.
   * @param queryVars - Optional query variables to skip, order or filter.
   * @returns Exchange entities from subgraph.
   */
  public async getExchanges(
    queryVars?: subgraph.GetExchangesQueryQueryVariables
  ): Promise<subgraph.ExchangeFieldsFragment[]> {
    return exchanges.subgraph.getExchanges(this._subgraphUrl, queryVars);
  }

  /**
   * Commits to an offer by calling the `ExchangeHandlerContract`.
   * This transaction only succeeds if the seller has deposited funds.
   * @param offerId - ID of offer to commit to.
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
  public async commitToOffer(
    offerId: BigNumberish,
    overrides: Partial<{
      buyer: string;
    }> = {}
  ): Promise<TransactionResponse> {
    const buyer = overrides.buyer || (await this._web3Lib.getSignerAddress());
    return exchanges.handler.commitToOffer({
      buyer,
      offerId,
      web3Lib: this._web3Lib,
      subgraphUrl: this._subgraphUrl,
      contractAddress: this._protocolDiamond
    });
  }

  /**
   * Utility method to retrieve the created `exchangeId` from logs after calling `commitToOffer`.
   * @param logs - Logs to search in.
   * @returns Created exchange id.
   */
  public getCommittedExchangeIdFromLogs(logs: Log[]): string | null {
    return getValueFromLogs({
      iface: exchanges.iface.bosonExchangeHandlerIface,
      logs,
      eventArgsKey: "exchangeId",
      eventName: "BuyerCommitted"
    });
  }

  /**
   * Revokes an existing voucher by calling the `ExchangeHandlerContract`.
   * Callable by seller `operator`.
   * @param exchangeId - ID of exchange to revoke.
   * @returns Transaction response.
   */
  public async revokeVoucher(
    exchangeId: BigNumberish
  ): Promise<TransactionResponse> {
    return exchanges.handler.revokeVoucher({
      web3Lib: this._web3Lib,
      contractAddress: this._protocolDiamond,
      exchangeId,
      subgraphUrl: this._subgraphUrl
    });
  }

  /**
   * Cancels an existing voucher by calling the `ExchangeHandlerContract`.
   * Callable by buyer.
   * @param exchangeId - ID of exchange to cancel.
   * @returns Transaction response.
   */
  public async cancelVoucher(
    exchangeId: BigNumberish
  ): Promise<TransactionResponse> {
    return exchanges.handler.cancelVoucher({
      web3Lib: this._web3Lib,
      contractAddress: this._protocolDiamond,
      exchangeId,
      subgraphUrl: this._subgraphUrl
    });
  }

  /**
   * Redeems an existing voucher by calling the `ExchangeHandlerContract`.
   * Callable by buyer.
   * @param exchangeId - ID of exchange to redeem.
   * @returns Transaction response.
   */
  public async redeemVoucher(
    exchangeId: BigNumberish
  ): Promise<TransactionResponse> {
    return exchanges.handler.redeemVoucher({
      web3Lib: this._web3Lib,
      contractAddress: this._protocolDiamond,
      exchangeId,
      subgraphUrl: this._subgraphUrl
    });
  }

  /**
   * Completes an existing voucher by calling the `ExchangeHandlerContract`.
   * Callable by buyer or seller operator.
   * @param exchangeId - ID of exchange to complete.
   * @returns Transaction response.
   */
  public async completeExchange(
    exchangeId: BigNumberish
  ): Promise<TransactionResponse> {
    return exchanges.handler.completeExchange({
      web3Lib: this._web3Lib,
      contractAddress: this._protocolDiamond,
      exchangeId,
      subgraphUrl: this._subgraphUrl
    });
  }

  /**
   * Completes a batch of existing vouchers by calling the `ExchangeHandlerContract`.
   * Callable by buyer or seller operator.
   * @param exchangeIds - IDs of exchange to complete.
   * @returns Transaction response.
   */
  public async completeExchangeBatch(
    exchangeIds: BigNumberish[]
  ): Promise<TransactionResponse> {
    return exchanges.handler.completeExchangeBatch({
      web3Lib: this._web3Lib,
      contractAddress: this._protocolDiamond,
      exchangeIds,
      subgraphUrl: this._subgraphUrl
    });
  }

  /**
   * Expires an existing voucher by calling the `ExchangeHandlerContract`.
   * @param exchangeId - ID of exchange to expire.
   * @returns Transaction response.
   */
  public async expireVoucher(
    exchangeId: BigNumberish
  ): Promise<TransactionResponse> {
    return exchanges.handler.expireVoucher({
      web3Lib: this._web3Lib,
      contractAddress: this._protocolDiamond,
      exchangeId,
      subgraphUrl: this._subgraphUrl
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                           Dispute related methods                          */
  /* -------------------------------------------------------------------------- */

  /**
   * Returns dispute entity from subgraph.
   * @param disputeId - ID of dispute entity.
   * @param queryVars - Optional query variables to skip, order or filter.
   * @returns Dispute entity from subgraph.
   */
  public async getDisputeById(
    disputeId: BigNumberish,
    queryVars?: disputes.subgraph.SingleDisputeQueryVariables
  ) {
    return disputes.subgraph.getDisputeById(
      this._subgraphUrl,
      disputeId,
      queryVars
    );
  }

  /**
   * Returns dispute entities from subgraph.
   * @param queryVars - Optional query variables to skip, order or filter.
   * @returns Dispute entities from subgraph.
   */
  public async getDisputes(
    queryVars?: subgraph.GetDisputesQueryQueryVariables
  ) {
    return disputes.subgraph.getDisputes(this._subgraphUrl, queryVars);
  }

  /**
   * Raises a dispute by calling the `DisputeHandlerContract`.
   * @param exchangeId - ID of exchange to dispute.
   * @returns Transaction response.
   */
  public async raiseDispute(
    exchangeId: BigNumberish
  ): Promise<TransactionResponse> {
    return disputes.handler.raiseDispute({
      exchangeId,
      contractAddress: this._protocolDiamond,
      web3Lib: this._web3Lib
    });
  }

  /**
   * Retracts a dispute by calling the `DisputeHandlerContract`.
   * @param exchangeId - ID of disputed exchange.
   * @returns Transaction response.
   */
  public async retractDispute(
    exchangeId: BigNumberish
  ): Promise<TransactionResponse> {
    return disputes.handler.retractDispute({
      exchangeId,
      contractAddress: this._protocolDiamond,
      web3Lib: this._web3Lib
    });
  }

  /**
   * Extends the dispute timeout by calling the `DisputeHandlerContract`.
   * @param exchangeId - ID of disputed exchange.
   * @param newDisputeTimeout - New dispute timeout in seconds.
   * @returns Transaction response.
   */
  public async extendDisputeTimeout(
    exchangeId: BigNumberish,
    newDisputeTimeout: BigNumberish
  ): Promise<TransactionResponse> {
    return disputes.handler.extendDisputeTimeout({
      exchangeId,
      newDisputeTimeout,
      contractAddress: this._protocolDiamond,
      web3Lib: this._web3Lib
    });
  }

  /**
   * Expires a dispute by calling the `DisputeHandlerContract`.
   * @param exchangeId - ID of disputed exchange.
   * @returns Transaction response.
   */
  public async expireDispute(
    exchangeId: BigNumberish
  ): Promise<TransactionResponse> {
    return disputes.handler.expireDispute({
      exchangeId,
      contractAddress: this._protocolDiamond,
      web3Lib: this._web3Lib
    });
  }

  /**
   * Expires many disputes by calling the `DisputeHandlerContract`.
   * @param exchangeIds - IDs of disputed exchanges.
   * @returns Transaction response.
   */
  public async expireDisputeBatch(
    exchangeIds: BigNumberish[]
  ): Promise<TransactionResponse> {
    return disputes.handler.expireDisputeBatch({
      exchangeIds,
      contractAddress: this._protocolDiamond,
      web3Lib: this._web3Lib
    });
  }

  /**
   * Resolves dispute by calling the `DisputeHandlerContract`. If caller is `buyer` then
   * signature of `seller` is required as an argument. If caller if `seller` then vice-versa.
   * The signature can be retrieved by calling the method
   * `CoreSDK.signDisputeResolutionProposal`.
   * @param args - Dispute resolve arguments:
   * - `args.exchangeId` - ID of disputed exchange.
   * - `args.buyerPercent` - Percentage of deposit the buyer gets.
   * - `args.sigR` - r signature value of counterparty.
   * - `args.sigS` - s signature value of counterparty.
   * - `args.sigV` - v signature value of counterparty.
   * @returns Transaction response.
   */
  public async resolveDispute(args: {
    exchangeId: BigNumberish;
    buyerPercentBasisPoints: BigNumberish;
    sigR: BytesLike;
    sigS: BytesLike;
    sigV: BigNumberish;
  }): Promise<TransactionResponse> {
    return disputes.handler.resolveDispute({
      ...args,
      contractAddress: this._protocolDiamond,
      web3Lib: this._web3Lib
    });
  }

  /**
   * Escalates dispute by calling the `DisputeHandlerContract`.
   * @param exchangeId - ID of disputed exchange.
   * @returns Transaction response.
   */
  public async escalateDispute(
    exchangeId: BigNumberish
  ): Promise<TransactionResponse> {
    return disputes.handler.escalateDispute({
      exchangeId,
      contractAddress: this._protocolDiamond,
      web3Lib: this._web3Lib
    });
  }

  /**
   * Decides dispute by calling the `DisputeHandlerContract`.
   * @param exchangeId - ID of disputed exchange.
   * @param buyerPercent - Percentage of deposit buyer gets.
   * @returns Transaction response.
   */
  public async decideDispute(
    exchangeId: BigNumberish,
    buyerPercent: BigNumberish
  ): Promise<TransactionResponse> {
    return disputes.handler.decideDispute({
      exchangeId,
      buyerPercent,
      contractAddress: this._protocolDiamond,
      web3Lib: this._web3Lib
    });
  }

  /**
   * Refuses escalated dispute by calling the `DisputeHandlerContract`.
   * @param exchangeId - ID of disputed exchange.
   * @returns Transaction response.
   */
  public async refuseEscalatedDispute(
    exchangeId: BigNumberish
  ): Promise<TransactionResponse> {
    return disputes.handler.refuseEscalatedDispute({
      exchangeId,
      contractAddress: this._protocolDiamond,
      web3Lib: this._web3Lib
    });
  }

  /**
   * Expires escalated dispute by calling the `DisputeHandlerContract`.
   * @param exchangeId - ID of disputed exchange.
   * @returns Transaction response.
   */
  public async expireEscalatedDispute(
    exchangeId: BigNumberish
  ): Promise<TransactionResponse> {
    return disputes.handler.expireEscalatedDispute({
      exchangeId,
      contractAddress: this._protocolDiamond,
      web3Lib: this._web3Lib
    });
  }

  /**
   * Signs dispute resolution message.
   * @param args - Dispute resolve arguments:
   * - `args.exchangeId` - ID of disputed exchange.
   * - `args.buyerPercentBasisPoints` - Percentage of deposit the buyer gets.
   * @returns Signature.
   */
  public async signDisputeResolutionProposal(args: {
    exchangeId: BigNumberish;
    buyerPercentBasisPoints: BigNumberish;
  }) {
    return disputes.handler.signResolutionProposal({
      ...args,
      web3Lib: this._web3Lib,
      contractAddress: this._protocolDiamond,
      chainId: this._chainId
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                           Meta Tx related methods                          */
  /* -------------------------------------------------------------------------- */

  /**
   * Encodes and signs a meta transaction that can be relayed.
   * @param args - Meta transaction args.
   * @returns Signature.
   */
  public async signMetaTx(
    args: Omit<
      Parameters<typeof metaTx.handler.signMetaTx>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return metaTx.handler.signMetaTx({
      web3Lib: this._web3Lib,
      metaTxHandlerAddress: this._protocolDiamond,
      chainId: this._chainId,
      ...args
    });
  }

  /**
   * Encodes and signs a meta transaction for `createSeller` that can be relayed.
   * @param args - Meta transaction args.
   * @returns Signature.
   */
  public async signMetaTxCreateSeller(
    args: Omit<
      Parameters<typeof metaTx.handler.signMetaTxCreateSeller>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return metaTx.handler.signMetaTxCreateSeller({
      web3Lib: this._web3Lib,
      metaTxHandlerAddress: this._protocolDiamond,
      chainId: this._chainId,
      ...args
    });
  }

  /**
   * Encodes and signs a meta transaction for `createOffer` that can be relayed.
   * @param args - Meta transaction args.
   * @returns Signature.
   */
  public async signMetaTxCreateOffer(
    args: Omit<
      Parameters<typeof metaTx.handler.signMetaTxCreateOffer>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return metaTx.handler.signMetaTxCreateOffer({
      web3Lib: this._web3Lib,
      theGraphStorage: this._theGraphStorage,
      metadataStorage: this._metadataStorage,
      metaTxHandlerAddress: this._protocolDiamond,
      chainId: this._chainId,
      ...args
    });
  }

  /**
   * Encodes and signs a meta transaction for `createOfferBatch` that can be relayed.
   * @param args - Meta transaction args.
   * @returns Signature.
   */
  public async signMetaTxCreateOfferBatch(
    args: Omit<
      Parameters<typeof metaTx.handler.signMetaTxCreateOfferBatch>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return metaTx.handler.signMetaTxCreateOfferBatch({
      web3Lib: this._web3Lib,
      theGraphStorage: this._theGraphStorage,
      metadataStorage: this._metadataStorage,
      metaTxHandlerAddress: this._protocolDiamond,
      chainId: this._chainId,
      ...args
    });
  }

  /**
   * Encodes and signs a meta transaction for `createGroup` that can be relayed.
   * @param args - Meta transaction args.
   * @returns Signature.
   */
  public async signMetaTxCreateGroup(
    args: Omit<
      Parameters<typeof metaTx.handler.signMetaTxCreateGroup>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return metaTx.handler.signMetaTxCreateGroup({
      web3Lib: this._web3Lib,
      metaTxHandlerAddress: this._protocolDiamond,
      chainId: this._chainId,
      ...args
    });
  }

  /**
   * Encodes and signs a meta transaction for `createOfferWithCondition` that can be relayed.
   * @param args - Meta transaction args.
   * @returns Signature.
   */
  public async signMetaTxCreateOfferWithCondition(
    args: Omit<
      Parameters<typeof metaTx.handler.signMetaTxCreateOfferWithCondition>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return metaTx.handler.signMetaTxCreateOfferWithCondition({
      web3Lib: this._web3Lib,
      metaTxHandlerAddress: this._protocolDiamond,
      chainId: this._chainId,
      ...args
    });
  }

  /**
   * Encodes and signs a meta transaction for `voidOffer` that can be relayed.
   * @param args - Meta transaction args.
   * @returns Signature.
   */
  public async signMetaTxVoidOffer(
    args: Omit<
      Parameters<typeof metaTx.handler.signMetaTxVoidOffer>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return metaTx.handler.signMetaTxVoidOffer({
      web3Lib: this._web3Lib,
      metaTxHandlerAddress: this._protocolDiamond,
      chainId: this._chainId,
      ...args
    });
  }

  /**
   * Encodes and signs a meta transaction for `voidOfferBatch` that can be relayed.
   * @param args - Meta transaction args.
   * @returns Signature.
   */
  public async signMetaTxVoidOfferBatch(
    args: Omit<
      Parameters<typeof metaTx.handler.signMetaTxVoidOfferBatch>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return metaTx.handler.signMetaTxVoidOfferBatch({
      web3Lib: this._web3Lib,
      metaTxHandlerAddress: this._protocolDiamond,
      chainId: this._chainId,
      ...args
    });
  }

  /**
   * Encodes and signs a meta transaction for `completeExchangeBatch` that can be relayed.
   * @param args - Meta transaction args.
   * @returns Signature.
   */
  public async signMetaTxCompleteExchangeBatch(
    args: Omit<
      Parameters<typeof metaTx.handler.signMetaTxCompleteExchangeBatch>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return metaTx.handler.signMetaTxCompleteExchangeBatch({
      web3Lib: this._web3Lib,
      metaTxHandlerAddress: this._protocolDiamond,
      chainId: this._chainId,
      ...args
    });
  }

  /**
   * Encodes and signs a meta transaction for `commitToOffer` that can be relayed.
   * @param args - Meta transaction args.
   * @returns Signature.
   */
  public async signMetaTxCommitToOffer(
    args: Omit<
      Parameters<typeof metaTx.handler.signMetaTxCommitToOffer>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return metaTx.handler.signMetaTxCommitToOffer({
      web3Lib: this._web3Lib,
      metaTxHandlerAddress: this._protocolDiamond,
      chainId: this._chainId,
      ...args
    });
  }

  /**
   * Encodes and signs a meta transaction for `cancelVoucher` that can be relayed.
   * @param args - Meta transaction args.
   * @returns Signature.
   */
  public async signMetaTxCancelVoucher(
    args: Omit<
      Parameters<typeof metaTx.handler.signMetaTxCancelVoucher>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return metaTx.handler.signMetaTxCancelVoucher({
      web3Lib: this._web3Lib,
      metaTxHandlerAddress: this._protocolDiamond,
      chainId: this._chainId,
      ...args
    });
  }

  /**
   * Encodes and signs a meta transaction for `redeemVoucher` that can be relayed.
   * @param args - Meta transaction args.
   * @returns Signature.
   */
  public async signMetaTxRedeemVoucher(
    args: Omit<
      Parameters<typeof metaTx.handler.signMetaTxRedeemVoucher>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return metaTx.handler.signMetaTxRedeemVoucher({
      web3Lib: this._web3Lib,
      metaTxHandlerAddress: this._protocolDiamond,
      chainId: this._chainId,
      ...args
    });
  }

  /**
   * Encodes and signs a meta transaction for `expireVoucher` that can be relayed.
   * @param args - Meta transaction args.
   * @returns Signature.
   */
  public async signMetaTxExpireVoucher(
    args: Omit<
      Parameters<typeof metaTx.handler.signMetaTxExpireVoucher>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return metaTx.handler.signMetaTxExpireVoucher({
      web3Lib: this._web3Lib,
      metaTxHandlerAddress: this._protocolDiamond,
      chainId: this._chainId,
      ...args
    });
  }

  /**
   * Encodes and signs a meta transaction for `revokeVoucher` that can be relayed.
   * @param args - Meta transaction args.
   * @returns Signature.
   */
  public async signMetaTxRevokeVoucher(
    args: Omit<
      Parameters<typeof metaTx.handler.signMetaTxRevokeVoucher>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return metaTx.handler.signMetaTxRevokeVoucher({
      web3Lib: this._web3Lib,
      metaTxHandlerAddress: this._protocolDiamond,
      chainId: this._chainId,
      ...args
    });
  }

  /**
   * Encodes and signs a meta transaction for `retractDispute` that can be relayed.
   * @param args - Meta transaction args.
   * @returns Signature.
   */
  public async signMetaTxRetractDispute(
    args: Omit<
      Parameters<typeof metaTx.handler.signMetaTxRetractDispute>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return metaTx.handler.signMetaTxRetractDispute({
      web3Lib: this._web3Lib,
      metaTxHandlerAddress: this._protocolDiamond,
      chainId: this._chainId,
      ...args
    });
  }

  /**
   * Encodes and signs a meta transaction for `escalateDispute` that can be relayed.
   * @param args - Meta transaction args.
   * @returns Signature.
   */
  public async signMetaTxEscalateDispute(
    args: Omit<
      Parameters<typeof metaTx.handler.signMetaTxEscalateDispute>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return metaTx.handler.signMetaTxEscalateDispute({
      web3Lib: this._web3Lib,
      metaTxHandlerAddress: this._protocolDiamond,
      chainId: this._chainId,
      ...args
    });
  }

  /**
   * Encodes and signs a meta transaction for `raiseDispute` that can be relayed.
   * @param args - Meta transaction args.
   * @returns Signature.
   */
  public async signMetaTxRaiseDispute(
    args: Omit<
      Parameters<typeof metaTx.handler.signMetaTxRaiseDispute>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return metaTx.handler.signMetaTxRaiseDispute({
      web3Lib: this._web3Lib,
      metaTxHandlerAddress: this._protocolDiamond,
      chainId: this._chainId,
      ...args
    });
  }

  /**
   * Encodes and signs a meta transaction for `resolveDispute` that can be relayed.
   * @param args - Meta transaction args.
   * @returns Signature.
   */
  public async signMetaTxResolveDispute(
    args: Omit<
      Parameters<typeof metaTx.handler.signMetaTxResolveDispute>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return metaTx.handler.signMetaTxResolveDispute({
      web3Lib: this._web3Lib,
      metaTxHandlerAddress: this._protocolDiamond,
      chainId: this._chainId,
      ...args
    });
  }

  /**
   * Encodes and signs a meta transaction for `withdrawFunds` that can be relayed.
   * @param args - Meta transaction args.
   * @returns Signature.
   */
  public async signMetaTxWithdrawFunds(
    args: Omit<
      Parameters<typeof metaTx.handler.signMetaTxWithdrawFunds>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return metaTx.handler.signMetaTxWithdrawFunds({
      web3Lib: this._web3Lib,
      metaTxHandlerAddress: this._protocolDiamond,
      chainId: this._chainId,
      ...args
    });
  }

  /**
   * Encodes and signs a meta transaction for `depositFunds` that can be relayed.
   * @param args - Meta transaction args.
   * @returns Signature.
   */
  public async signMetaTxDepositFunds(
    args: Omit<
      Parameters<typeof metaTx.handler.signMetaTxDepositFunds>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return metaTx.handler.signMetaTxDepositFunds({
      web3Lib: this._web3Lib,
      metaTxHandlerAddress: this._protocolDiamond,
      chainId: this._chainId,
      ...args
    });
  }

  /**
   * Relay a meta transaction,
   * @param metaTxParams - Required params for meta transaction.
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
  public async relayMetaTransaction(
    metaTxParams: {
      functionName: string;
      functionSignature: BytesLike;
      nonce: BigNumberish;
      sigR: BytesLike;
      sigS: BytesLike;
      sigV: BigNumberish;
    },
    overrides: Partial<{
      userAddress: string;
      contractAddress: string;
      metaTxConfig: Partial<Omit<MetaTxConfig, "apiIds"> & { apiId: string }>;
      metaTransactionMethod: string;
    }> = {}
  ): Promise<TransactionResponse> {
    const { metaTxApiId, metaTxApiKey, metaTxRelayerUrl, contractAddress } =
      this.assertAndGetMetaTxConfig(overrides);

    return metaTx.handler.relayMetaTransaction({
      web3LibAdapter: this._web3Lib,
      contractAddress,
      chainId: this._chainId,
      metaTx: {
        config: {
          relayerUrl: metaTxRelayerUrl,
          apiId: metaTxApiId,
          apiKey: metaTxApiKey
        },
        params: {
          userAddress:
            overrides.userAddress || (await this._web3Lib.getSignerAddress()),
          functionName: metaTxParams.functionName,
          functionSignature: metaTxParams.functionSignature,
          nonce: metaTxParams.nonce,
          sigR: metaTxParams.sigR,
          sigS: metaTxParams.sigS,
          sigV: metaTxParams.sigV
        }
      }
    });
  }

  /**
   * Encodes and signs a native "token.approve()" meta transaction that can be relayed.
   * @param exchangeToken - The address of the token contract.
   * @param value - The value to be approved.
   * @param overrides - Optionally specify a spender address (default is the protocol contract address).
   * @returns Signature.
   */
  public async signNativeMetaTxApproveExchangeToken(
    exchangeToken: string,
    value: BigNumberish,
    overrides: Partial<{
      spender: string;
    }> = {}
  ) {
    const user = await this._web3Lib.getSignerAddress();
    return nativeMetaTx.handler.signNativeMetaTxApproveExchangeToken({
      web3Lib: this._web3Lib,
      chainId: this._chainId,
      user,
      exchangeToken,
      spender: overrides.spender || this._protocolDiamond,
      value
    });
  }

  /**
   * Relay a native meta transaction,
   * @param metaTxParams - Required params for meta transaction.
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
  public async relayNativeMetaTransaction(
    contractAddress: string,
    metaTxParams: {
      functionSignature: BytesLike;
      sigR: BytesLike;
      sigS: BytesLike;
      sigV: BigNumberish;
    },
    overrides: Partial<{
      userAddress: string;
      metaTxConfig: Partial<Omit<MetaTxConfig, "apiIds"> & { apiId: string }>;
      metaTransactionMethod: string;
    }> = {}
  ): Promise<TransactionResponse> {
    const { metaTxApiId, metaTxApiKey, metaTxRelayerUrl } =
      this.assertAndGetMetaTxConfig({ ...overrides, contractAddress });

    return nativeMetaTx.handler.relayNativeMetaTransaction({
      web3LibAdapter: this._web3Lib,
      contractAddress,
      chainId: this._chainId,
      metaTx: {
        config: {
          relayerUrl: metaTxRelayerUrl,
          apiId: metaTxApiId,
          apiKey: metaTxApiKey
        },
        params: {
          userAddress:
            overrides.userAddress || (await this._web3Lib.getSignerAddress()),
          functionSignature: metaTxParams.functionSignature,
          sigR: metaTxParams.sigR,
          sigS: metaTxParams.sigS,
          sigV: metaTxParams.sigV
        }
      }
    });
  }

  /**
   * Returns information of submitted meta transaction.
   * See https://docs.biconomy.io/api/native-meta-tx/get-retried-hashes.
   * @param originalMetaTxHash - Original meta transaction as returned by `coreSDK.relayMetaTransaction`
   * @param overrides - Optional overrides for meta transaction config.
   * @returns - Additional meta transaction information.
   */
  public async getResubmittedMetaTx(
    originalMetaTxHash: string,
    overrides: Partial<{
      contractAddress: string;
      metaTxConfig: Partial<Omit<MetaTxConfig, "apiIds"> & { apiId: string }>;
      metaTransactionMethod: string;
    }> = {}
  ): Promise<GetRetriedHashesData> {
    const { metaTxApiId, metaTxApiKey, metaTxRelayerUrl } =
      this.assertAndGetMetaTxConfig(overrides);

    return metaTx.handler.getResubmitted({
      chainId: this._chainId,
      metaTx: {
        config: {
          relayerUrl: metaTxRelayerUrl,
          apiId: metaTxApiId,
          apiKey: metaTxApiKey
        },
        originalHash: originalMetaTxHash
      }
    });
  }

  private assertAndGetMetaTxConfig(
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
