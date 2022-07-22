import {
  Web3LibAdapter,
  TransactionResponse,
  getDefaultConfig,
  MetadataStorage,
  AnyMetadata,
  Log
} from "@bosonprotocol/common";
import { BigNumberish } from "@ethersproject/bignumber";
import { AddressZero } from "@ethersproject/constants";

import * as accounts from "./accounts";
import * as exchanges from "./exchanges";
import * as offers from "./offers";
import * as orchestration from "./orchestration";
import * as erc20 from "./erc20";
import * as funds from "./funds";
import * as metaTx from "./meta-tx";
import * as metadata from "./metadata";
import * as subgraph from "./subgraph";

import { getValueFromLogs } from "./utils/logs";

export class CoreSDK {
  private _web3Lib: Web3LibAdapter;
  private _metadataStorage?: MetadataStorage;
  private _theGraphStorage?: MetadataStorage;

  private _subgraphUrl: string;
  private _protocolDiamond: string;

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
  }) {
    this._web3Lib = opts.web3Lib;
    this._subgraphUrl = opts.subgraphUrl;
    this._protocolDiamond = opts.protocolDiamond;
    this._metadataStorage = opts.metadataStorage;
    this._theGraphStorage = opts.theGraphStorage;
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

  /** Metadata related methods */

  /**
   * Stores supported offer metadata via the passed in `MetadataStorage` instance.
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
   * @param metadataHashOrUri - Metadata hash or uri that can be handled by the storage instance.
   * @returns Metadata hash / identifier.
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

  /** Account related methods */

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
   * Returns seller entity from subgraph. Matches `operator`, `clerk`, `admin` or `treasury`.
   * @param address - Address of seller entity to query for.
   * @param queryVars - Optional query variables to skip, order or filter.
   * @returns Seller entity from subgraph.
   */
  public async getSellerByAddress(
    address: string,
    queryVars?: subgraph.GetSellersQueryQueryVariables
  ): Promise<subgraph.SellerFieldsFragment> {
    return accounts.subgraph.getSellerByAddress(
      this._subgraphUrl,
      address,
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
   * @param sellerToCreate - Addresses to set in the seller account.
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

  /** Offer related methods */

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
   * Utility method to retrieve the created `offerId` from logs after calling `createOffer` or `createOfferAndSeller`.
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

  /** ERC20 / Exchange Token related methods */

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

  /** Funds related methods */

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

  /** Exchange related methods */

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
    return exchanges.handler.commitToOffer({
      buyer: overrides.buyer || (await this._web3Lib.getSignerAddress()),
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

  /** Meta Tx related methods */

  /**
   * Encodes and signs a meta transaction that can be relayed.
   * @param args - Meta transaction args.
   * @returns Signature.
   */
  public async signExecuteMetaTx(
    args: Omit<
      Parameters<typeof metaTx.handler.signExecuteMetaTx>[0],
      "web3Lib" | "metaTxHandlerAddress"
    >
  ) {
    return metaTx.handler.signExecuteMetaTx({
      web3Lib: this._web3Lib,
      metaTxHandlerAddress: this._protocolDiamond,
      ...args
    });
  }

  public async signExecuteMetaTxCommitToOffer(
    args: Omit<
      Parameters<typeof metaTx.handler.signExecuteMetaTxCommitToOffer>[0],
      "web3Lib" | "metaTxHandlerAddress"
    >
  ) {
    return metaTx.handler.signExecuteMetaTxCommitToOffer({
      web3Lib: this._web3Lib,
      metaTxHandlerAddress: this._protocolDiamond,
      ...args
    });
  }

  public async signExecuteMetaTxCancelVoucher(
    args: Omit<
      Parameters<typeof metaTx.handler.signExecuteMetaTxCancelVoucher>[0],
      "web3Lib" | "metaTxHandlerAddress"
    >
  ) {
    return metaTx.handler.signExecuteMetaTxCancelVoucher({
      web3Lib: this._web3Lib,
      metaTxHandlerAddress: this._protocolDiamond,
      ...args
    });
  }

  public async signExecuteMetaTxRedeemVoucher(
    args: Omit<
      Parameters<typeof metaTx.handler.signExecuteMetaTxRedeemVoucher>[0],
      "web3Lib" | "metaTxHandlerAddress"
    >
  ) {
    return metaTx.handler.signExecuteMetaTxRedeemVoucher({
      web3Lib: this._web3Lib,
      metaTxHandlerAddress: this._protocolDiamond,
      ...args
    });
  }
}
