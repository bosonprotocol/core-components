import {
  Web3LibAdapter,
  TransactionResponse,
  TransactionRequest
} from "@bosonprotocol/common";
import { BigNumberish } from "@ethersproject/bignumber";
import { BaseCoreSDK } from "./../mixins/base-core-sdk";
import {
  approve,
  getAllowance,
  getDecimals,
  getSymbol,
  getName,
  ensureAllowance,
  balanceOf,
  signReceiveWithErc3009Authorization,
  SignedReceiveWithAuthorization,
  signReceiveWithErc2612Permit,
  SignedReceivePermit,
  signReceiveWithPermit2,
  SignedReceiveWithPermit2
} from "./handler";
import { StructuredData } from "../utils/signature";

export class ERC20Mixin<T extends Web3LibAdapter> extends BaseCoreSDK<T> {
  /* -------------------------------------------------------------------------- */
  /*                           ERC20 related methods                          */
  /* -------------------------------------------------------------------------- */

  /**
   * Approves ERC20 token spending allowance.
   * This transaction only succeeds if the token contract exists and caller has sufficient balance.
   * @param args - Approval arguments.
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
  // Overload: returnTxInfo is true → returns TransactionRequest
  public async erc20Approve(
    args: Omit<
      Parameters<typeof approve>[0],
      "web3Lib" | "theGraphStorage" | "metadataStorage"
    >,
    overrides: Partial<{
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo: true;
    }>
  ): Promise<TransactionRequest>;

  // Overload: returnTxInfo is false or undefined → returns TransactionResponse
  public async erc20Approve(
    args: Omit<
      Parameters<typeof approve>[0],
      "web3Lib" | "theGraphStorage" | "metadataStorage"
    >,
    overrides?: Partial<{
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo?: false | undefined;
    }>
  ): Promise<TransactionResponse>;

  // Implementation
  public async erc20Approve(
    args: Omit<
      Parameters<typeof approve>[0],
      "web3Lib" | "theGraphStorage" | "metadataStorage"
    >,
    overrides: Partial<{
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo?: boolean;
    }> = {}
  ): Promise<TransactionResponse | TransactionRequest> {
    const { returnTxInfo } = overrides;

    const approveArgs = {
      ...args,
      web3Lib: this._web3Lib,
      contractAddress: overrides.contractAddress,
      txRequest: overrides.txRequest
    } as const satisfies Parameters<typeof approve>[0];

    if (returnTxInfo === true) {
      return approve({
        ...approveArgs,
        returnTxInfo: true
      });
    } else {
      return approve({
        ...approveArgs,
        returnTxInfo: false
      });
    }
  }

  public async erc20EnsureAllowance(
    args: Omit<Parameters<typeof ensureAllowance>[0], "web3Lib">
  ): Promise<ReturnType<typeof ensureAllowance>> {
    return ensureAllowance({ web3Lib: this._web3Lib, ...args });
  }

  public async erc20GetAllowance(
    args: Omit<Parameters<typeof getAllowance>[0], "web3Lib">
  ): Promise<ReturnType<typeof getAllowance>> {
    return getAllowance({ web3Lib: this._web3Lib, ...args });
  }

  public async erc20GetDecimals(
    args: Omit<Parameters<typeof getDecimals>[0], "web3Lib">
  ): Promise<ReturnType<typeof getDecimals>> {
    return getDecimals({ web3Lib: this._web3Lib, ...args });
  }

  public async erc20GetSymbol(
    args: Omit<Parameters<typeof getSymbol>[0], "web3Lib">
  ): Promise<ReturnType<typeof getSymbol>> {
    return getSymbol({ web3Lib: this._web3Lib, ...args });
  }

  public async erc20GetName(
    args: Omit<Parameters<typeof getName>[0], "web3Lib">
  ): Promise<ReturnType<typeof getName>> {
    return getName({ web3Lib: this._web3Lib, ...args });
  }

  public async erc20BalanceOf(
    args: Omit<Parameters<typeof balanceOf>[0], "web3Lib">
  ): Promise<ReturnType<typeof balanceOf>> {
    return balanceOf({ web3Lib: this._web3Lib, ...args });
  }

  /**
   * Signs an ERC-3009 `ReceiveWithAuthorization` payload that authorizes the
   * spender (default: protocol diamond) to pull `value` units of `exchangeToken`
   * from the signer. The returned `abiData` is the ABI-encoded
   * `[validAfter, validBefore, nonce, v, r, s]` payload consumed by the protocol's
   * TokenTransferAuthorization flow.
   */
  // Overload: returnTypedDataToSign is true → returns StructuredData
  public async signReceiveWithErc3009Authorization(
    exchangeToken: string,
    tokenDomain: { name: string; version: string },
    value: BigNumberish,
    validAfter: BigNumberish,
    validBefore: BigNumberish,
    overrides: Partial<{ spender: string }> & { returnTypedDataToSign: true }
  ): Promise<StructuredData>;
  // Overload: returnTypedDataToSign is false or undefined → returns SignedReceiveWithAuthorization
  public async signReceiveWithErc3009Authorization(
    exchangeToken: string,
    tokenDomain: { name: string; version: string },
    value: BigNumberish,
    validAfter: BigNumberish,
    validBefore: BigNumberish,
    overrides?: Partial<{ spender: string; returnTypedDataToSign?: false }>
  ): Promise<SignedReceiveWithAuthorization>;
  // Implementation
  public async signReceiveWithErc3009Authorization(
    exchangeToken: string,
    tokenDomain: { name: string; version: string },
    value: BigNumberish,
    validAfter: BigNumberish,
    validBefore: BigNumberish,
    overrides: Partial<{
      spender: string;
      returnTypedDataToSign: boolean;
    }> = {}
  ): Promise<SignedReceiveWithAuthorization | StructuredData> {
    const user = await this._web3Lib.getSignerAddress();
    const baseArgs = {
      web3Lib: this._web3Lib,
      chainId: this._chainId,
      user,
      exchangeToken,
      spender: overrides.spender || this._protocolDiamond,
      value,
      tokenDomain,
      validAfter,
      validBefore
    };
    if (overrides.returnTypedDataToSign) {
      return signReceiveWithErc3009Authorization({
        ...baseArgs,
        returnTypedDataToSign: true
      });
    }
    return signReceiveWithErc3009Authorization({
      ...baseArgs,
      returnTypedDataToSign: false
    });
  }

