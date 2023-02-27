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
    ...args: Parameters<typeof approve>
  ): Promise<ReturnType<typeof approve>> {
    return approve(...args);
  }

  public async erc20GetAllowance(
    ...args: Parameters<typeof getAllowance>
  ): Promise<ReturnType<typeof getAllowance>> {
    return getAllowance(...args);
  }

  public async erc20GetDecimals(
    ...args: Parameters<typeof getDecimals>
  ): Promise<ReturnType<typeof getDecimals>> {
    return getDecimals(...args);
  }

  public async erc20GetSymbol(
    ...args: Parameters<typeof getSymbol>
  ): Promise<ReturnType<typeof getSymbol>> {
    return getSymbol(...args);
  }

  public async erc20GetName(
    ...args: Parameters<typeof getName>
  ): Promise<ReturnType<typeof getName>> {
    return getName(...args);
  }

  public async erc20EnsureAllowance(
    ...args: Parameters<typeof ensureAllowance>
  ): Promise<ReturnType<typeof ensureAllowance>> {
    return ensureAllowance(...args);
  }

  public async erc20BalanceOf(
    ...args: Parameters<typeof balanceOf>
  ): Promise<ReturnType<typeof balanceOf>> {
    return balanceOf(...args);
  }
}
