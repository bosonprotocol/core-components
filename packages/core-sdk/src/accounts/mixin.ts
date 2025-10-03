import { BaseCoreSDK } from "./../mixins/base-core-sdk";
import * as accounts from ".";
import * as subgraph from "../subgraph";
import * as erc721 from "../erc721";
import {
  AuthTokenType,
  TransactionResponse,
  TransactionRequest,
  Log,
  Web3LibAdapter
} from "@bosonprotocol/common";
import { BigNumberish, BigNumber } from "@ethersproject/bignumber";
import { AddressZero } from "@ethersproject/constants";
import { offers, orchestration } from "..";
import { getValueFromLogs, getValuesFromLogsExt } from "../utils/logs";

export class AccountsMixin<T extends Web3LibAdapter> extends BaseCoreSDK<T> {
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
   * @param assistant - Assistant address of seller entity to query for.
   * @param queryVars - Optional query variables to skip, order or filter.
   * @returns Seller entity from subgraph.
   */
  public async getSellerByAssistant(
    assistant: string,
    queryVars?: subgraph.GetSellersQueryQueryVariables
  ): Promise<subgraph.SellerFieldsFragment> {
    return accounts.subgraph.getSellerByAssistant(
      this._subgraphUrl,
      assistant,
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
   * Returns seller entities from subgraph.
   * @param treasury - Treasury address of seller entities to query for.
   * @param queryVars - Optional query variables to skip, order or filter.
   * @returns Seller entities from subgraph.
   */
  public async getSellersByTreasury(
    treasury: string,
    queryVars?: subgraph.GetSellersQueryQueryVariables
  ): Promise<subgraph.SellerFieldsFragment[]> {
    return accounts.subgraph.getSellersByTreasury(
      this._subgraphUrl,
      treasury,
      queryVars
    );
  }

  /**
   * Returns seller entity from subgraph. Matches `assistant`, `clerk`, `admin` or `treasury`.
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
    let seller = await accounts.subgraph.getSellerByAddress(
      this._subgraphUrl,
      address,
      queryVars
    );
    if (!seller && this._lens?.LENS_HUB_CONTRACT) {
      // If seller is not found per address, try to find per authToken
      const tokenType = AuthTokenType.LENS; // only LENS for now
      const sellerId = await this.searchSellerFromAuthToken(address, tokenType);
      seller = sellerId
        ? await accounts.subgraph.getSellerById(
            this._subgraphUrl,
            sellerId,
            queryVars
          )
        : null;
    }
    return [seller].filter((seller) => !!seller);
  }

  /**
   * Returns the seller id found in the subgraph, if any, based on an authTokenId owned by the specified address
   * @param address - Address of seller entity to query for.
   * @param tokenType - type of authToken to look for.
   * @returns sellerId if found
   */
  public async searchSellerFromAuthToken(
    address: string,
    tokenType: number
  ): Promise<string> {
    if (tokenType !== AuthTokenType.LENS) {
      // only LENS for now
      throw new Error(`Unsupported authTokenType '${tokenType}'`);
    }
    if (!this._lens || !this._lens?.LENS_HUB_CONTRACT) {
      throw new Error("LENS contract is not configured in Core-SDK");
    }
    const balance = await erc721.handler.balanceOf({
      contractAddress: this._lens?.LENS_HUB_CONTRACT,
      owner: address,
      web3Lib: this._web3Lib
    });

    const balanceBN = BigNumber.from(balance);
    // If balanceBN is > 0, fetch all LENS authTokenId from the subgraph and check owner for each of them
    if (balanceBN.gt(0)) {
      const authTokenIdSellers = await accounts.subgraph.getAuthTokenIds(
        this._subgraphUrl,
        {
          authTokenType: AuthTokenType.LENS
        }
      );
      for (const seller of authTokenIdSellers) {
        const owner = await erc721.handler.ownerOf({
          contractAddress: this._lens?.LENS_HUB_CONTRACT,
          tokenId: seller.authTokenId,
          web3Lib: this._web3Lib
        });
        if (owner.toLowerCase() === address.toLowerCase()) {
          return seller.id;
        }
      }
    }
    return;
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
  // Overload: returnTxInfo is true → returns TransactionRequest
  public async createSeller(
    sellerToCreate: accounts.CreateSellerArgs,
    overrides: Partial<{
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo: true;
    }>
  ): Promise<TransactionRequest>;

  // Overload: returnTxInfo is false or undefined → returns TransactionResponse
  public async createSeller(
    sellerToCreate: accounts.CreateSellerArgs,
    overrides?: Partial<{
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo?: false | undefined;
    }>
  ): Promise<TransactionResponse>;

  // Implementation
  public async createSeller(
    sellerToCreate: accounts.CreateSellerArgs,
    overrides: Partial<{
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo?: boolean;
    }> = {}
  ): Promise<TransactionResponse | TransactionRequest> {
    const { returnTxInfo } = overrides;

    const sellerArgs = {
      sellerToCreate,
      web3Lib: this._web3Lib,
      theGraphStorage: this._theGraphStorage,
      metadataStorage: this._metadataStorage,
      contractAddress: overrides.contractAddress || this._protocolDiamond
    } as const satisfies Parameters<typeof accounts.handler.createSeller>[0];

    if (returnTxInfo === true) {
      return accounts.handler.createSeller({
        ...sellerArgs,
        returnTxInfo: true
      });
    } else {
      return accounts.handler.createSeller({
        ...sellerArgs,
        returnTxInfo: false
      });
    }
  }

  /**
   * Creates seller account and offer by calling the `OrchestrationHandlerFacet` contract.
   * This transaction only succeeds if there is no existing seller account for the connected signer.
   * @param sellerToCreate - Addresses to set in the seller account.
   * @param offerToCreate - Offer arguments.
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
  // Overload: returnTxInfo is true → returns TransactionRequest
  public async createSellerAndOffer(
    sellerToCreate: accounts.CreateSellerArgs,
    offerToCreate: offers.CreateOfferArgs,
    overrides: Partial<{
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo: true;
    }>
  ): Promise<TransactionRequest>;

  // Overload: returnTxInfo is false or undefined → returns TransactionResponse
  public async createSellerAndOffer(
    sellerToCreate: accounts.CreateSellerArgs,
    offerToCreate: offers.CreateOfferArgs,
    overrides?: Partial<{
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo?: false | undefined;
    }>
  ): Promise<TransactionResponse>;

  // Implementation
  public async createSellerAndOffer(
    sellerToCreate: accounts.CreateSellerArgs,
    offerToCreate: offers.CreateOfferArgs,
    overrides: Partial<{
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo?: boolean;
    }> = {}
  ): Promise<TransactionResponse | TransactionRequest> {
    const { returnTxInfo } = overrides;

    const orchestrationArgs = {
      sellerToCreate,
      offerToCreate,
      web3Lib: this._web3Lib,
      theGraphStorage: this._theGraphStorage,
      metadataStorage: this._metadataStorage,
      contractAddress: overrides.contractAddress || this._protocolDiamond
    } as const satisfies Parameters<
      typeof orchestration.handler.createOfferAndSeller
    >[0];

    if (returnTxInfo === true) {
      return orchestration.handler.createOfferAndSeller({
        ...orchestrationArgs,
        returnTxInfo: true
      });
    } else {
      return orchestration.handler.createOfferAndSeller({
        ...orchestrationArgs,
        returnTxInfo: false
      });
    }
  }

  /**
   * Updates seller account by calling the `AccountHandlerFacet` contract. Only callable
   * by admin.
   * @param sellerUpdates - Values to update.
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
  // Overload: returnTxInfo is true → returns TransactionRequest
  public async updateSeller(
    sellerUpdates: accounts.UpdateSellerArgs,
    overrides: Partial<{
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo: true;
    }>
  ): Promise<TransactionRequest>;

  // Overload: returnTxInfo is false or undefined → returns TransactionResponse
  public async updateSeller(
    sellerUpdates: accounts.UpdateSellerArgs,
    overrides?: Partial<{
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo?: false | undefined;
    }>
  ): Promise<TransactionResponse>;

  // Implementation
  public async updateSeller(
    sellerUpdates: accounts.UpdateSellerArgs,
    overrides: Partial<{
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo?: boolean;
    }> = {}
  ): Promise<TransactionResponse | TransactionRequest> {
    const { returnTxInfo } = overrides;

    const sellerArgs = {
      sellerUpdates,
      web3Lib: this._web3Lib,
      theGraphStorage: this._theGraphStorage,
      metadataStorage: this._metadataStorage,
      contractAddress: overrides.contractAddress || this._protocolDiamond
    } as const satisfies Parameters<typeof accounts.handler.updateSeller>[0];

    if (returnTxInfo === true) {
      return accounts.handler.updateSeller({
        ...sellerArgs,
        returnTxInfo: true
      });
    } else {
      return accounts.handler.updateSeller({
        ...sellerArgs,
        returnTxInfo: false
      });
    }
  }

  /**
   * Opt-in to a pending seller update by calling the `AccountHandlerFacet` contract. Only callable
   * by admin.
   * @param sellerUpdates - Values to update.
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
  // Overload: returnTxInfo is true → returns TransactionRequest
  public async optInToSellerUpdate(
    sellerUpdates: accounts.OptInToSellerUpdateArgs,
    overrides: Partial<{
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo: true;
    }>
  ): Promise<TransactionRequest>;

  // Overload: returnTxInfo is false or undefined → returns TransactionResponse
  public async optInToSellerUpdate(
    sellerUpdates: accounts.OptInToSellerUpdateArgs,
    overrides?: Partial<{
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo?: false | undefined;
    }>
  ): Promise<TransactionResponse>;

  // Implementation
  public async optInToSellerUpdate(
    sellerUpdates: accounts.OptInToSellerUpdateArgs,
    overrides: Partial<{
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo?: boolean;
    }> = {}
  ): Promise<TransactionResponse | TransactionRequest> {
    const { returnTxInfo } = overrides;

    const sellerArgs = {
      sellerUpdates,
      web3Lib: this._web3Lib,
      contractAddress: overrides.contractAddress || this._protocolDiamond
    } as const satisfies Parameters<
      typeof accounts.handler.optInToSellerUpdate
    >[0];

    if (returnTxInfo === true) {
      return accounts.handler.optInToSellerUpdate({
        ...sellerArgs,
        returnTxInfo: true
      });
    } else {
      return accounts.handler.optInToSellerUpdate({
        ...sellerArgs,
        returnTxInfo: false
      });
    }
  }

  /**
   * Updates seller account by calling the `AccountHandlerFacet` contract,
   * then optIn for all updates doable by the same account. Only callable
   * by admin.
   * @param sellerUpdates - Values to update.
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
  public async updateSellerAndOptIn(
    sellerUpdates: accounts.UpdateSellerArgs,
    overrides: Partial<{
      contractAddress: string;
    }> = {}
  ): Promise<TransactionResponse> {
    const updateTx = await this.updateSeller(sellerUpdates, {
      ...overrides,
      returnTxInfo: false
    });
    const txReceipt = await updateTx.wait();
    const pendingSellerUpdate = this.getPendingSellerUpdateFromLogs(
      txReceipt.logs
    );
    // Find all updates that can be opted in by the current account
    const currentAccount = (
      await this._web3Lib.getSignerAddress()
    ).toLowerCase();
    const fieldsToUpdate = {
      assistant:
        currentAccount === pendingSellerUpdate.assistant?.toLowerCase(),
      admin: currentAccount === pendingSellerUpdate.admin?.toLowerCase(),
      authToken:
        pendingSellerUpdate.tokenType !== undefined &&
        pendingSellerUpdate.tokenType !== null &&
        pendingSellerUpdate.tokenType !== AuthTokenType.NONE
    };
    if (
      fieldsToUpdate.assistant ||
      fieldsToUpdate.admin ||
      fieldsToUpdate.authToken
    ) {
      return this.optInToSellerUpdate({
        id: sellerUpdates.id,
        fieldsToUpdate: {
          assistant:
            currentAccount === pendingSellerUpdate.assistant.toLowerCase(),
          admin: currentAccount === pendingSellerUpdate.admin.toLowerCase(),
          authToken: pendingSellerUpdate.tokenType !== AuthTokenType.NONE
        }
      });
    }
    // If there is nothing to optIn from the current account, then return the response from updateSeller
    return updateTx;
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

  // Overload: returnTxInfo is true → returns TransactionRequest
  public async createBuyer(
    buyerToCreate: accounts.CreateBuyerArgs,
    overrides: Partial<{
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo: true;
    }>
  ): Promise<TransactionRequest>;

  // Overload: returnTxInfo is false or undefined → returns TransactionResponse
  public async createBuyer(
    buyerToCreate: accounts.CreateBuyerArgs,
    overrides?: Partial<{
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo?: false | undefined;
    }>
  ): Promise<TransactionResponse>;

  // Implementation
  public async createBuyer(
    buyerToCreate: accounts.CreateBuyerArgs,
    overrides: Partial<{
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo?: boolean;
    }> = {}
  ): Promise<TransactionResponse | TransactionRequest> {
    const { returnTxInfo } = overrides;

    const buyerArgs = {
      buyerToCreate,
      web3Lib: this._web3Lib,
      theGraphStorage: this._theGraphStorage,
      metadataStorage: this._metadataStorage,
      contractAddress: overrides.contractAddress || this._protocolDiamond
    } as const satisfies Parameters<typeof accounts.handler.createBuyer>[0];

    if (returnTxInfo === true) {
      return accounts.handler.createBuyer({
        ...buyerArgs,
        returnTxInfo: true
      });
    } else {
      return accounts.handler.createBuyer({
        ...buyerArgs,
        returnTxInfo: false
      });
    }
  }

  /* ---------------------------- Dispute Resolver ---------------------------- */

  /**
   * Creates a dispute resolver account by calling the `AccountHandlerFacet` contract.
   * @param disputeResolverToCreate - Dispute resolver arguments.
   * @returns Transaction response.
   */
  // Overload: returnTxInfo is true → returns TransactionRequest
  public async createDisputeResolver(
    disputeResolverToCreate: accounts.CreateDisputeResolverArgs,
    overrides: Partial<{
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo: true;
    }>
  ): Promise<TransactionRequest>;

  // Overload: returnTxInfo is false or undefined → returns TransactionResponse
  public async createDisputeResolver(
    disputeResolverToCreate: accounts.CreateDisputeResolverArgs,
    overrides?: Partial<{
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo?: false | undefined;
    }>
  ): Promise<TransactionResponse>;

  // Implementation
  public async createDisputeResolver(
    disputeResolverToCreate: accounts.CreateDisputeResolverArgs,
    overrides: Partial<{
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo?: boolean;
    }> = {}
  ): Promise<TransactionResponse | TransactionRequest> {
    const { returnTxInfo } = overrides;

    const disputeArgs = {
      disputeResolverToCreate,
      contractAddress: overrides.contractAddress || this._protocolDiamond,
      web3Lib: this._web3Lib
    } as const satisfies Parameters<
      typeof accounts.handler.createDisputeResolver
    >[0];

    if (returnTxInfo === true) {
      return accounts.handler.createDisputeResolver({
        ...disputeArgs,
        returnTxInfo: true
      });
    } else {
      return accounts.handler.createDisputeResolver({
        ...disputeArgs,
        returnTxInfo: false
      });
    }
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
   * Utility method to retrieve the pending seller update fields from logs after calling `updateSeller`.
   * @param logs - Logs to search in.
   * @returns Created exchange id.
   */
  public getPendingSellerUpdateFromLogs(logs: Log[]): {
    sellerId: bigint;
    assistant: string;
    clerk: string;
    admin: string;
    tokenType: number;
    tokenId: BigNumber;
  } {
    // Extract fields pendingSeller and pendingAuthToken from
    // SellerUpdatePending or SellerUpdateApplied events
    const valuesFromLogs = getValuesFromLogsExt<
      | {
          assistant: string;
          clerk: string;
          admin: string;
        }
      | {
          tokenType: number;
          tokenId: BigNumber;
        }
      | bigint
    >({
      iface: accounts.iface.bosonAccountHandlerIface,
      logs,
      eventArgsKeys: ["pendingSeller", "pendingAuthToken", "sellerId"],
      eventNames: ["SellerUpdatePending", "SellerUpdateApplied"]
    });
    const pendingSellerStruct = (
      valuesFromLogs["pendingSeller"] as {
        assistant: string;
        clerk: string;
        admin: string;
      }[]
    )?.[0];
    const pendingAuthTokenStruct = (
      valuesFromLogs["pendingAuthToken"] as {
        tokenType: number;
        tokenId: BigNumber;
      }[]
    )?.[0];
    const sellerId = (valuesFromLogs["sellerId"] as bigint[])?.[0];
    return {
      sellerId,
      assistant: pendingSellerStruct?.assistant,
      admin: pendingSellerStruct?.admin,
      clerk: pendingSellerStruct?.clerk,
      tokenId: pendingAuthTokenStruct?.tokenId,
      tokenType: pendingAuthTokenStruct?.tokenType
    };
  }

  /**
   * Updates a dispute resolver account by calling the `AccountHandlerFacet` contract.
   * Note, that the caller must be the specified `admin` address of the dispute resolver account.
   * @param disputeResolverId - Id of dispute resolver to update.
   * @param updates - Values to update for the given dispute resolver.
   * @returns Transaction response.
   */
  // Overload: returnTxInfo is true → returns TransactionRequest
  public async updateDisputeResolver(
    disputeResolverId: BigNumberish,
    updates: accounts.DisputeResolverUpdates,
    overrides: Partial<{
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo: true;
    }>
  ): Promise<TransactionRequest>;

  // Overload: returnTxInfo is false or undefined → returns TransactionResponse
  public async updateDisputeResolver(
    disputeResolverId: BigNumberish,
    updates: accounts.DisputeResolverUpdates,
    overrides?: Partial<{
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo?: false | undefined;
    }>
  ): Promise<TransactionResponse>;

  // Implementation
  public async updateDisputeResolver(
    disputeResolverId: BigNumberish,
    updates: accounts.DisputeResolverUpdates,
    overrides: Partial<{
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo?: boolean;
    }> = {}
  ): Promise<TransactionResponse | TransactionRequest> {
    const { returnTxInfo } = overrides;

    const disputeArgs = {
      disputeResolverId,
      updates,
      subgraphUrl: this._subgraphUrl,
      contractAddress: overrides.contractAddress || this._protocolDiamond,
      web3Lib: this._web3Lib
    } as const satisfies Parameters<
      typeof accounts.handler.updateDisputeResolver
    >[0];

    if (returnTxInfo === true) {
      return accounts.handler.updateDisputeResolver({
        ...disputeArgs,
        returnTxInfo: true
      });
    } else {
      return accounts.handler.updateDisputeResolver({
        ...disputeArgs,
        returnTxInfo: false
      });
    }
  }

  // Overload: returnTxInfo is true → returns TransactionRequest
  public async optInToDisputeResolverUpdate(
    disputeResolverUpdates: accounts.OptInToDisputeResolverUpdateArgs,
    overrides: Partial<{
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo: true;
    }>
  ): Promise<TransactionRequest>;

  // Overload: returnTxInfo is false or undefined → returns TransactionResponse
  public async optInToDisputeResolverUpdate(
    disputeResolverUpdates: accounts.OptInToDisputeResolverUpdateArgs,
    overrides?: Partial<{
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo?: false | undefined;
    }>
  ): Promise<TransactionResponse>;

  // Implementation
  public async optInToDisputeResolverUpdate(
    disputeResolverUpdates: accounts.OptInToDisputeResolverUpdateArgs,
    overrides: Partial<{
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo?: boolean;
    }> = {}
  ): Promise<TransactionResponse | TransactionRequest> {
    const { returnTxInfo } = overrides;

    const disputeArgs = {
      disputeResolverUpdates,
      web3Lib: this._web3Lib,
      contractAddress: overrides.contractAddress || this._protocolDiamond
    } as const satisfies Parameters<
      typeof accounts.handler.optInToDisputeResolverUpdate
    >[0];

    if (returnTxInfo === true) {
      return accounts.handler.optInToDisputeResolverUpdate({
        ...disputeArgs,
        returnTxInfo: true
      });
    } else {
      return accounts.handler.optInToDisputeResolverUpdate({
        ...disputeArgs,
        returnTxInfo: false
      });
    }
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
  // Overload: returnTxInfo is true → returns TransactionRequest
  public async addFeesToDisputeResolver(
    disputeResolverId: BigNumberish,
    fees: accounts.DisputeResolutionFee[],
    overrides: Partial<{
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo: true;
    }>
  ): Promise<TransactionRequest>;

  // Overload: returnTxInfo is false or undefined → returns TransactionResponse
  public async addFeesToDisputeResolver(
    disputeResolverId: BigNumberish,
    fees: accounts.DisputeResolutionFee[],
    overrides?: Partial<{
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo?: false | undefined;
    }>
  ): Promise<TransactionResponse>;

  // Implementation
  public async addFeesToDisputeResolver(
    disputeResolverId: BigNumberish,
    fees: accounts.DisputeResolutionFee[],
    overrides: Partial<{
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo?: boolean;
    }> = {}
  ): Promise<TransactionResponse | TransactionRequest> {
    const { returnTxInfo } = overrides;

    const disputeArgs = {
      disputeResolverId,
      fees,
      contractAddress: overrides.contractAddress || this._protocolDiamond,
      web3Lib: this._web3Lib
    } as const satisfies Parameters<
      typeof accounts.handler.addFeesToDisputeResolver
    >[0];

    if (returnTxInfo === true) {
      return accounts.handler.addFeesToDisputeResolver({
        ...disputeArgs,
        returnTxInfo: true
      });
    } else {
      return accounts.handler.addFeesToDisputeResolver({
        ...disputeArgs,
        returnTxInfo: false
      });
    }
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
  // Overload: returnTxInfo is true → returns TransactionRequest
  public async addSellersToDisputeResolverAllowList(
    disputeResolverId: BigNumberish,
    sellerAllowList: BigNumberish[],
    overrides: Partial<{
      returnTxInfo: true;
    }>
  ): Promise<TransactionRequest>;

  // Overload: returnTxInfo is false or undefined → returns TransactionResponse
  public async addSellersToDisputeResolverAllowList(
    disputeResolverId: BigNumberish,
    sellerAllowList: BigNumberish[],
    overrides?: Partial<{
      returnTxInfo?: false | undefined;
    }>
  ): Promise<TransactionResponse>;

  // Implementation
  public async addSellersToDisputeResolverAllowList(
    disputeResolverId: BigNumberish,
    sellerAllowList: BigNumberish[],
    overrides: Partial<{
      returnTxInfo?: boolean;
    }> = {}
  ): Promise<TransactionResponse | TransactionRequest> {
    const { returnTxInfo } = overrides;

    const args = {
      disputeResolverId,
      sellerAllowList,
      contractAddress: this._protocolDiamond,
      web3Lib: this._web3Lib
    } as const satisfies Parameters<
      typeof accounts.handler.addSellersToAllowList
    >[0];

    if (returnTxInfo === true) {
      return accounts.handler.addSellersToAllowList({
        ...args,
        returnTxInfo: true
      });
    } else {
      return accounts.handler.addSellersToAllowList({
        ...args,
        returnTxInfo: false
      });
    }
  }

  /**
   * Removes fees from a dispute resolver account by calling the `AccountHandlerFacet`
   * contract. Note, that the caller must be the specified `admin` address of the dispute
   * resolver account.
   * @param disputeResolverId - Id of dispute resolver.
   * @param feeTokenAddresses - Addresses of fee tokens to remove.
   * @returns Transaction response.
   */
  // Overload: returnTxInfo is true → returns TransactionRequest
  public async removeFeesFromDisputeResolver(
    disputeResolverId: BigNumberish,
    feeTokenAddresses: string[],
    overrides: Partial<{
      returnTxInfo: true;
    }>
  ): Promise<TransactionRequest>;

  // Overload: returnTxInfo is false or undefined → returns TransactionResponse
  public async removeFeesFromDisputeResolver(
    disputeResolverId: BigNumberish,
    feeTokenAddresses: string[],
    overrides?: Partial<{
      returnTxInfo?: false | undefined;
    }>
  ): Promise<TransactionResponse>;

  // Implementation
  public async removeFeesFromDisputeResolver(
    disputeResolverId: BigNumberish,
    feeTokenAddresses: string[],
    overrides: Partial<{
      returnTxInfo?: boolean;
    }> = {}
  ): Promise<TransactionResponse | TransactionRequest> {
    const { returnTxInfo } = overrides;

    const args = {
      disputeResolverId,
      feeTokenAddresses,
      contractAddress: this._protocolDiamond,
      web3Lib: this._web3Lib
    } as const satisfies Parameters<
      typeof accounts.handler.removeFeesFromDisputeResolver
    >[0];

    if (returnTxInfo === true) {
      return accounts.handler.removeFeesFromDisputeResolver({
        ...args,
        returnTxInfo: true
      });
    } else {
      return accounts.handler.removeFeesFromDisputeResolver({
        ...args,
        returnTxInfo: false
      });
    }
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
  // Overload: returnTxInfo is true → returns TransactionRequest
  public async removeSellersFromDisputeResolverAllowList(
    disputeResolverId: BigNumberish,
    sellerAllowList: string[],
    overrides: Partial<{
      returnTxInfo: true;
    }>
  ): Promise<TransactionRequest>;

  // Overload: returnTxInfo is false or undefined → returns TransactionResponse
  public async removeSellersFromDisputeResolverAllowList(
    disputeResolverId: BigNumberish,
    sellerAllowList: string[],
    overrides?: Partial<{
      returnTxInfo?: false | undefined;
    }>
  ): Promise<TransactionResponse>;

  // Implementation
  public async removeSellersFromDisputeResolverAllowList(
    disputeResolverId: BigNumberish,
    sellerAllowList: string[],
    overrides: Partial<{
      returnTxInfo?: boolean;
    }> = {}
  ): Promise<TransactionResponse | TransactionRequest> {
    const { returnTxInfo } = overrides;

    const args = {
      disputeResolverId,
      sellerAllowList,
      contractAddress: this._protocolDiamond,
      web3Lib: this._web3Lib
    } as const satisfies Parameters<
      typeof accounts.handler.removeSellersFromAllowList
    >[0];

    if (returnTxInfo === true) {
      return accounts.handler.removeSellersFromAllowList({
        ...args,
        returnTxInfo: true
      });
    } else {
      return accounts.handler.removeSellersFromAllowList({
        ...args,
        returnTxInfo: false
      });
    }
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

  public async createNewCollection(
    collectionToCreate: accounts.CreateCollectionArgs,
    overrides: Partial<{
      contractAddress: string;
      returnTxInfo: true;
    }>
  ): Promise<TransactionRequest>;

  public async createNewCollection(
    collectionToCreate: accounts.CreateCollectionArgs,
    overrides?: Partial<{
      contractAddress: string;
      returnTxInfo?: false | undefined;
    }>
  ): Promise<TransactionResponse>;

  public async createNewCollection(
    collectionToCreate: accounts.CreateCollectionArgs,
    overrides: Partial<{
      contractAddress: string;
      returnTxInfo?: boolean;
    }> = {}
  ): Promise<TransactionResponse | TransactionRequest> {
    const { returnTxInfo } = overrides;

    if (!collectionToCreate.sellerId) {
      const { id: sellerId } = await this.getSellerByAssistant(
        await this._web3Lib.getSignerAddress()
      );
      // If the caller is not a seller, the sellerId remains undefined
      collectionToCreate.sellerId = sellerId;
    }

    const args = {
      collectionToCreate,
      web3Lib: this._web3Lib,
      contractAddress: overrides.contractAddress || this._protocolDiamond,
      theGraphStorage: this._theGraphStorage,
      metadataStorage: this._metadataStorage
    } as const satisfies Parameters<
      typeof accounts.handler.createNewCollection
    >[0];

    if (returnTxInfo === true) {
      return accounts.handler.createNewCollection({
        ...args,
        returnTxInfo: true
      });
    } else {
      return accounts.handler.createNewCollection({
        ...args,
        returnTxInfo: false
      });
    }
  }

  public async getOfferCollections(
    queryVars?: subgraph.GetOfferCollectionsQueryQueryVariables
  ): Promise<subgraph.OfferCollectionFieldsFragment[]> {
    return accounts.subgraph.getOfferCollections(this._subgraphUrl, queryVars);
  }

  public async addRoyaltyRecipients(
    sellerId: BigNumberish,
    royaltyRecipients: accounts.RoyaltyRecipientInfo[],
    overrides: Partial<{
      contractAddress: string;
      returnTxInfo: true;
    }>
  ): Promise<TransactionRequest>;

  public async addRoyaltyRecipients(
    sellerId: BigNumberish,
    royaltyRecipients: accounts.RoyaltyRecipientInfo[],
    overrides?: Partial<{
      contractAddress: string;
      returnTxInfo?: false | undefined;
    }>
  ): Promise<TransactionResponse>;

  public async addRoyaltyRecipients(
    sellerId: BigNumberish,
    royaltyRecipients: accounts.RoyaltyRecipientInfo[],
    overrides: Partial<{
      contractAddress: string;
      returnTxInfo?: boolean;
    }> = {}
  ): Promise<TransactionResponse | TransactionRequest> {
    const { returnTxInfo } = overrides;

    const args = {
      sellerId,
      royaltyRecipients,
      web3Lib: this._web3Lib,
      contractAddress: overrides.contractAddress || this._protocolDiamond
    } as const satisfies Parameters<
      typeof accounts.handler.addRoyaltyRecipients
    >[0];

    if (returnTxInfo === true) {
      return accounts.handler.addRoyaltyRecipients({
        ...args,
        returnTxInfo: true
      });
    } else {
      return accounts.handler.addRoyaltyRecipients({
        ...args,
        returnTxInfo: false
      });
    }
  }

  public async updateRoyaltyRecipients(
    sellerId: BigNumberish,
    royaltyRecipientIds: BigNumberish[],
    royaltyRecipients: accounts.RoyaltyRecipientInfo[],
    overrides: Partial<{
      contractAddress: string;
      returnTxInfo: true;
    }>
  ): Promise<TransactionRequest>;

  public async updateRoyaltyRecipients(
    sellerId: BigNumberish,
    royaltyRecipientIds: BigNumberish[],
    royaltyRecipients: accounts.RoyaltyRecipientInfo[],
    overrides?: Partial<{
      contractAddress: string;
      returnTxInfo?: false | undefined;
    }>
  ): Promise<TransactionResponse>;

  public async updateRoyaltyRecipients(
    sellerId: BigNumberish,
    royaltyRecipientIds: BigNumberish[],
    royaltyRecipients: accounts.RoyaltyRecipientInfo[],
    overrides: Partial<{
      contractAddress: string;
      returnTxInfo?: boolean;
    }> = {}
  ): Promise<TransactionResponse | TransactionRequest> {
    const { returnTxInfo } = overrides;

    const args = {
      sellerId,
      royaltyRecipientIds,
      royaltyRecipients,
      web3Lib: this._web3Lib,
      contractAddress: overrides.contractAddress || this._protocolDiamond
    } as const satisfies Parameters<
      typeof accounts.handler.updateRoyaltyRecipients
    >[0];

    if (returnTxInfo === true) {
      return accounts.handler.updateRoyaltyRecipients({
        ...args,
        returnTxInfo: true
      });
    } else {
      return accounts.handler.updateRoyaltyRecipients({
        ...args,
        returnTxInfo: false
      });
    }
  }

  public async removeRoyaltyRecipients(
    sellerId: BigNumberish,
    royaltyRecipientIds: BigNumberish[],
    overrides: Partial<{
      contractAddress: string;
      returnTxInfo: true;
    }>
  ): Promise<TransactionRequest>;

  public async removeRoyaltyRecipients(
    sellerId: BigNumberish,
    royaltyRecipientIds: BigNumberish[],
    overrides?: Partial<{
      contractAddress: string;
      returnTxInfo?: false | undefined;
    }>
  ): Promise<TransactionResponse>;

  public async removeRoyaltyRecipients(
    sellerId: BigNumberish,
    royaltyRecipientIds: BigNumberish[],
    overrides: Partial<{
      contractAddress: string;
      returnTxInfo?: boolean;
    }> = {}
  ): Promise<TransactionResponse | TransactionRequest> {
    const { returnTxInfo } = overrides;

    const args = {
      sellerId,
      royaltyRecipientIds,
      web3Lib: this._web3Lib,
      contractAddress: overrides.contractAddress || this._protocolDiamond
    } as const satisfies Parameters<
      typeof accounts.handler.removeRoyaltyRecipients
    >[0];

    if (returnTxInfo === true) {
      return accounts.handler.removeRoyaltyRecipients({
        ...args,
        returnTxInfo: true
      });
    } else {
      return accounts.handler.removeRoyaltyRecipients({
        ...args,
        returnTxInfo: false
      });
    }
  }

  public async getRoyaltyRecipients(
    sellerId: BigNumberish,
    overrides: Partial<{
      contractAddress: string;
    }> = {}
  ) {
    return accounts.handler.getRoyaltyRecipients({
      sellerId,
      web3Lib: this._web3Lib,
      contractAddress: overrides.contractAddress || this._protocolDiamond
    });
  }
}
