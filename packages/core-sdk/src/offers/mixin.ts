import { BaseCoreSDK } from "./../mixins/base-core-sdk";
import * as erc20 from "../erc20";
import * as erc721 from "../erc721";
import * as erc1155 from "../erc1155";
import * as subgraph from "../subgraph";
import * as offers from ".";
import * as accounts from "../accounts";
import * as orchestration from "../orchestration";
import * as groups from "../groups";
import {
  TransactionResponse,
  Log,
  TokenType,
  EvaluationMethod
} from "@bosonprotocol/common";
import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { getValueFromLogs, getValuesFromLogs } from "../utils/logs";
import { ITokenInfo, TokenInfoManager } from "../utils/tokenInfoManager";

export class OfferMixin extends BaseCoreSDK {
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
    const offerId = getValueFromLogs<string>({
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
    const sellerId = getValueFromLogs<string>({
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
        this._web3Lib,
        this._subgraphUrl
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

  public async checkTokenGatedCondition(
    offerCondition: subgraph.OfferFieldsFragment["condition"],
    buyerAddress: string
  ): Promise<boolean> {
    const { tokenId, tokenType, threshold, method, tokenAddress } =
      offerCondition;
    if (tokenType === TokenType.FungibleToken) {
      const balance: string = await erc20.handler.balanceOf({
        contractAddress: tokenAddress,
        owner: buyerAddress,
        web3Lib: this._web3Lib
      });
      return BigNumber.from(balance).gte(threshold);
    }
    if (tokenType === TokenType.NonFungibleToken) {
      if (method === EvaluationMethod.Threshold) {
        const balance: string = await erc721.handler.balanceOf({
          contractAddress: tokenAddress,
          owner: buyerAddress,
          web3Lib: this._web3Lib
        });
        return BigNumber.from(balance).gte(threshold);
      }
      if (method === EvaluationMethod.SpecificToken) {
        const owner: string = await erc721.handler.ownerOf({
          contractAddress: tokenAddress,
          tokenId,
          web3Lib: this._web3Lib
        });
        return owner === buyerAddress;
      }
      throw new Error(
        `Unsupported method=${method} for this tokenType=${tokenType}`
      );
    }
    if (tokenType === TokenType.MultiToken) {
      const balance: string = await erc1155.handler.balanceOf({
        contractAddress: tokenAddress,
        tokenId,
        owner: buyerAddress,
        web3Lib: this._web3Lib
      });
      return BigNumber.from(balance).gte(threshold);
    }
    throw new Error(`Unsupported tokenType=${tokenType}`);
  }
}
