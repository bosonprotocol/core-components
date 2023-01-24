import { MetaTxConfig, TransactionResponse } from "@bosonprotocol/common";
import { BigNumberish } from "@ethersproject/bignumber";
import { BytesLike } from "@ethersproject/bytes";
import { BaseCoreSDK } from "./../mixins/base-core-sdk";
import { GetRetriedHashesData } from "./biconomy";
import {
  signMetaTx,
  signMetaTxCreateSeller,
  signMetaTxUpdateSeller,
  signMetaTxOptInToSellerUpdate,
  signMetaTxCreateOffer,
  signMetaTxCreateOfferBatch,
  signMetaTxCreateGroup,
  signMetaTxCreateOfferWithCondition,
  signMetaTxVoidOffer,
  signMetaTxVoidOfferBatch,
  signMetaTxCompleteExchange,
  signMetaTxCompleteExchangeBatch,
  signMetaTxCommitToOffer,
  signMetaTxCancelVoucher,
  signMetaTxRedeemVoucher,
  signMetaTxExpireVoucher,
  signMetaTxRevokeVoucher,
  signMetaTxRetractDispute,
  signMetaTxEscalateDispute,
  signMetaTxRaiseDispute,
  signMetaTxResolveDispute,
  signMetaTxExtendDisputeTimeout,
  signMetaTxWithdrawFunds,
  signMetaTxDepositFunds,
  relayMetaTransaction,
  getResubmitted
} from "./handler";

export class MetaTxMixin extends BaseCoreSDK {
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
      Parameters<typeof signMetaTx>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return signMetaTx({
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
      Parameters<typeof signMetaTxCreateSeller>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return signMetaTxCreateSeller({
      web3Lib: this._web3Lib,
      metaTxHandlerAddress: this._protocolDiamond,
      chainId: this._chainId,
      ...args
    });
  }

  public async signMetaTxUpdateSeller(
    args: Omit<
      Parameters<typeof signMetaTxUpdateSeller>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return signMetaTxUpdateSeller({
      web3Lib: this._web3Lib,
      metaTxHandlerAddress: this._protocolDiamond,
      chainId: this._chainId,
      ...args
    });
  }

  public async signMetaTxOptInToSellerUpdate(
    args: Omit<
      Parameters<typeof signMetaTxOptInToSellerUpdate>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return signMetaTxOptInToSellerUpdate({
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
      Parameters<typeof signMetaTxCreateOffer>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return signMetaTxCreateOffer({
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
      Parameters<typeof signMetaTxCreateOfferBatch>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return signMetaTxCreateOfferBatch({
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
      Parameters<typeof signMetaTxCreateGroup>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return signMetaTxCreateGroup({
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
      Parameters<typeof signMetaTxCreateOfferWithCondition>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return signMetaTxCreateOfferWithCondition({
      web3Lib: this._web3Lib,
      theGraphStorage: this._theGraphStorage,
      metadataStorage: this._metadataStorage,
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
      Parameters<typeof signMetaTxVoidOffer>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return signMetaTxVoidOffer({
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
      Parameters<typeof signMetaTxVoidOfferBatch>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return signMetaTxVoidOfferBatch({
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
  public async signMetaTxCompleteExchange(
    args: Omit<
      Parameters<typeof signMetaTxCompleteExchange>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return signMetaTxCompleteExchange({
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
      Parameters<typeof signMetaTxCompleteExchangeBatch>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return signMetaTxCompleteExchangeBatch({
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
      Parameters<typeof signMetaTxCommitToOffer>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return signMetaTxCommitToOffer({
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
      Parameters<typeof signMetaTxCancelVoucher>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return signMetaTxCancelVoucher({
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
      Parameters<typeof signMetaTxRedeemVoucher>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return signMetaTxRedeemVoucher({
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
      Parameters<typeof signMetaTxExpireVoucher>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return signMetaTxExpireVoucher({
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
      Parameters<typeof signMetaTxRevokeVoucher>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return signMetaTxRevokeVoucher({
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
      Parameters<typeof signMetaTxRetractDispute>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return signMetaTxRetractDispute({
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
      Parameters<typeof signMetaTxEscalateDispute>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return signMetaTxEscalateDispute({
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
      Parameters<typeof signMetaTxRaiseDispute>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return signMetaTxRaiseDispute({
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
      Parameters<typeof signMetaTxResolveDispute>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return signMetaTxResolveDispute({
      web3Lib: this._web3Lib,
      metaTxHandlerAddress: this._protocolDiamond,
      chainId: this._chainId,
      ...args
    });
  }

  /**
   * Encodes and signs a meta transaction for `extendDisputeTimeout` that can be relayed.
   * @param args - Meta transaction args.
   * @returns Signature.
   */
  public async signMetaTxExtendDisputeTimeout(
    args: Omit<
      Parameters<typeof signMetaTxExtendDisputeTimeout>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return signMetaTxExtendDisputeTimeout({
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
      Parameters<typeof signMetaTxWithdrawFunds>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return signMetaTxWithdrawFunds({
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
      Parameters<typeof signMetaTxDepositFunds>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return signMetaTxDepositFunds({
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

    return relayMetaTransaction({
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

    return getResubmitted({
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
}
