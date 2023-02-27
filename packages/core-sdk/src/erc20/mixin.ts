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
    ...args: Omit<Parameters<typeof approve>, "web3Lib">
  ): Promise<ReturnType<typeof approve>> {
    return approve({ web3Lib: this._web3Lib, ...args[0] });
  }

  public async erc20GetAllowance(
    ...args: Omit<Parameters<typeof getAllowance>, "web3Lib">
  ): Promise<ReturnType<typeof getAllowance>> {
    return getAllowance({ web3Lib: this._web3Lib, ...args[0] });
  }

  public async erc20GetDecimals(
    ...args: Omit<Parameters<typeof getDecimals>, "web3Lib">
  ): Promise<ReturnType<typeof getDecimals>> {
    return getDecimals({ web3Lib: this._web3Lib, ...args[0] });
  }

  public async erc20GetSymbol(
    ...args: Omit<Parameters<typeof getSymbol>, "web3Lib">
  ): Promise<ReturnType<typeof getSymbol>> {
    return getSymbol({ web3Lib: this._web3Lib, ...args[0] });
  }

  public async erc20GetName(
    ...args: Omit<Parameters<typeof getName>, "web3Lib">
  ): Promise<ReturnType<typeof getName>> {
    return getName({ web3Lib: this._web3Lib, ...args[0] });
  }

  public async erc20EnsureAllowance(
    ...args: Omit<Parameters<typeof ensureAllowance>, "web3Lib">
  ): Promise<ReturnType<typeof ensureAllowance>> {
    return ensureAllowance({ web3Lib: this._web3Lib, ...args[0] });
  }

  public async erc20BalanceOf(
    ...args: Omit<Parameters<typeof balanceOf>, "web3Lib">
  ): Promise<ReturnType<typeof balanceOf>> {
    return balanceOf({ web3Lib: this._web3Lib, ...args[0] });
  }
}
