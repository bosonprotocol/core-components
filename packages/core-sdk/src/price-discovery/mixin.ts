import {
  TransactionResponse,
  PriceDiscoveryStruct
} from "@bosonprotocol/common";
import { BaseCoreSDK } from "./../mixins/base-core-sdk";
import { commitToPriceDiscoveryOffer } from "./handler";
import { BigNumberish } from "@ethersproject/bignumber";

export class PriceDiscoveryMixin extends BaseCoreSDK {
  /**
   * Commits to a price discovery offer (first step of an exchange)
   * @param groupToCreate -  group with the contract condition
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
  public async commitToPriceDiscoveryOffer(
    buyer: string,
    tokenIdOrOfferId: BigNumberish,
    priceDiscovery: PriceDiscoveryStruct
  ): Promise<TransactionResponse> {
    return commitToPriceDiscoveryOffer({
      buyer,
      tokenIdOrOfferId,
      priceDiscovery,
      web3Lib: this._web3Lib,
      subgraphUrl: this._subgraphUrl,
      contractAddress: this._protocolDiamond
    });
  }
}
