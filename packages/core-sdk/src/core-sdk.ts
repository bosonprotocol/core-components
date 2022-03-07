import {
  Web3LibAdapter,
  CreateOfferArgs,
  TransactionResponse
} from "@bosonprotocol/common";
import { createOffer } from "./offers";

export class CoreSDK {
  private _web3Lib: Web3LibAdapter;

  constructor(opts: { web3Lib: Web3LibAdapter }) {
    this._web3Lib = opts.web3Lib;
  }

  public async getBalance(address: string) {
    return this._web3Lib.getBalance(address);
  }

  public async createOffer(
    args: CreateOfferArgs
  ): Promise<TransactionResponse> {
    return createOffer({
      offer: args,
      web3Lib: this._web3Lib
    });
  }
}
