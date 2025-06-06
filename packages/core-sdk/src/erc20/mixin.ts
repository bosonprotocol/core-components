import {
  Web3LibAdapter,
  TransactionResponse,
  TransactionRequest
} from "@bosonprotocol/common";
import { BaseCoreSDK } from "./../mixins/base-core-sdk";
import {
  approve,
  getAllowance,
  getDecimals,
  getSymbol,
  getName,
  ensureAllowance,
  balanceOf
} from "./handler";

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
}
