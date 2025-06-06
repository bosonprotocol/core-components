import { Web3LibAdapter } from "@bosonprotocol/common";
import { BaseCoreSDK } from "./../mixins/base-core-sdk";
import { supportsInterface } from "./handler";

export class ERC165Mixin<T extends Web3LibAdapter> extends BaseCoreSDK<T> {
  /* -------------------------------------------------------------------------- */
  /*                           ERC20 related methods                          */
  /* -------------------------------------------------------------------------- */
  public async erc165SupportsInterface(
    args: Omit<Parameters<typeof supportsInterface>[0], "web3Lib">
  ): Promise<ReturnType<typeof supportsInterface>> {
    return supportsInterface({ web3Lib: this._web3Lib, ...args });
  }
}
