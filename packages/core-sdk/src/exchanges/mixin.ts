import { BaseCoreSDK } from "./../mixins/base-core-sdk";
import * as subgraph from "../subgraph";
import {
  TransactionResponse,
  TransactionRequest,
  Log,
  Web3LibAdapter,
  FullOfferArgs,
  SellerOfferArgs
} from "@bosonprotocol/common";
import { BigNumberish, BigNumber } from "@ethersproject/bignumber";
import { getValueFromLogs } from "../utils/logs";
import {
  commitToOffer,
  revokeVoucher,
  cancelVoucher,
  redeemVoucher,
  completeExchange,
  completeExchangeBatch,
  expireVoucher,
  commitToConditionalOffer,
  getExchangeTokenId,
  parseTokenId,
  signFullOffer,
  commitToBuyerOffer
} from "./handler";
import { getExchangeById, getExchanges } from "./subgraph";
import { bosonExchangeHandlerIface } from "./interface";
import { exchanges } from "..";
import { getSignatureParameters, StructuredData } from "../utils/signature";

export class ExchangesMixin<T extends Web3LibAdapter> extends BaseCoreSDK<T> {
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
    return getExchangeById(this._subgraphUrl, exchangeId, queryVars);
  }

  /**
   * Returns exchange entities from subgraph.
   * @param queryVars - Optional query variables to skip, order or filter.
   * @returns Exchange entities from subgraph.
   */
  public async getExchanges(
    queryVars?: subgraph.GetExchangesQueryQueryVariables
  ): Promise<subgraph.ExchangeFieldsFragment[]> {
    return getExchanges(this._subgraphUrl, queryVars);
  }

  /**
   * Commits to a seller initiated offer by calling the `ExchangeCommitFacet`.
   * This transaction only succeeds if the seller has deposited enough funds to lock the offer's sellerDeposit.
   * @param offerId - ID of offer to commit to.
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
  public async commitToOffer(
    offerId: BigNumberish,
    overrides: Partial<{
      buyer: string;
      returnTxInfo: true;
    }>
  ): Promise<TransactionRequest>;
  public async commitToOffer(
    offerId: BigNumberish,
    overrides?: Partial<{
      buyer: string;
      returnTxInfo?: false | undefined;
    }>
  ): Promise<TransactionResponse>;
  public async commitToOffer(
    offerId: BigNumberish,
    overrides: Partial<{
      buyer: string;
      returnTxInfo?: boolean;
    }> = {}
  ): Promise<TransactionResponse | TransactionRequest> {
    const { returnTxInfo } = overrides;
    const buyer = overrides.buyer || (await this._web3Lib.getSignerAddress());

    const commitArgs = {
      buyer,
      offerId,
      web3Lib: this._web3Lib,
      subgraphUrl: this._subgraphUrl,
      contractAddress: this._protocolDiamond
    } as const satisfies Parameters<typeof commitToOffer>[0];

    if (returnTxInfo === true) {
      return commitToOffer({
        ...commitArgs,
        returnTxInfo: true
      });
    } else {
      return commitToOffer({
        ...commitArgs,
        returnTxInfo: false
      });
    }
  }

  /**
   * Commits to a buyer initiated offer by calling the `ExchangeCommitFacet`.
   * This transaction only succeeds if the buyer has deposited enough funds to lock the offer's price.
   * @param offerId - ID of offer to commit to.
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
  public async commitToBuyerOffer(
    offerId: BigNumberish,
    sellerParams: SellerOfferArgs,
    overrides: Partial<{
      returnTxInfo: true;
    }>
  ): Promise<TransactionRequest>;
  public async commitToBuyerOffer(
    offerId: BigNumberish,
    sellerParams?: SellerOfferArgs,
    overrides?: Partial<{
      returnTxInfo?: false | undefined;
    }>
  ): Promise<TransactionResponse>;
  public async commitToBuyerOffer(
    offerId: BigNumberish,
    sellerParams: SellerOfferArgs = {},
    overrides: Partial<{
      returnTxInfo?: boolean;
    }> = {}
  ): Promise<TransactionResponse | TransactionRequest> {
    const { returnTxInfo } = overrides;

    const commitArgs = {
      offerId,
      sellerParams: sellerParams || {},
      web3Lib: this._web3Lib,
      subgraphUrl: this._subgraphUrl,
      contractAddress: this._protocolDiamond
    } as const satisfies Parameters<typeof commitToBuyerOffer>[0];

    if (returnTxInfo === true) {
      return commitToBuyerOffer({
        ...commitArgs,
        returnTxInfo: true
      });
    } else {
      return commitToBuyerOffer({
        ...commitArgs,
        returnTxInfo: false
      });
    }
  }

  /**
   * Commits to a conditional offer by calling the `ExchangeHandlerContract`.
   * This transaction only succeeds if the seller has deposited funds.
   * @param offerId - ID of offer to commit to.
   * @param tokenId - ID of the token to use for the conditional commit
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
  public async commitToConditionalOffer(
    offerId: BigNumberish,
    tokenId: BigNumberish,
    overrides: Partial<{
      buyer: string;
      returnTxInfo: true;
    }>
  ): Promise<TransactionRequest>;
  public async commitToConditionalOffer(
    offerId: BigNumberish,
    tokenId: BigNumberish,
    overrides?: Partial<{
      buyer: string;
      returnTxInfo?: false | undefined;
    }>
  ): Promise<TransactionResponse>;
  public async commitToConditionalOffer(
    offerId: BigNumberish,
    tokenId: BigNumberish,
    overrides: Partial<{
      buyer: string;
      returnTxInfo?: boolean;
    }> = {}
  ): Promise<TransactionResponse | TransactionRequest> {
    const { returnTxInfo } = overrides;
    const buyer = overrides.buyer || (await this._web3Lib.getSignerAddress());

    const commitArgs = {
      buyer,
      offerId,
      tokenId,
      web3Lib: this._web3Lib,
      subgraphUrl: this._subgraphUrl,
      contractAddress: this._protocolDiamond
    } as const satisfies Parameters<typeof commitToConditionalOffer>[0];

    if (returnTxInfo === true) {
      return commitToConditionalOffer({
        ...commitArgs,
        returnTxInfo: true
      });
    } else {
      return commitToConditionalOffer({
        ...commitArgs,
        returnTxInfo: false
      });
    }
  }

  /**
   * Creates an offer and commits to it immediately.
   * @param createOfferAndCommitArgs - Offer and commit arguments.
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
  // Overload: returnTxInfo is true → returns TransactionRequest
  public async createOfferAndCommit(
    createOfferAndCommitArgs: FullOfferArgs,
    overrides: Partial<{
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo: true;
    }>
  ): Promise<TransactionRequest>;

  // Overload: returnTxInfo is false or undefined → returns TransactionResponse
  public async createOfferAndCommit(
    createOfferAndCommitArgs: FullOfferArgs,
    overrides?: Partial<{
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo?: false | undefined;
    }>
  ): Promise<TransactionResponse>;

  // Implementation
  public async createOfferAndCommit(
    createOfferAndCommitArgs: FullOfferArgs,
    overrides: Partial<{
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo?: boolean;
    }> = {}
  ): Promise<TransactionResponse | TransactionRequest> {
    const { returnTxInfo } = overrides;

    const offerArgs = {
      createOfferAndCommitArgs,
      web3Lib: this._web3Lib,
      theGraphStorage: this._theGraphStorage,
      metadataStorage: this._metadataStorage,
      subgraphUrl: this._subgraphUrl,
      contractAddress: overrides.contractAddress || this._protocolDiamond,
      txRequest: overrides.txRequest
    } as const satisfies Parameters<
      typeof exchanges.handler.createOfferAndCommit
    >[0];

    if (returnTxInfo === true) {
      return exchanges.handler.createOfferAndCommit({
        ...offerArgs,
        returnTxInfo: true
      });
    } else {
      return exchanges.handler.createOfferAndCommit({
        ...offerArgs,
        returnTxInfo: false
      });
    }
  }

  /**
   * Signs the full offer data for an off-chain buyer- or seller-initiated offer.
   * @param args - Arguments including `fullOfferArgsUnsigned` and `returnTypedDataToSign`.
   * @returns Either the structured data to sign or the signature parameters, depending on `returnTypedDataToSign`.
   */

  public async signFullOffer(args: {
    fullOfferArgsUnsigned: Omit<FullOfferArgs, "signature">;
    returnTypedDataToSign: true;
  }): Promise<StructuredData>;
  public async signFullOffer(args: {
    fullOfferArgsUnsigned: Omit<FullOfferArgs, "signature">;
    returnTypedDataToSign?: false;
  }): Promise<ReturnType<typeof getSignatureParameters>>;
  public async signFullOffer(args: {
    fullOfferArgsUnsigned: Omit<FullOfferArgs, "signature">;
    returnTypedDataToSign?: boolean;
  }): Promise<StructuredData | ReturnType<typeof getSignatureParameters>> {
    const { returnTypedDataToSign, ...argsWithoutReturnTypedDataToSign } = args;
    const params = {
      ...argsWithoutReturnTypedDataToSign,
      web3Lib: this._web3Lib,
      contractAddress: this._protocolDiamond,
      chainId: this._chainId
    };
    if (returnTypedDataToSign === true) {
      return signFullOffer({
        ...params,
        returnTypedDataToSign: true
      });
    } else {
      return signFullOffer({
        ...params,
        returnTypedDataToSign: false
      });
    }
  }

  /**
   * Utility method to retrieve the created `exchangeId` from logs after calling `commitToOffer` or `commitToBuyerOffer`.
   * @param logs - Logs to search in.
   * @returns Created exchange id.
   */
  public getCommittedExchangeIdFromLogs(logs: Log[]): string | null {
    return (
      getValueFromLogs({
        iface: bosonExchangeHandlerIface,
        logs,
        eventArgsKey: "exchangeId",
        eventName: "BuyerCommitted"
      }) ||
      getValueFromLogs({
        iface: bosonExchangeHandlerIface,
        logs,
        eventArgsKey: "exchangeId",
        eventName: "SellerCommitted"
      })
    );
  }

  /**
   * Revokes an existing voucher by calling the `ExchangeHandlerContract`.
   * Callable by seller `assistant`.
   * @param exchangeId - ID of exchange to revoke.
   * @returns Transaction response.
   */
  public async revokeVoucher(
    exchangeId: BigNumberish,
    returnTxInfo: true
  ): Promise<TransactionRequest>;
  public async revokeVoucher(
    exchangeId: BigNumberish,
    returnTxInfo?: false | undefined
  ): Promise<TransactionResponse>;
  public async revokeVoucher(
    exchangeId: BigNumberish,
    returnTxInfo?: boolean
  ): Promise<TransactionResponse | TransactionRequest> {
    const revokeArgs = {
      web3Lib: this._web3Lib,
      contractAddress: this._protocolDiamond,
      exchangeId,
      subgraphUrl: this._subgraphUrl
    } as const satisfies Parameters<typeof revokeVoucher>[0];

    if (returnTxInfo === true) {
      return revokeVoucher({
        ...revokeArgs,
        returnTxInfo: true
      });
    } else {
      return revokeVoucher({
        ...revokeArgs,
        returnTxInfo: false
      });
    }
  }

  /**
   * Cancels an existing voucher by calling the `ExchangeHandlerContract`.
   * Callable by buyer.
   * @param exchangeId - ID of exchange to cancel.
   * @returns Transaction response.
   */
  public async cancelVoucher(
    exchangeId: BigNumberish,
    returnTxInfo: true
  ): Promise<TransactionRequest>;
  public async cancelVoucher(
    exchangeId: BigNumberish,
    returnTxInfo?: false | undefined
  ): Promise<TransactionResponse>;
  public async cancelVoucher(
    exchangeId: BigNumberish,
    returnTxInfo?: boolean
  ): Promise<TransactionResponse | TransactionRequest> {
    const cancelArgs = {
      web3Lib: this._web3Lib,
      contractAddress: this._protocolDiamond,
      exchangeId,
      subgraphUrl: this._subgraphUrl
    } as const satisfies Parameters<typeof cancelVoucher>[0];

    if (returnTxInfo === true) {
      return cancelVoucher({
        ...cancelArgs,
        returnTxInfo: true
      });
    } else {
      return cancelVoucher({
        ...cancelArgs,
        returnTxInfo: false
      });
    }
  }

  /**
   * Redeems an existing voucher by calling the `ExchangeHandlerContract`.
   * Callable by buyer.
   * @param exchangeId - ID of exchange to redeem.
   * @returns Transaction response.
   */
  public async redeemVoucher(
    exchangeId: BigNumberish,
    returnTxInfo: true
  ): Promise<TransactionRequest>;
  public async redeemVoucher(
    exchangeId: BigNumberish,
    returnTxInfo?: false | undefined
  ): Promise<TransactionResponse>;
  public async redeemVoucher(
    exchangeId: BigNumberish,
    returnTxInfo?: boolean
  ): Promise<TransactionResponse | TransactionRequest> {
    const redeemArgs = {
      web3Lib: this._web3Lib,
      contractAddress: this._protocolDiamond,
      exchangeId,
      subgraphUrl: this._subgraphUrl
    } as const satisfies Parameters<typeof redeemVoucher>[0];

    if (returnTxInfo === true) {
      return redeemVoucher({
        ...redeemArgs,
        returnTxInfo: true
      });
    } else {
      return redeemVoucher({
        ...redeemArgs,
        returnTxInfo: false
      });
    }
  }

  /**
   * Completes an existing voucher by calling the `ExchangeHandlerContract`.
   * Callable by buyer or seller assistant.
   * @param exchangeId - ID of exchange to complete.
   * @returns Transaction response.
   */
  public async completeExchange(
    exchangeId: BigNumberish,
    returnTxInfo: true
  ): Promise<TransactionRequest>;
  public async completeExchange(
    exchangeId: BigNumberish,
    returnTxInfo?: false | undefined
  ): Promise<TransactionResponse>;
  public async completeExchange(
    exchangeId: BigNumberish,
    returnTxInfo?: boolean
  ): Promise<TransactionResponse | TransactionRequest> {
    const completeArgs = {
      web3Lib: this._web3Lib,
      contractAddress: this._protocolDiamond,
      exchangeId,
      subgraphUrl: this._subgraphUrl
    } as const satisfies Parameters<typeof completeExchange>[0];

    if (returnTxInfo === true) {
      return completeExchange({
        ...completeArgs,
        returnTxInfo: true
      });
    } else {
      return completeExchange({
        ...completeArgs,
        returnTxInfo: false
      });
    }
  }

  /**
   * Completes a batch of existing vouchers by calling the `ExchangeHandlerContract`.
   * Callable by buyer or seller assistant.
   * @param exchangeIds - IDs of exchange to complete.
   * @returns Transaction response.
   */
  public async completeExchangeBatch(
    exchangeIds: BigNumberish[],
    returnTxInfo: true
  ): Promise<TransactionRequest>;
  public async completeExchangeBatch(
    exchangeIds: BigNumberish[],
    returnTxInfo?: false | undefined
  ): Promise<TransactionResponse>;
  public async completeExchangeBatch(
    exchangeIds: BigNumberish[],
    returnTxInfo?: boolean
  ): Promise<TransactionResponse | TransactionRequest> {
    const batchArgs = {
      web3Lib: this._web3Lib,
      contractAddress: this._protocolDiamond,
      exchangeIds,
      subgraphUrl: this._subgraphUrl
    } as const satisfies Parameters<typeof completeExchangeBatch>[0];

    if (returnTxInfo === true) {
      return completeExchangeBatch({
        ...batchArgs,
        returnTxInfo: true
      });
    } else {
      return completeExchangeBatch({
        ...batchArgs,
        returnTxInfo: false
      });
    }
  }

  /**
   * Expires an existing voucher by calling the `ExchangeHandlerContract`.
   * @param exchangeId - ID of exchange to expire.
   * @returns Transaction response.
   */
  public async expireVoucher(
    exchangeId: BigNumberish,
    returnTxInfo: true
  ): Promise<TransactionRequest>;
  public async expireVoucher(
    exchangeId: BigNumberish,
    returnTxInfo?: false | undefined
  ): Promise<TransactionResponse>;
  public async expireVoucher(
    exchangeId: BigNumberish,
    returnTxInfo?: boolean
  ): Promise<TransactionResponse | TransactionRequest> {
    const expireArgs = {
      web3Lib: this._web3Lib,
      contractAddress: this._protocolDiamond,
      exchangeId,
      subgraphUrl: this._subgraphUrl
    } as const satisfies Parameters<typeof expireVoucher>[0];

    if (returnTxInfo === true) {
      return expireVoucher({
        ...expireArgs,
        returnTxInfo: true
      });
    } else {
      return expireVoucher({
        ...expireArgs,
        returnTxInfo: false
      });
    }
  }

  public getExchangeTokenId(
    exchangeId: BigNumberish,
    offerId: BigNumberish
  ): BigNumber {
    return getExchangeTokenId(exchangeId, offerId);
  }

  public parseTokenId(tokenId: BigNumberish): {
    offerId: BigNumber;
    exchangeId: BigNumber;
  } {
    return parseTokenId(tokenId);
  }
}
