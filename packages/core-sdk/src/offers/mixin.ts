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
  EvaluationMethod,
  GatingType,
  RoyaltyInfo,
  TransactionRequest,
  Web3LibAdapter
} from "@bosonprotocol/common";
import groupBy from "lodash/groupBy";
import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { getValueFromLogs, getValuesFromLogs } from "../utils/logs";
import { ITokenInfo, TokenInfoManager } from "../utils/tokenInfoManager";
import { batchTasks } from "../utils/promises";
import { EventLogsMixin } from "../event-logs/mixin";
import { AccountsMixin } from "../accounts/mixin";

export class OfferMixin<T extends Web3LibAdapter> extends BaseCoreSDK<T> {
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
  // Overload: returnTxInfo is true → returns TransactionRequest
  public async createOffer(
    offerToCreate: offers.CreateOfferArgs,
    overrides: Partial<{
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo: true;
    }>
  ): Promise<TransactionRequest>;

  // Overload: returnTxInfo is false or undefined → returns TransactionResponse
  public async createOffer(
    offerToCreate: offers.CreateOfferArgs,
    overrides?: Partial<{
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo?: false | undefined;
    }>
  ): Promise<TransactionResponse>;

  // Implementation
  public async createOffer(
    offerToCreate: offers.CreateOfferArgs,
    overrides: Partial<{
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo?: boolean;
    }> = {}
  ): Promise<TransactionResponse | TransactionRequest> {
    const { returnTxInfo } = overrides;

    const offerArgs = {
      offerToCreate,
      web3Lib: this._web3Lib,
      theGraphStorage: this._theGraphStorage,
      metadataStorage: this._metadataStorage,
      subgraphUrl: this._subgraphUrl,
      contractAddress: overrides.contractAddress || this._protocolDiamond,
      txRequest: overrides.txRequest
    } as const satisfies Parameters<typeof offers.handler.createOffer>[0];

    if (returnTxInfo === true) {
      return offers.handler.createOffer({
        ...offerArgs,
        returnTxInfo: true
      });
    } else {
      return offers.handler.createOffer({
        ...offerArgs,
        returnTxInfo: false
      });
    }
  }

  /**
   * Creates a batch of offers by calling the `OfferHandlerFacet` contract.
   * This transaction only succeeds if there is an existing seller account for connected signer.
   * @param offersToCreate - Offer arguments.
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
  // Overload: returnTxInfo is true → returns TransactionRequest
  public async createOfferBatch(
    offersToCreate: offers.CreateOfferArgs[],
    overrides: Partial<{
      contractAddress: string;
      returnTxInfo: true;
    }>
  ): Promise<TransactionRequest>;

  // Overload: returnTxInfo is false or undefined → returns TransactionResponse
  public async createOfferBatch(
    offersToCreate: offers.CreateOfferArgs[],
    overrides?: Partial<{
      contractAddress: string;
      returnTxInfo?: false | undefined;
    }>
  ): Promise<TransactionResponse>;

  // Implementation
  public async createOfferBatch(
    offersToCreate: offers.CreateOfferArgs[],
    overrides: Partial<{
      contractAddress: string;
      returnTxInfo?: boolean;
    }> = {}
  ): Promise<TransactionResponse | TransactionRequest> {
    const { returnTxInfo } = overrides;

    const batchArgs = {
      offersToCreate,
      web3Lib: this._web3Lib,
      theGraphStorage: this._theGraphStorage,
      metadataStorage: this._metadataStorage,
      contractAddress: overrides.contractAddress || this._protocolDiamond
    } as const satisfies Parameters<typeof offers.handler.createOfferBatch>[0];

    if (returnTxInfo === true) {
      return offers.handler.createOfferBatch({
        ...batchArgs,
        returnTxInfo: true
      });
    } else {
      return offers.handler.createOfferBatch({
        ...batchArgs,
        returnTxInfo: false
      });
    }
  }

  /**
   * Utility method to retrieve the created `offerId` from logs after calling `createOffer`
   * or `createOfferAndSeller`.
   * @param logs - Logs to search in.
   * @returns Created offer id.
   */
  public getCreatedOfferIdFromLogs(logs: Log[]): string | null {
    const offerId = getValueFromLogs<BigNumber>({
      iface: offers.iface.bosonOfferHandlerIface,
      logs,
      eventArgsKey: "offerId",
      eventName: "OfferCreated"
    });

    return (
      offerId ||
      getValueFromLogs<BigNumber>({
        iface: orchestration.iface.bosonOrchestrationHandlerIface,
        logs,
        eventArgsKey: "offerId",
        eventName: "OfferCreated"
      })
    )?.toString();
  }