  /**
   * Signs an EIP-2612 `Permit` payload that authorizes the spender (default:
   * protocol diamond) to pull `value` units of `exchangeToken` from the signer
   * up to `deadline`. The returned `abiData` is the ABI-encoded
   * `[deadline, v, r, s]` payload consumed by the protocol's
   * TokenTransferAuthorization flow.
   */
  // Overload: returnTypedDataToSign is true → returns StructuredData
  public async signReceiveWithErc2612Permit(
    exchangeToken: string,
    tokenDomain: { name: string; version: string },
    value: BigNumberish,
    deadline: BigNumberish,
    overrides: Partial<{ spender: string }> & { returnTypedDataToSign: true }
  ): Promise<StructuredData>;
  // Overload: returnTypedDataToSign is false or undefined → returns SignedReceivePermit
  public async signReceiveWithErc2612Permit(
    exchangeToken: string,
    tokenDomain: { name: string; version: string },
    value: BigNumberish,
    deadline: BigNumberish,
    overrides?: Partial<{ spender: string; returnTypedDataToSign?: false }>
  ): Promise<SignedReceivePermit>;
  // Implementation
  public async signReceiveWithErc2612Permit(
    exchangeToken: string,
    tokenDomain: { name: string; version: string },
    value: BigNumberish,
    deadline: BigNumberish,
    overrides: Partial<{
      spender: string;
      returnTypedDataToSign: boolean;
    }> = {}
  ): Promise<SignedReceivePermit | StructuredData> {
    const user = await this._web3Lib.getSignerAddress();
    const baseArgs = {
      web3Lib: this._web3Lib,
      chainId: this._chainId,
      user,
      exchangeToken,
      spender: overrides.spender || this._protocolDiamond,
      value,
      tokenDomain,
      deadline
    };
    if (overrides.returnTypedDataToSign) {
      return signReceiveWithErc2612Permit({
        ...baseArgs,
        returnTypedDataToSign: true
      });
    }
    return signReceiveWithErc2612Permit({
      ...baseArgs,
      returnTypedDataToSign: false
    });
  }

  /**
   * Signs a Uniswap Permit2 `PermitTransferFrom` payload authorizing the
   * spender (default: protocol diamond) to pull `value` units of
   * `exchangeToken` from the signer up to `deadline`. The Permit2 contract
   * address defaults to `contracts.permit2` from SDK config and can be
   * overridden via `overrides.permit2Address`. If `overrides.permit2Nonce`
   * is omitted, a random uint256 is generated. The returned `abiData` is the
   * ABI-encoded `[permit2Nonce, deadline, signature]` payload consumed by the
   * protocol's TokenTransferAuthorization flow.
   */
  // Overload: returnTypedDataToSign is true → returns StructuredData
  public async signReceiveWithPermit2(
    exchangeToken: string,
    value: BigNumberish,
    deadline: BigNumberish,
    overrides: Partial<{
      spender: string;
      permit2Address: string;
      permit2Nonce: BigNumberish;
    }> & { returnTypedDataToSign: true }
  ): Promise<StructuredData>;
  // Overload: returnTypedDataToSign is false or undefined → returns SignedReceiveWithPermit2
  public async signReceiveWithPermit2(
    exchangeToken: string,
    value: BigNumberish,
    deadline: BigNumberish,
    overrides?: Partial<{
      spender: string;
      permit2Address: string;
      permit2Nonce: BigNumberish;
      returnTypedDataToSign?: false;
    }>
  ): Promise<SignedReceiveWithPermit2>;
  // Implementation
  public async signReceiveWithPermit2(
    exchangeToken: string,
    value: BigNumberish,
    deadline: BigNumberish,
    overrides: Partial<{
      spender: string;
      permit2Address: string;
      permit2Nonce: BigNumberish;
      returnTypedDataToSign: boolean;
    }> = {}
  ): Promise<SignedReceiveWithPermit2 | StructuredData> {
    const user = await this._web3Lib.getSignerAddress();
    const permit2Address = overrides.permit2Address || this._contracts?.permit2;
    if (!permit2Address) {
      throw new Error(
        "Permit2 contract address not configured. Provide overrides.permit2Address or initialize CoreSDK with contracts.permit2."
      );
    }
    const baseArgs = {
      web3Lib: this._web3Lib,
      chainId: this._chainId,
      user,
      exchangeToken,
      spender: overrides.spender || this._protocolDiamond,
      value,
      permit2Address,
      deadline,
      permit2Nonce: overrides.permit2Nonce
    };
    if (overrides.returnTypedDataToSign) {
      return signReceiveWithPermit2({
        ...baseArgs,
        returnTypedDataToSign: true
      });
    }
    return signReceiveWithPermit2({
      ...baseArgs,
      returnTypedDataToSign: false
    });
  }
}
