import { BaseCoreSDK } from "./../mixins/base-core-sdk";
import {
  balanceOf,
  ownerOf,
  tokenOfOwnerByIndex,
  name,
  symbol,
  tokenUri
} from "./handler";
import { AsyncReturnType } from "@bosonprotocol/common";

export class ERC721Mixin extends BaseCoreSDK {
  /* -------------------------------------------------------------------------- */
  /*                           ERC721 related methods                          */
  /* -------------------------------------------------------------------------- */
  public async erc721Name(
    args: Omit<Parameters<typeof name>[0], "web3Lib">
  ): Promise<AsyncReturnType<typeof name>> {
    return name({ web3Lib: this._web3Lib, ...args });
  }

  public async erc721Symbol(
    args: Omit<Parameters<typeof symbol>[0], "web3Lib">
  ): Promise<AsyncReturnType<typeof symbol>> {
    return symbol({ web3Lib: this._web3Lib, ...args });
  }

  public async erc721TokenUri(
    args: Omit<Parameters<typeof tokenUri>[0], "web3Lib">
  ): Promise<AsyncReturnType<typeof tokenUri>> {
    return tokenUri({ web3Lib: this._web3Lib, ...args });
  }

  public async erc721BalanceOf(
    args: Omit<Parameters<typeof balanceOf>[0], "web3Lib">
  ): Promise<AsyncReturnType<typeof balanceOf>> {
    return balanceOf({ web3Lib: this._web3Lib, ...args });
  }

  public async erc721OwnerOf(
    args: Omit<Parameters<typeof ownerOf>[0], "web3Lib">
  ): Promise<AsyncReturnType<typeof ownerOf>> {
    return ownerOf({ web3Lib: this._web3Lib, ...args });
  }

  public async erc721TokenOfOwnerByIndex(
    args: Omit<Parameters<typeof tokenOfOwnerByIndex>[0], "web3Lib">
  ): Promise<AsyncReturnType<typeof tokenOfOwnerByIndex>> {
    return tokenOfOwnerByIndex({ web3Lib: this._web3Lib, ...args });
  }
}