  /**
   * Utility method to retrieve the created `offerIds` from logs after calling `createOfferBatch`
   * @param logs - Logs to search in.
   * @returns Array of created offerIds.
   */
  public getCreatedOfferIdsFromLogs(logs: Log[]): string[] {
    return getValuesFromLogs<BigNumber>({
      iface: offers.iface.bosonOfferHandlerIface,
      logs,
      eventArgsKey: "offerId",
      eventName: "OfferCreated"
    }).map((o) => o.toString());
  }

  /**
   * Utility method to retrieve the created `groupIds` from logs after calling `createGroup`
   * @param logs - Logs to search in.
   * @returns Array of group Ids.
   */
  public getCreatedGroupIdsFromLogs(logs: Log[]): string[] {
    return getValuesFromLogs<BigNumber>({
      iface: groups.iface.bosonGroupHandlerIface,
      logs,
      eventArgsKey: "groupId",
      eventName: "GroupCreated"
    }).map((g) => g.toString());
  }

  /**
   * Utility method to retrieve the created `sellerId` from logs after calling `createSeller`
   * or `createOfferAndSeller`.
   * @param logs - Logs to search in.
   * @returns Created offer id.
   */
  public getCreatedSellerIdFromLogs(logs: Log[]): string | null {
    const sellerId = getValueFromLogs<BigNumber>({
      iface: accounts.iface.bosonAccountHandlerIface,
      logs,
      eventArgsKey: "sellerId",
      eventName: "SellerCreated"
    });

    return (
      sellerId ||
      getValueFromLogs<BigNumber>({
        iface: orchestration.iface.bosonOrchestrationHandlerIface,
        logs,
        eventArgsKey: "sellerId",
        eventName: "SellerCreated"
      })
    )?.toString();
  }

