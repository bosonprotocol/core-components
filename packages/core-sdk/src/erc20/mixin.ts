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

export class ERC20Mixin extends BaseCoreSDK {
  /* -------------------------------------------------------------------------- */
  /*                           ERC20 related methods                          */
  /* -------------------------------------------------------------------------- */
  public async erc20Approve(
    args: Omit<Parameters<typeof approve>[0], "web3Lib">
  ): Promise<ReturnType<typeof approve>> {
    return approve({ web3Lib: this._web3Lib, ...args });
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

  public async erc20EnsureAllowance(
    args: Omit<Parameters<typeof ensureAllowance>[0], "web3Lib">
  ): Promise<ReturnType<typeof ensureAllowance>> {
    return ensureAllowance({ web3Lib: this._web3Lib, ...args });
  }

  public async erc20BalanceOf(
    args: Omit<Parameters<typeof balanceOf>[0], "web3Lib">
  ): Promise<ReturnType<typeof balanceOf>> {
    return balanceOf({ web3Lib: this._web3Lib, ...args });
  }
}
