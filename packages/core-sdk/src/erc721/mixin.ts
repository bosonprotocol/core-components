import { BaseCoreSDK } from "./../mixins/base-core-sdk";
import { balanceOf, ownerOf, tokenOfOwnerByIndex } from "./handler";

export class ERC721Mixin extends BaseCoreSDK {
  /* -------------------------------------------------------------------------- */
  /*                           ERC721 related methods                          */
  /* -------------------------------------------------------------------------- */
  public async erc721BalanceOf(
    ...args: Parameters<typeof balanceOf>
  ): Promise<ReturnType<typeof balanceOf>> {
    return balanceOf(...args);
  }

  public async erc721OwnerOf(
    ...args: Parameters<typeof ownerOf>
  ): Promise<ReturnType<typeof ownerOf>> {
    return ownerOf(...args);
  }

  public async erc721TokenOfOwnerByIndex(
    ...args: Parameters<typeof tokenOfOwnerByIndex>
  ): Promise<ReturnType<typeof tokenOfOwnerByIndex>> {
    return tokenOfOwnerByIndex(...args);
  }
}