  /**
   * Voids an existing offer by calling the `OfferHandlerFacet` contract.
   * This transaction only succeeds if the connected signer is the `assistant`.
   * @param offerId - ID of offer to void.
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
  // Overload: returnTxInfo is true → returns TransactionRequest
  public async voidOffer(
    offerId: BigNumberish,
    overrides: Partial<{
      contractAddress: string;
      returnTxInfo: true;
    }>
  ): Promise<TransactionRequest>;

  // Overload: returnTxInfo is false or undefined → returns TransactionResponse
  public async voidOffer(
    offerId: BigNumberish,
    overrides?: Partial<{
      contractAddress: string;
      returnTxInfo?: false | undefined;
    }>
  ): Promise<TransactionResponse>;

  // Implementation
  public async voidOffer(
    offerId: BigNumberish,
    overrides: Partial<{
      contractAddress: string;
      returnTxInfo?: boolean;
    }> = {}
  ): Promise<TransactionResponse | TransactionRequest> {
    const { returnTxInfo } = overrides;

    const voidArgs = {
      offerId,
      web3Lib: this._web3Lib,
      subgraphUrl: this._subgraphUrl,
      contractAddress: overrides.contractAddress || this._protocolDiamond
    } as const satisfies Parameters<typeof offers.handler.voidOffer>[0];

    if (returnTxInfo === true) {
      return offers.handler.voidOffer({
        ...voidArgs,
        returnTxInfo: true
      });
    } else {
      return offers.handler.voidOffer({
        ...voidArgs,
        returnTxInfo: false
      });
    }
  }

  /**
   * Voids a batch of existing offers by calling the `OfferHandlerFacet` contract.
   * This transaction only succeeds if the connected signer is the `assistant` of all
   * provided offers.
   * @param offerIds - IDs of offers to void.
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
  // Overload: returnTxInfo is true → returns TransactionRequest
  public async voidOfferBatch(
    offerIds: BigNumberish[],
    overrides: Partial<{
      contractAddress: string;
      returnTxInfo: true;
    }>
  ): Promise<TransactionRequest>;

  // Overload: returnTxInfo is false or undefined → returns TransactionResponse
  public async voidOfferBatch(
    offerIds: BigNumberish[],
    overrides?: Partial<{
      contractAddress: string;
      returnTxInfo?: false | undefined;
    }>
  ): Promise<TransactionResponse>;

  // Implementation
  public async voidOfferBatch(
    offerIds: BigNumberish[],
    overrides: Partial<{
      contractAddress: string;
      returnTxInfo?: boolean;
    }> = {}
  ): Promise<TransactionResponse | TransactionRequest> {
    const { returnTxInfo } = overrides;

    const batchArgs = {
      offerIds,
      web3Lib: this._web3Lib,
      subgraphUrl: this._subgraphUrl,
      contractAddress: overrides.contractAddress || this._protocolDiamond
    } as const satisfies Parameters<typeof offers.handler.voidOfferBatch>[0];

    if (returnTxInfo === true) {
      return offers.handler.voidOfferBatch({
        ...batchArgs,
        returnTxInfo: true
      });
    } else {
      return offers.handler.voidOfferBatch({
        ...batchArgs,
        returnTxInfo: false
      });
    }
  }

  /**
   * Extends an existing offer by calling the `OfferHandlerFacet` contract.
   * This transaction only succeeds if the connected signer is the `assistant`.
   * @param offerId - ID of offer to void.
   * @param validUntil - new validity date.
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
  // Overload: returnTxInfo is true → returns TransactionRequest
  public async extendOffer(
    offerId: BigNumberish,
    validUntil: BigNumberish,
    overrides: Partial<{
      contractAddress: string;
      returnTxInfo: true;
    }>
  ): Promise<TransactionRequest>;

  // Overload: returnTxInfo is false or undefined → returns TransactionResponse
  public async extendOffer(
    offerId: BigNumberish,
    validUntil: BigNumberish,
    overrides?: Partial<{
      contractAddress: string;
      returnTxInfo?: false | undefined;
    }>
  ): Promise<TransactionResponse>;

  // Implementation
  public async extendOffer(
    offerId: BigNumberish,
    validUntil: BigNumberish,
    overrides: Partial<{
      contractAddress: string;
      returnTxInfo?: boolean;
    }> = {}
  ): Promise<TransactionResponse | TransactionRequest> {
    const { returnTxInfo } = overrides;

    const extendArgs = {
      offerId,
      validUntil,
      web3Lib: this._web3Lib,
      subgraphUrl: this._subgraphUrl,
      contractAddress: overrides.contractAddress || this._protocolDiamond
    } as const satisfies Parameters<typeof offers.handler.extendOffer>[0];

    if (returnTxInfo === true) {
      return offers.handler.extendOffer({
        ...extendArgs,
        returnTxInfo: true
      });
    } else {
      return offers.handler.extendOffer({
        ...extendArgs,
        returnTxInfo: false
      });
    }
  }

  /**
   * Extends a batch of existing offers by calling the `OfferHandlerFacet` contract.
   * This transaction only succeeds if the connected signer is the `assistant` of all
   * provided offers.
   * @param offerIds - IDs of offers to void.
   * @param validUntil - new validity date.
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
  // Overload: returnTxInfo is true → returns TransactionRequest
  public async extendOfferBatch(
    offerIds: BigNumberish[],
    validUntil: BigNumberish,
    overrides: Partial<{
      contractAddress: string;
      returnTxInfo: true;
    }>
  ): Promise<TransactionRequest>;

  // Overload: returnTxInfo is false or undefined → returns TransactionResponse
  public async extendOfferBatch(
    offerIds: BigNumberish[],
    validUntil: BigNumberish,
    overrides?: Partial<{
      contractAddress: string;
      returnTxInfo?: false | undefined;
    }>
  ): Promise<TransactionResponse>;

  // Implementation
  public async extendOfferBatch(
    offerIds: BigNumberish[],
    validUntil: BigNumberish,
    overrides: Partial<{
      contractAddress: string;
      returnTxInfo?: boolean;
    }> = {}
  ): Promise<TransactionResponse | TransactionRequest> {
    const { returnTxInfo } = overrides;

    const batchArgs = {
      offerIds,
      validUntil,
      web3Lib: this._web3Lib,
      subgraphUrl: this._subgraphUrl,
      contractAddress: overrides.contractAddress || this._protocolDiamond
    } as const satisfies Parameters<typeof offers.handler.extendOfferBatch>[0];

    if (returnTxInfo === true) {
      return offers.handler.extendOfferBatch({
        ...batchArgs,
        returnTxInfo: true
      });
    } else {
      return offers.handler.extendOfferBatch({
        ...batchArgs,
        returnTxInfo: false
      });
    }
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

  /**
   * Reserves a range of vouchers to be associated with an offer
   * @param offerId -  Offer ID
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
  // Overload: returnTxInfo is true → returns TransactionRequest
  public async reserveRange(
    offerId: BigNumberish,
    length: BigNumberish,
    to: "seller" | "contract",
    overrides: Partial<{
      contractAddress: string;
      returnTxInfo: true;
    }>
  ): Promise<TransactionRequest>;

  // Overload: returnTxInfo is false or undefined → returns TransactionResponse
  public async reserveRange(
    offerId: BigNumberish,
    length: BigNumberish,
    to: "seller" | "contract",
    overrides?: Partial<{
      contractAddress: string;
      returnTxInfo?: false | undefined;
    }>
  ): Promise<TransactionResponse>;

  // Implementation
  public async reserveRange(
    offerId: BigNumberish,
    length: BigNumberish,
    to: "seller" | "contract",
    overrides: Partial<{
      contractAddress: string;
      returnTxInfo?: boolean;
    }> = {}
  ): Promise<TransactionResponse | TransactionRequest> {
    const { returnTxInfo } = overrides;
    const offer = await this.getOfferById(offerId);

    const reserveArgs = {
      offerId,
      length,
      to:
        to === "contract"
          ? offer.seller.voucherCloneAddress
          : offer.seller.assistant,
      subgraphUrl: this._subgraphUrl,
      contractAddress: overrides.contractAddress || this._protocolDiamond,
      web3Lib: this._web3Lib
    } as const satisfies Parameters<typeof offers.handler.reserveRange>[0];

    if (returnTxInfo === true) {
      return offers.handler.reserveRange({
        ...reserveArgs,
        returnTxInfo: true
      });
    } else {
      return offers.handler.reserveRange({
        ...reserveArgs,
        returnTxInfo: false
      });
    }
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
  ): Promise<ITokenInfo | undefined> {
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
  // Overload: returnTxInfo is true → returns TransactionRequest
  public async approveExchangeToken(
    exchangeToken: string,
    value: BigNumberish,
    overrides: Partial<{
      spender: string;
      returnTxInfo: true;
    }>
  ): Promise<TransactionRequest>;

  // Overload: returnTxInfo is false or undefined → returns TransactionResponse
  public async approveExchangeToken(
    exchangeToken: string,
    value: BigNumberish,
    overrides?: Partial<{
      spender: string;
      returnTxInfo?: false | undefined;
    }>
  ): Promise<TransactionResponse>;

  // Implementation
  public async approveExchangeToken(
    exchangeToken: string,
    value: BigNumberish,
    overrides: Partial<{
      spender: string;
      returnTxInfo?: boolean;
    }> = {}
  ): Promise<TransactionResponse | TransactionRequest> {
    const { returnTxInfo } = overrides;

    const approveArgs = {
      contractAddress: exchangeToken,
      spender: overrides.spender || this._protocolDiamond,
      value,
      web3Lib: this._web3Lib
    } as const satisfies Parameters<typeof erc20.handler.approve>[0];

    if (returnTxInfo === true) {
      return erc20.handler.approve({
        ...approveArgs,
        returnTxInfo: true
      });
    } else {
      return erc20.handler.approve({
        ...approveArgs,
        returnTxInfo: false
      });
    }
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
    offerId: subgraph.OfferFieldsFragment["id"],
    buyerAddress: string
  ): Promise<boolean> {
    const offer = await this.getOfferById(offerId);

    if (!offer?.condition) {
      return true;
    }
    const offerConditionId = offer.condition.id;
    const getCanTokenIdBeUsedToCommit = async (): Promise<
      (tokenId: string) => boolean
    > => {
      const conditionalCommitLogs = await (
        this as unknown as EventLogsMixin<Web3LibAdapter>
      ).getConditionalCommitAuthorizedEventLogs({
        conditionalCommitAuthorizedLogsFilter: {
          groupId: offerConditionId, // all offers of the same product have the same condition.id
          buyerAddress
        }
      });

      const tokenIdMapWithMultipleEntries = groupBy(
        conditionalCommitLogs,
        (log) => log.tokenId
      );
      type TokenId = string;
      // build a map of tokenId -> log with the min available commits (or the most recent log) in all the logs
      const tokenIdToAvailableCommitsMap = new Map<
        TokenId,
        subgraph.BaseConditionalCommitAuthorizedEventLogsFieldsFragment
      >();
      Object.entries(tokenIdMapWithMultipleEntries).forEach(
        ([tokenId, logs]) => {
          let logWithMinAvailableCommits = logs[0];
          for (const log of logs) {
            const currentAvailableCommits =
              Number(log.maxCommits) - Number(log.commitCount);
            const savedAvailableCommits =
              Number(logWithMinAvailableCommits.maxCommits) -
              Number(logWithMinAvailableCommits.commitCount);
            if (currentAvailableCommits < savedAvailableCommits) {
              logWithMinAvailableCommits = log;
            }
          }
          tokenIdToAvailableCommitsMap.set(tokenId, logWithMinAvailableCommits);
        }
      );
      const canTokenIdBeUsedToCommit = (tokenId: TokenId): boolean => {
        if (!tokenIdToAvailableCommitsMap.has(tokenId)) {
          return true;
        }
        const log = tokenIdToAvailableCommitsMap.get(tokenId);
        if (!log) {
          return true;
        }
        return Number(log.maxCommits) - Number(log.commitCount) > 0;
      };
      return canTokenIdBeUsedToCommit;
    };

    const getCurrentCommits = async (): Promise<number> => {
      const buyers = await (
        this as unknown as AccountsMixin<Web3LibAdapter>
      ).getBuyers({
        buyersFilter: {
          wallet: buyerAddress
        },
        includeExchanges: true,
        exchangesFilter: {
          offer_: {
            condition: offerConditionId
          }
        }
      });
      const [buyer] = buyers ?? [];
      return buyer?.exchanges?.length ?? 0;
    };

    const concurrencyLimit = 5;
    const {
      minTokenId: _minTokenId,
      maxTokenId: _maxTokenId,
      tokenType,
      threshold,
      method,
      tokenAddress,
      gatingType,
      maxCommits: _maxCommits
    } = offer.condition;
    const minTokenId = BigInt(_minTokenId);
    const maxTokenId = BigInt(_maxTokenId);
    const returnTrueBecauseItCannotBeChecked = () => {
      const maxRequestsThreshold = 10;
      if (minTokenId > maxTokenId) {
        return true; // leave the smart contract check this
      }
      if (maxTokenId - minTokenId > maxRequestsThreshold) {
        return true; // leave the smart contract check this
      }
    };
    const maxCommits = Number(_maxCommits);

    if (tokenType === TokenType.FungibleToken) {
      const balance: string = await erc20.handler.balanceOf({
        contractAddress: tokenAddress,
        owner: buyerAddress,
        web3Lib: this._web3Lib
      });
      if (!BigNumber.from(balance).gte(threshold)) {
        return false;
      }
      const currentCommits = await getCurrentCommits();
      return currentCommits < maxCommits;
    }

    if (tokenType === TokenType.NonFungibleToken) {
      if (gatingType === GatingType.PerAddress) {
        if (method === EvaluationMethod.Threshold) {
          const balance: string = await erc721.handler.balanceOf({
            contractAddress: tokenAddress,
            owner: buyerAddress,
            web3Lib: this._web3Lib
          });
          if (!BigNumber.from(balance).gte(threshold)) {
            return false;
          }
          const currentCommits = await getCurrentCommits();
          return currentCommits < maxCommits;
        }
        if (method === EvaluationMethod.TokenRange) {
          if (returnTrueBecauseItCannotBeChecked()) {
            return true;
          }
          const promises: (() => Promise<string>)[] = [];

          for (let i = minTokenId; i <= maxTokenId; i++) {
            const tokenId = i;
            promises.push(() =>
              erc721.handler.ownerOf({
                contractAddress: tokenAddress,
                tokenId,
                web3Lib: this._web3Lib
              })
            );
          }
          const currentCommits = await getCurrentCommits();
          for await (const owners of batchTasks(promises, concurrencyLimit)) {
            if (owners.some((owner) => owner === buyerAddress)) {
              return currentCommits < maxCommits;
            }
          }
          return false;
        }
        throw new Error(
          `Unsupported method=${method} for this tokenType=${tokenType} and gatingType=${gatingType}`
        );
      }
      if (gatingType === GatingType.PerTokenId) {
        if (method === EvaluationMethod.TokenRange) {
          if (returnTrueBecauseItCannotBeChecked()) {
            return true;
          }
          const canTokenIdBeUsedToCommit = await getCanTokenIdBeUsedToCommit();
          const promises: (() => Promise<string>)[] = [];
          for (let i = minTokenId; i <= maxTokenId; i++) {
            const tokenId = i;
            promises.push(() =>
              erc721.handler.ownerOf({
                contractAddress: tokenAddress,
                tokenId,
                web3Lib: this._web3Lib
              })
            );
          }
          let tokenId = minTokenId;
          for await (const owners of batchTasks(promises, concurrencyLimit)) {
            if (
              owners.some((owner) => owner === buyerAddress) &&
              canTokenIdBeUsedToCommit(tokenId.toString())
            ) {
              return true;
            }
            tokenId++;
          }
          return false;
        }
        throw new Error(
          `Unsupported method=${method} for this tokenType=${tokenType} and gatingType=${gatingType}`
        );
      }
      throw new Error(
        `Unsupported gatingType=${gatingType} for this tokenType=${tokenType}`
      );
    }
    if (tokenType === TokenType.MultiToken) {
      if (gatingType === GatingType.PerAddress) {
        if (returnTrueBecauseItCannotBeChecked()) {
          return true;
        }
        const promises: (() => Promise<string>)[] = [];
        for (let i = minTokenId; i <= maxTokenId; i++) {
          const tokenId = i;
          promises.push(() =>
            erc1155.handler.balanceOf({
              contractAddress: tokenAddress,
              tokenId,
              owner: buyerAddress,
              web3Lib: this._web3Lib
            })
          );
        }
        for await (const balances of batchTasks(promises, concurrencyLimit)) {
          if (
            balances.some((balance) => BigNumber.from(balance).gte(threshold))
          ) {
            return true;
          }
        }
        return false;
      }
      if (gatingType === GatingType.PerTokenId) {
        if (returnTrueBecauseItCannotBeChecked()) {
          return true;
        }
        const canTokenIdBeUsedToCommit = await getCanTokenIdBeUsedToCommit();
        const promises: (() => Promise<string>)[] = [];
        for (let i = minTokenId; i <= maxTokenId; i++) {
          const tokenId = i;
          promises.push(() =>
            erc1155.handler.balanceOf({
              contractAddress: tokenAddress,
              tokenId,
              owner: buyerAddress,
              web3Lib: this._web3Lib
            })
          );
        }
        let tokenId = minTokenId;
        for await (const balances of batchTasks(promises, concurrencyLimit)) {
          if (
            balances.some((balance) =>
              BigNumber.from(balance).gte(threshold)
            ) &&
            canTokenIdBeUsedToCommit(tokenId.toString())
          ) {
            return true;
          }
          tokenId++;
        }
        return false;
      }
      throw new Error(
        `Unsupported gatingType=${gatingType} for this tokenType=${tokenType}`
      );
    }
    throw new Error(`Unsupported tokenType=${tokenType}`);
  }

  /**
   * Check a given offer meets ExchangePolicy rules.
   * @param offerId - Id of offer to render agreement for.
   * @returns Contractual agreement as string.
   */
  public async checkExchangePolicy(
    offerId: BigNumberish,
    rules: offers.CheckExchangePolicyRules
  ): Promise<offers.CheckExchangePolicyResult> {
    const offerData = await offers.subgraph.getOfferById(
      this._subgraphUrl,
      offerId
    );
    return offers.checkExchangePolicy(offerData, rules);
  }

