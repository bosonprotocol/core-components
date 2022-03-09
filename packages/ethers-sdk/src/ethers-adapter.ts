import { BigNumberish, ethers } from "ethers";
import {
  TransactionResponse,
  Web3LibAdapter,
  TransactionRequest
} from "@bosonprotocol/common";

export type EthersAdapterConstructorArgs = {
  signer: ethers.Signer;
};

export class EthersAdapter implements Web3LibAdapter {
  private _signer: ethers.Signer;

  constructor({ signer }: EthersAdapterConstructorArgs) {
    this._signer = signer;
  }

  public async getChainId(): Promise<number> {
    return this._signer.getChainId();
  }

  public async getBalance(address: string): Promise<BigNumberish> {
    return this._signer.getBalance();
  }

  public async sendTransaction(
    transactionRequest: TransactionRequest
  ): Promise<TransactionResponse> {
    return this._signer.sendTransaction(transactionRequest);
  }
}
