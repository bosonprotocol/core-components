import { BaseCoreSDK } from "./../mixins/base-core-sdk";
import {
  AuthTokenType,
  TransactionResponse,
  Log,
  CreateSellerArgs,
  UpdateSellerArgs,
  OptInToSellerUpdateArgs,
  OptInToDisputeResolverUpdateArgs,
  CreateOfferArgs
} from "@bosonprotocol/common";
import { BigNumberish, BigNumber } from "@ethersproject/bignumber";
import { AddressZero } from "@ethersproject/constants";
import { getValueFromLogs, getValuesFromLogsExt } from "../utils/logs";
import {
  getBuyerById,
  getBuyers,
  getDisputeResolverById,
  getDisputeResolvers,
  getSellerByAddress,
  getSellerByAdmin,
  getSellerByAuthToken,
  getSellerByClerk,
  getSellerById,
  getSellerByOperator,
  getSellerByTreasury,
  getSellers,
  SingleBuyerQueryVariables,
  SingleDisputeResolverQueryVariables,
  SingleSellerQueryVariables
} from "./subgraph";
import {
  CreateDisputeResolverArgs,
  DisputeResolutionFee,
  DisputeResolverUpdates
} from "./index";
import {
  activateDisputeResolver,
  addFeesToDisputeResolver,
  addSellersToAllowList,
  createDisputeResolver,
  createSeller,
  optInToDisputeResolverUpdate,
  optInToSellerUpdate,
  removeFeesFromDisputeResolver,
  removeSellersFromAllowList,
  updateDisputeResolver,
  updateSeller
} from "./handler";
import { createOfferAndSeller } from "../orchestration/handler";
import { bosonAccountHandlerIface } from "./interface";
import {
  BuyerFieldsFragment,
  DisputeResolverFieldsFragment,
  GetBuyersQueryQueryVariables,
  GetDisputeResolversQueryQueryVariables,
  GetSellersQueryQueryVariables,
  SellerFieldsFragment
} from "../subgraph";
import {
  balanceOf as erc721_balanceOf,
  tokenOfOwnerByIndex
} from "../erc721/handler";

