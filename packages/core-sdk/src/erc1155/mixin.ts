import { Web3LibAdapter } from "@bosonprotocol/common";
import { BaseCoreSDK } from "./../mixins/base-core-sdk";
import { balanceOf, name, symbol, uri } from "./handler";

export class ERC1155Mixin<T extends Web3LibAdapter> extends BaseCoreSDK<T> {
  /* -------------------------------------------------------------------------- */
  /*                           ERC1155 related methods                          */
  /* -------------------------------------------------------------------------- */
  public async erc1155Name(
    args: Omit<Parameters<typeof name>[0], "web3Lib">
  ): Promise<ReturnType<typeof name>> {
    return name({ web3Lib: this._web3Lib, ...args });
  }
  public async erc1155Symbol(
    args: Omit<Parameters<typeof symbol>[0], "web3Lib">
  ): Promise<ReturnType<typeof symbol>> {
    return symbol({ web3Lib: this._web3Lib, ...args });
  }
  public async erc1155Uri(
    args: Omit<Parameters<typeof uri>[0], "web3Lib">
  ): Promise<ReturnType<typeof uri>> {
    return uri({ web3Lib: this._web3Lib, ...args });
  }

  public async erc1155BalanceOf(
    args: Omit<Parameters<typeof balanceOf>[0], "web3Lib">
  ): Promise<ReturnType<typeof balanceOf>> {
    return balanceOf({ web3Lib: this._web3Lib, ...args });
  }
}
