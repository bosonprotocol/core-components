import { BaseCoreSDK } from "./../mixins/base-core-sdk";
import { balanceOf } from "./handler";

export class ERC1155Mixin extends BaseCoreSDK {
  /* -------------------------------------------------------------------------- */
  /*                           ERC1155 related methods                          */
  /* -------------------------------------------------------------------------- */
  public async erc1155BalanceOf(
    args: Omit<Parameters<typeof balanceOf>[0], "web3Lib">
  ): Promise<ReturnType<typeof balanceOf>> {
    return balanceOf({ web3Lib: this._web3Lib, ...args });
  }
}
