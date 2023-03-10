import { MetaTxConfig, TransactionResponse } from "@bosonprotocol/common";
import { BigNumberish } from "@ethersproject/bignumber";
import { BytesLike } from "@ethersproject/bytes";
import { handler } from ".";
import { getOfferById } from "../offers/subgraph";
import { BaseCoreSDK } from "./../mixins/base-core-sdk";
import { GetRetriedHashesData } from "./biconomy";
import { getNonce } from "../forwarder/handler";
import { accounts } from "..";
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
      Parameters<typeof handler.signMetaTx>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return handler.signMetaTx({
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
      Parameters<typeof handler.signMetaTxCreateSeller>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return handler.signMetaTxCreateSeller({
      web3Lib: this._web3Lib,
      metaTxHandlerAddress: this._protocolDiamond,
      chainId: this._chainId,
      ...args
    });
  }

  public async signMetaTxUpdateSeller(
    args: Omit<
      Parameters<typeof handler.signMetaTxUpdateSeller>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return handler.signMetaTxUpdateSeller({
      web3Lib: this._web3Lib,
      metaTxHandlerAddress: this._protocolDiamond,
      chainId: this._chainId,
      ...args
    });
  }

  public async signMetaTxOptInToSellerUpdate(
    args: Omit<
      Parameters<typeof handler.signMetaTxOptInToSellerUpdate>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return handler.signMetaTxOptInToSellerUpdate({
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
      Parameters<typeof handler.signMetaTxCreateOffer>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return handler.signMetaTxCreateOffer({
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
      Parameters<typeof handler.signMetaTxCreateOfferBatch>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return handler.signMetaTxCreateOfferBatch({
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
      Parameters<typeof handler.signMetaTxCreateGroup>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return handler.signMetaTxCreateGroup({
      web3Lib: this._web3Lib,
      metaTxHandlerAddress: this._protocolDiamond,
      chainId: this._chainId,
      ...args
    });
  }

  public async signMetaTxReserveRange(
    args: Omit<
      Parameters<typeof handler.signMetaTxReserveRange>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId" | "to"
    > & { to: "seller" | "contract" }
  ) {
    const offer = await getOfferById(this._subgraphUrl, args.offerId);

    return handler.signMetaTxReserveRange({
      web3Lib: this._web3Lib,
      metaTxHandlerAddress: this._protocolDiamond,
      chainId: this._chainId,
      ...args,
      to:
        args.to === "contract"
          ? offer.seller.voucherCloneAddress
          : offer.seller.assistant
    });
  }

  public async signMetaTxPreMint(
    args: Omit<
      Parameters<typeof handler.signMetaTxPreMint>[0],
      | "web3Lib"
      | "bosonVoucherAddress"
      | "chainId"
      | "nonce"
      | "forwarderAddress"
      | "batchId"
      | "forwarderAbi"
    >,
    overrides: Partial<{
      batchId: BigNumberish;
    }> = {}
  ) {
    const signerAddress = await this._web3Lib.getSignerAddress();
    const forwarderAddress = this._contracts.forwarder;
    const batchId = overrides.batchId || 0;
    const nonce = await getNonce({
      contractAddress: forwarderAddress,
      user: signerAddress,
      web3Lib: this._web3Lib,
      batchId,
      forwarderAbi: this._metaTxConfig.forwarderAbi
    });
    const offerFromSubgraph = await getOfferById(
      this._subgraphUrl,
      args.offerId
    );
    return handler.signMetaTxPreMint({
      web3Lib: this._web3Lib,
      bosonVoucherAddress: offerFromSubgraph.seller.voucherCloneAddress,
      chainId: this._chainId,
      nonce,
      forwarderAddress,
      batchId,
      forwarderAbi: this._metaTxConfig.forwarderAbi,
      ...args
    });
  }

  public async signMetaTxSetApprovalForAll(
    args: Omit<
      Parameters<typeof handler.signMetaTxSetApprovalForAll>[0],
      | "web3Lib"
      | "bosonVoucherAddress"
      | "chainId"
      | "nonce"
      | "forwarderAddress"
      | "batchId"
      | "forwarderAbi"
    >,
    overrides: Partial<{
      batchId: BigNumberish;
    }> = {}
  ) {
    const sellerAddress = await this._web3Lib.getSignerAddress();
    const seller = await accounts.subgraph.getSellerByAddress(
      this._subgraphUrl,
      sellerAddress
    );
    const forwarderAddress = this._contracts.forwarder;
    const batchId = overrides.batchId || 0;
    const nonce = await getNonce({
      contractAddress: forwarderAddress,
      user: sellerAddress,
      web3Lib: this._web3Lib,
      batchId,
      forwarderAbi: this._metaTxConfig.forwarderAbi
    });

    return handler.signMetaTxSetApprovalForAll({
      web3Lib: this._web3Lib,
      bosonVoucherAddress: seller.voucherCloneAddress,
      chainId: this._chainId,
      nonce,
      forwarderAddress,
      batchId,
      forwarderAbi: this._metaTxConfig.forwarderAbi,
      ...args
    });
  }

  public async relayBiconomyMetaTransaction(
    contractAddress: string,
    metaTxParams: {
      request: Parameters<
        typeof handler["relayBiconomyMetaTransaction"]
      >[0]["metaTx"]["params"]["request"];
      domainSeparator: Parameters<
        typeof handler["relayBiconomyMetaTransaction"]
      >[0]["metaTx"]["params"]["domainSeparator"];
      signature: Parameters<
        typeof handler["relayBiconomyMetaTransaction"]
      >[0]["metaTx"]["params"]["signature"];
    },
    overrides: Partial<{
      userAddress: string;
      metaTxConfig: Partial<
        Omit<MetaTxConfig, "apiIds" | "forwarderAbi"> & { apiId: string }
      >;
      metaTransactionMethod: string;
    }> = {}
  ): Promise<TransactionResponse> {
    const { metaTxApiId, metaTxApiKey, metaTxRelayerUrl } =
      this.assertAndGetMetaTxConfig({ ...overrides, contractAddress });

    return handler.relayBiconomyMetaTransaction({
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
          request: metaTxParams.request,
          domainSeparator: metaTxParams.domainSeparator,
          signature: metaTxParams.signature
        }
      }
    });
  }

  /**
   * Encodes and signs a meta transaction for `createOfferWithCondition` that can be relayed.
   * @param args - Meta transaction args.
   * @returns Signature.
   */
  public async signMetaTxCreateOfferWithCondition(
    args: Omit<
      Parameters<typeof handler.signMetaTxCreateOfferWithCondition>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return handler.signMetaTxCreateOfferWithCondition({
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
      Parameters<typeof handler.signMetaTxVoidOffer>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return handler.signMetaTxVoidOffer({
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
      Parameters<typeof handler.signMetaTxVoidOfferBatch>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return handler.signMetaTxVoidOfferBatch({
      web3Lib: this._web3Lib,
      metaTxHandlerAddress: this._protocolDiamond,
      chainId: this._chainId,
      ...args
    });
  }

  /**
   * Encodes and signs a meta transaction for `extendOffer` that can be relayed.
   * @param args - Meta transaction args.
   * @returns Signature.
   */
  public async signMetaTxExtendOffer(
    args: Omit<
      Parameters<typeof handler.signMetaTxExtendOffer>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return handler.signMetaTxExtendOffer({
      web3Lib: this._web3Lib,
      metaTxHandlerAddress: this._protocolDiamond,
      chainId: this._chainId,
      ...args
    });
  }

  /**
   * Encodes and signs a meta transaction for `extendOfferBatch` that can be relayed.
   * @param args - Meta transaction args.
   * @returns Signature.
   */
  public async signMetaTxExtendOfferBatch(
    args: Omit<
      Parameters<typeof handler.signMetaTxExtendOfferBatch>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return handler.signMetaTxExtendOfferBatch({
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
      Parameters<typeof handler.signMetaTxCompleteExchange>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return handler.signMetaTxCompleteExchange({
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
      Parameters<typeof handler.signMetaTxCompleteExchangeBatch>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return handler.signMetaTxCompleteExchangeBatch({
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
      Parameters<typeof handler.signMetaTxCommitToOffer>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return handler.signMetaTxCommitToOffer({
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
      Parameters<typeof handler.signMetaTxCancelVoucher>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return handler.signMetaTxCancelVoucher({
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
      Parameters<typeof handler.signMetaTxRedeemVoucher>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return handler.signMetaTxRedeemVoucher({
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
      Parameters<typeof handler.signMetaTxExpireVoucher>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return handler.signMetaTxExpireVoucher({
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
      Parameters<typeof handler.signMetaTxRevokeVoucher>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return handler.signMetaTxRevokeVoucher({
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
      Parameters<typeof handler.signMetaTxRetractDispute>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return handler.signMetaTxRetractDispute({
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
      Parameters<typeof handler.signMetaTxEscalateDispute>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return handler.signMetaTxEscalateDispute({
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
      Parameters<typeof handler.signMetaTxRaiseDispute>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return handler.signMetaTxRaiseDispute({
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
      Parameters<typeof handler.signMetaTxResolveDispute>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return handler.signMetaTxResolveDispute({
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
      Parameters<typeof handler.signMetaTxExtendDisputeTimeout>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return handler.signMetaTxExtendDisputeTimeout({
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
      Parameters<typeof handler.signMetaTxWithdrawFunds>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return handler.signMetaTxWithdrawFunds({
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
      Parameters<typeof handler.signMetaTxDepositFunds>[0],
      "web3Lib" | "metaTxHandlerAddress" | "chainId"
    >
  ) {
    return handler.signMetaTxDepositFunds({
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

    return handler.relayMetaTransaction({
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

    return handler.getResubmitted({
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
