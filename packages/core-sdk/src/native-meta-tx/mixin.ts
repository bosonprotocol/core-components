import {
  MetaTxConfig,
  TransactionResponse,
  Web3LibAdapter
} from "@bosonprotocol/common";
import { BigNumberish } from "@ethersproject/bignumber";
import { BytesLike } from "@ethersproject/bytes";
import { handler } from ".";
import { SignedMetaTx, UnsignedMetaTx } from "../meta-tx/handler";
import { BaseCoreSDK } from "./../mixins/base-core-sdk";

export class NativeMetaTxMixin<
  T extends Web3LibAdapter
> extends BaseCoreSDK<T> {
  /**
   * Encodes and signs a native "token.approve()" meta transaction that can be relayed.
   * @param exchangeToken - The address of the token contract.
   * @param value - The value to be approved.
   * @param overrides - Optionally specify a spender address (default is the protocol contract address)
   *                    and/or set returnTypedDataToSign to control the return type.
   * @returns Signature or structured typed data.
   */
  // Overload: returnTypedDataToSign is true → returns UnsignedMetaTx
  public async signNativeMetaTxApproveExchangeToken(
    exchangeToken: string,
    value: BigNumberish,
    overrides: Partial<{ spender: string }> & { returnTypedDataToSign: true }
  ): Promise<UnsignedMetaTx>;
  // Overload: returnTypedDataToSign is false or undefined → returns SignedMetaTx
  public async signNativeMetaTxApproveExchangeToken(
    exchangeToken: string,
    value: BigNumberish,
    overrides?: Partial<{ spender: string; returnTypedDataToSign?: false }>
  ): Promise<SignedMetaTx>;
  // Implementation
  public async signNativeMetaTxApproveExchangeToken(
    exchangeToken: string,
    value: BigNumberish,
    overrides: Partial<{
      spender: string;
      returnTypedDataToSign: boolean;
    }> = {}
  ): Promise<SignedMetaTx | UnsignedMetaTx> {
    const user = await this._web3Lib.getSignerAddress();
    const baseArgs = {
      web3Lib: this._web3Lib,
      chainId: this._chainId,
      user,
      exchangeToken,
      spender: overrides.spender || this._protocolDiamond,
      value
    };
    if (overrides.returnTypedDataToSign) {
      return handler.signNativeMetaTxApproveExchangeToken({
        ...baseArgs,
        returnTypedDataToSign: true
      });
    }
    return handler.signNativeMetaTxApproveExchangeToken({
      ...baseArgs,
      returnTypedDataToSign: false
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
      metaTxConfig: Partial<
        Omit<MetaTxConfig, "apiIds" | "forwarderAbi"> & { apiId: string }
      >;
      metaTransactionMethod: string;
    }> = {}
  ): Promise<TransactionResponse> {
    const { metaTxApiId, metaTxApiKey, metaTxRelayerUrl } =
      this.assertAndGetMetaTxConfig({ ...overrides, contractAddress });

    return handler.relayNativeMetaTransaction({
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
}
