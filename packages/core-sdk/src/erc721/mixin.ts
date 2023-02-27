import { BaseCoreSDK } from "./../mixins/base-core-sdk";
import { balanceOf, ownerOf, tokenOfOwnerByIndex } from "./handler";

export class ERC721Mixin extends BaseCoreSDK {
  /* -------------------------------------------------------------------------- */
  /*                           ERC721 related methods                          */
  /* -------------------------------------------------------------------------- */
  public async erc721BalanceOf(
    ...args: Omit<Parameters<typeof balanceOf>, "web3Lib">
  ): Promise<ReturnType<typeof balanceOf>> {
    return balanceOf({ web3Lib: this._web3Lib, ...args[0] });
  }

  public async erc721OwnerOf(
    ...args: Omit<Parameters<typeof ownerOf>, "web3Lib">
  ): Promise<ReturnType<typeof ownerOf>> {
    return ownerOf({ web3Lib: this._web3Lib, ...args[0] });
  }

  public async erc721TokenOfOwnerByIndex(
    ...args: Omit<Parameters<typeof tokenOfOwnerByIndex>, "web3Lib">
  ): Promise<ReturnType<typeof tokenOfOwnerByIndex>> {
    return tokenOfOwnerByIndex({ web3Lib: this._web3Lib, ...args[0] });
  }
}