  /**
   * Sets new valid royalty info to a given offer.
   * @param offerId - Id of the offer
   * @param royaltyInfo - new royaltyInfo to be applied
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
  // Overload: returnTxInfo is true → returns TransactionRequest
  public async updateOfferRoyaltyRecipients(
    offerId: BigNumberish,
    royaltyInfo: RoyaltyInfo,
    overrides: Partial<{
      contractAddress: string;
      returnTxInfo: true;
    }>
  ): Promise<TransactionRequest>;

  // Overload: returnTxInfo is false or undefined → returns TransactionResponse
  public async updateOfferRoyaltyRecipients(
    offerId: BigNumberish,
    royaltyInfo: RoyaltyInfo,
    overrides?: Partial<{
      contractAddress: string;
      returnTxInfo?: false | undefined;
    }>
  ): Promise<TransactionResponse>;

  // Implementation
  public async updateOfferRoyaltyRecipients(
    offerId: BigNumberish,
    royaltyInfo: RoyaltyInfo,
    overrides: Partial<{
      contractAddress: string;
      returnTxInfo?: boolean;
    }> = {}
  ): Promise<TransactionResponse | TransactionRequest> {
    const { returnTxInfo } = overrides;

    const royaltyArgs = {
      offerId,
      royaltyInfo,
      web3Lib: this._web3Lib,
      contractAddress: overrides.contractAddress || this._protocolDiamond
    } as const satisfies Parameters<
      typeof offers.handler.updateOfferRoyaltyRecipients
    >[0];

    if (returnTxInfo === true) {
      return offers.handler.updateOfferRoyaltyRecipients({
        ...royaltyArgs,
        returnTxInfo: true
      });
    } else {
      return offers.handler.updateOfferRoyaltyRecipients({
        ...royaltyArgs,
        returnTxInfo: false
      });
    }
  }

  /**
   * Sets new valid until date for a batch of offers.
   * @param offerIds - list of ids of the offers to extend
   * @param royaltyInfo - new royaltyInfo to be applied
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
  // Overload: returnTxInfo is true → returns TransactionRequest
  public async updateOfferRoyaltyRecipientsBatch(
    offerIds: BigNumberish[],
    royaltyInfo: RoyaltyInfo,
    overrides: Partial<{
      contractAddress: string;
      returnTxInfo: true;
    }>
  ): Promise<TransactionRequest>;

  // Overload: returnTxInfo is false or undefined → returns TransactionResponse
  public async updateOfferRoyaltyRecipientsBatch(
    offerIds: BigNumberish[],
    royaltyInfo: RoyaltyInfo,
    overrides?: Partial<{
      contractAddress: string;
      returnTxInfo?: false | undefined;
    }>
  ): Promise<TransactionResponse>;

  // Implementation
  public async updateOfferRoyaltyRecipientsBatch(
    offerIds: BigNumberish[],
    royaltyInfo: RoyaltyInfo,
    overrides: Partial<{
      contractAddress: string;
      returnTxInfo?: boolean;
    }> = {}
  ): Promise<TransactionResponse | TransactionRequest> {
    const { returnTxInfo } = overrides;

    const batchArgs = {
      offerIds,
      royaltyInfo,
      web3Lib: this._web3Lib,
      contractAddress: overrides.contractAddress || this._protocolDiamond
    } as const satisfies Parameters<
      typeof offers.handler.updateOfferRoyaltyRecipientsBatch
    >[0];

    if (returnTxInfo === true) {
      return offers.handler.updateOfferRoyaltyRecipientsBatch({
        ...batchArgs,
        returnTxInfo: true
      });
    } else {
      return offers.handler.updateOfferRoyaltyRecipientsBatch({
        ...batchArgs,
        returnTxInfo: false
      });
    }
  }
}
