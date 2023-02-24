import { BaseCoreSDK } from "./../mixins/base-core-sdk";
import { balanceOf } from "./handler";

export class ERC1155Mixin extends BaseCoreSDK {
  /* -------------------------------------------------------------------------- */
  /*                           ERC1155 related methods                          */
  /* -------------------------------------------------------------------------- */
  public async erc1155BalanceOf(
    ...args: Parameters<typeof balanceOf>
  ): Promise<ReturnType<typeof balanceOf>> {
    return balanceOf(...args);
  }
}