export class AccountsMixin extends BaseCoreSDK {
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
    queryVars?: SingleSellerQueryVariables
  ): Promise<SellerFieldsFragment> {
    return getSellerById(this._subgraphUrl, sellerId, queryVars);
  }

  /**
   * Returns seller entity from subgraph.
   * @param operator - Operator address of seller entity to query for.
   * @param queryVars - Optional query variables to skip, order or filter.
   * @returns Seller entity from subgraph.
   */
  public async getSellerByOperator(
    operator: string,
    queryVars?: GetSellersQueryQueryVariables
  ): Promise<SellerFieldsFragment> {
    return getSellerByOperator(this._subgraphUrl, operator, queryVars);
  }

  /**
   * Returns seller entity from subgraph.
   * @param clerk - Clerk address of seller entity to query for.
   * @param queryVars - Optional query variables to skip, order or filter.
   * @returns Seller entity from subgraph.
   */
  public async getSellerByClerk(
    clerk: string,
    queryVars?: GetSellersQueryQueryVariables
  ): Promise<SellerFieldsFragment> {
    return getSellerByClerk(this._subgraphUrl, clerk, queryVars);
  }

  /**
   * Returns seller entity from subgraph.
   * @param admin - Admin address of seller entity to query for.
   * @param queryVars - Optional query variables to skip, order or filter.
   * @returns Seller entity from subgraph.
   */
  public async getSellerByAdmin(
    admin: string,
    queryVars?: GetSellersQueryQueryVariables
  ): Promise<SellerFieldsFragment> {
    return getSellerByAdmin(this._subgraphUrl, admin, queryVars);
  }

  /**
   * Returns seller entity from subgraph.
   * @param treasury - Treasury address of seller entity to query for.
   * @param queryVars - Optional query variables to skip, order or filter.
   * @returns Seller entity from subgraph.
   */
  public async getSellerByTreasury(
    treasury: string,
    queryVars?: GetSellersQueryQueryVariables
  ): Promise<SellerFieldsFragment> {
    return getSellerByTreasury(this._subgraphUrl, treasury, queryVars);
  }

  /**
   * Returns seller entity from subgraph. Matches `operator`, `clerk`, `admin` or `treasury`.
   * @param address - Address of seller entity to query for.
   * @param queryVars - Optional query variables to skip, order or filter.
   * @returns Seller entity from subgraph.
   */
  public async getSellersByAddress(
    address: string,
    queryVars?: GetSellersQueryQueryVariables
  ): Promise<SellerFieldsFragment[]> {
    if (address === AddressZero) {
      throw new Error(`Unsupported search address '${AddressZero}'`);
    }
    const seller = await getSellerByAddress(
      this._subgraphUrl,
      address,
      queryVars
    );
    if (!seller && this._lensContracts?.LENS_HUB_CONTRACT) {
      // If seller is not found per address, try to find per authToken
      const tokenType = AuthTokenType.LENS; // only LENS for now
      const tokenIds = await this.fetchUserAuthTokens(address, tokenType);
      const promises: Promise<SellerFieldsFragment>[] = [];
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
    const balance = await erc721_balanceOf({
      contractAddress: this._lensContracts?.LENS_HUB_CONTRACT,
      owner: address,
      web3Lib: this._web3Lib
    });

    const balanceBN = BigNumber.from(balance);
    const promises: Promise<string>[] = [];
    for (let index = 0; balanceBN.gt(index); index++) {
      const tokenIdPromise = tokenOfOwnerByIndex({
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
    queryVars?: GetSellersQueryQueryVariables
  ): Promise<SellerFieldsFragment> {
    if (tokenType !== AuthTokenType.LENS) {
      // only LENS for now
      throw new Error(`Unsupported authTokenType '${tokenType}'`);
    }
    return getSellerByAuthToken(
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
    queryVars?: GetSellersQueryQueryVariables
  ): Promise<SellerFieldsFragment[]> {
    return getSellers(this._subgraphUrl, queryVars);
  }

  /**
   * Creates seller account by calling the `AccountHandlerFacet` contract.
   * @param sellerToCreate - Addresses and contract URI to set in the seller account.
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
  public async createSeller(
    sellerToCreate: CreateSellerArgs,
    overrides: Partial<{
      contractAddress: string;
    }> = {}
  ): Promise<TransactionResponse> {
    return createSeller({
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
    sellerToCreate: CreateSellerArgs,
    offerToCreate: CreateOfferArgs,
    overrides: Partial<{
      contractAddress: string;
    }> = {}
  ): Promise<TransactionResponse> {
    return createOfferAndSeller({
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
    sellerUpdates: UpdateSellerArgs,
    overrides: Partial<{
      contractAddress: string;
    }> = {}
  ): Promise<TransactionResponse> {
    return updateSeller({
      sellerUpdates,
      web3Lib: this._web3Lib,
      contractAddress: overrides.contractAddress || this._protocolDiamond
    });
  }

  /**
   * Opt-in to a pending seller update by calling the `AccountHandlerFacet` contract. Only callable
   * by admin.
   * @param sellerUpdates - Values to update.
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
  public async optInToSellerUpdate(
    sellerUpdates: OptInToSellerUpdateArgs,
    overrides: Partial<{
      contractAddress: string;
    }> = {}
  ): Promise<TransactionResponse> {
    return optInToSellerUpdate({
      sellerUpdates,
      web3Lib: this._web3Lib,
      contractAddress: overrides.contractAddress || this._protocolDiamond
    });
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
    sellerUpdates: UpdateSellerArgs,
    overrides: Partial<{
      contractAddress: string;
    }> = {}
  ): Promise<TransactionResponse> {
    const updateTx = await this.updateSeller(sellerUpdates, overrides);
    const txReceipt = await updateTx.wait();
    const pendingSellerUpdate = this.getPendingSellerUpdateFromLogs(
      txReceipt.logs
    );
    // Find all updates that can be opted in by the current account
    const currentAccount = (
      await this._web3Lib.getSignerAddress()
    ).toLowerCase();
    const fieldsToUpdate = {
      operator: currentAccount === pendingSellerUpdate.operator?.toLowerCase(),
      clerk: currentAccount === pendingSellerUpdate.clerk?.toLowerCase(),
      admin: currentAccount === pendingSellerUpdate.admin?.toLowerCase(),
      authToken:
        pendingSellerUpdate.tokenType !== undefined &&
        pendingSellerUpdate.tokenType !== null &&
        pendingSellerUpdate.tokenType !== AuthTokenType.NONE
    };
    if (
      fieldsToUpdate.operator ||
      fieldsToUpdate.clerk ||
      fieldsToUpdate.admin ||
      fieldsToUpdate.authToken
    ) {
      return this.optInToSellerUpdate({
        id: sellerUpdates.id,
        fieldsToUpdate: {
          operator:
            currentAccount === pendingSellerUpdate.operator.toLowerCase(),
          clerk: currentAccount === pendingSellerUpdate.clerk.toLowerCase(),
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
    queryVars?: SingleBuyerQueryVariables
  ): Promise<BuyerFieldsFragment> {
    return getBuyerById(this._subgraphUrl, buyerId, queryVars);
  }

  /**
   * Returns buyer entities from subgraph.
   * @param queryVars - Optional query variables to skip, order or filter.
   * @returns Buyer entities from subgraph.
   */
  public async getBuyers(
    queryVars?: GetBuyersQueryQueryVariables
  ): Promise<BuyerFieldsFragment[]> {
    return getBuyers(this._subgraphUrl, queryVars);
  }

  /* ---------------------------- Dispute Resolver ---------------------------- */

  /**
   * Creates a dispute resolver account by calling the `AccountHandlerFacet` contract.
   * @param disputeResolverToCreate - Dispute resolver arguments.
   * @returns Transaction response.
   */
  public async createDisputeResolver(
    disputeResolverToCreate: CreateDisputeResolverArgs
  ): Promise<TransactionResponse> {
    return createDisputeResolver({
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
      iface: bosonAccountHandlerIface,
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
    operator: string;
    clerk: string;
    admin: string;
    tokenType: number;
    tokenId: BigNumber;
  } {
    // Extract fields pendingSeller and pendingAuthToken from
    // SellerUpdatePending or SellerUpdateApplied events
    const valuesFromLogs = getValuesFromLogsExt<
      | {
          operator: string;
          clerk: string;
          admin: string;
        }
      | {
          tokenType: number;
          tokenId: BigNumber;
        }
    >({
      iface: bosonAccountHandlerIface,
      logs,
      eventArgsKeys: ["pendingSeller", "pendingAuthToken"],
      eventNames: ["SellerUpdatePending", "SellerUpdateApplied"]
    });
    const pendingSellerStruct = (
      valuesFromLogs["pendingSeller"] as {
        operator: string;
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
    return {
      operator: pendingSellerStruct?.operator,
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
  public async updateDisputeResolver(
    disputeResolverId: BigNumberish,
    updates: DisputeResolverUpdates
  ): Promise<TransactionResponse> {
    return updateDisputeResolver({
      disputeResolverId,
      updates,
      subgraphUrl: this._subgraphUrl,
      contractAddress: this._protocolDiamond,
      web3Lib: this._web3Lib
    });
  }

  public async optInToDisputeResolverUpdate(
    disputeResolverUpdates: OptInToDisputeResolverUpdateArgs,
    overrides: Partial<{
      contractAddress: string;
    }> = {}
  ): Promise<TransactionResponse> {
    return optInToDisputeResolverUpdate({
      disputeResolverUpdates,
      web3Lib: this._web3Lib,
      contractAddress: overrides.contractAddress || this._protocolDiamond
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
    return activateDisputeResolver({
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
    fees: DisputeResolutionFee[]
  ): Promise<TransactionResponse> {
    return addFeesToDisputeResolver({
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
    return addSellersToAllowList({
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
    return removeFeesFromDisputeResolver({
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
    return removeSellersFromAllowList({
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
    queryVars?: SingleDisputeResolverQueryVariables
  ): Promise<DisputeResolverFieldsFragment> {
    return getDisputeResolverById(
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
    queryVars?: GetDisputeResolversQueryQueryVariables
  ): Promise<DisputeResolverFieldsFragment[]> {
    return getDisputeResolvers(this._subgraphUrl, queryVars);
  }
}
