import {
  TransactionResponse,
  TransactionRequest,
  PriceDiscoveryStruct,
  Web3LibAdapter
} from "@bosonprotocol/common";
import { BaseCoreSDK } from "./../mixins/base-core-sdk";
import { commitToPriceDiscoveryOffer } from "./handler";
import { BigNumberish } from "@ethersproject/bignumber";

export class PriceDiscoveryMixin<
  T extends Web3LibAdapter
> extends BaseCoreSDK<T> {
  /**
   * Commits to a price discovery offer (first step of an exchange)
   * This transaction only succeeds if there is an existing buyer account for connected signer.
   * @param buyer - Buyer address.
   * @param tokenIdOrOfferId - Token ID or Offer ID.
   * @param priceDiscovery - Price discovery struct.
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
  // Overload: returnTxInfo is true → returns TransactionRequest
  public async commitToPriceDiscoveryOffer(
    buyer: string,
    tokenIdOrOfferId: BigNumberish,
    priceDiscovery: PriceDiscoveryStruct,
    overrides: Partial<{
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo: true;
    }>
  ): Promise<TransactionRequest>;

  // Overload: returnTxInfo is false or undefined → returns TransactionResponse
  public async commitToPriceDiscoveryOffer(
    buyer: string,
    tokenIdOrOfferId: BigNumberish,
    priceDiscovery: PriceDiscoveryStruct,
    overrides?: Partial<{
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo?: false | undefined;
    }>
  ): Promise<TransactionResponse>;

  // Implementation
  public async commitToPriceDiscoveryOffer(
    buyer: string,
    tokenIdOrOfferId: BigNumberish,
    priceDiscovery: PriceDiscoveryStruct,
    overrides: Partial<{
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo?: boolean;
    }> = {}
  ): Promise<TransactionResponse | TransactionRequest> {
    const { returnTxInfo } = overrides;

    const commitArgs = {
      buyer,
      tokenIdOrOfferId,
      priceDiscovery,
      web3Lib: this._web3Lib,
      contractAddress: overrides.contractAddress || this._protocolDiamond,
      subgraphUrl: this._subgraphUrl
    } as const satisfies Parameters<typeof commitToPriceDiscoveryOffer>[0];

    if (returnTxInfo === true) {
      return commitToPriceDiscoveryOffer({
        ...commitArgs,
        returnTxInfo: true
      });
    } else {
      return commitToPriceDiscoveryOffer({
        ...commitArgs,
        returnTxInfo: false
      });
    }
  }
}
