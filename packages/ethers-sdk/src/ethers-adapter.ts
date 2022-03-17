import { BigNumberish, ethers } from "ethers";
import {
  TransactionResponse,
  Web3LibAdapter,
  TransactionRequest
} from "@bosonprotocol/common";

export class EthersAdapter implements Web3LibAdapter {
  private _signer: ethers.providers.JsonRpcSigner;
  private _provider: ethers.providers.JsonRpcProvider;

  constructor(provider: ethers.providers.JsonRpcProvider) {
    this._provider = provider;
    this._signer = this._provider.getSigner();
  }

  public async getSignerAddress() {
    return this._signer.getAddress();
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

  public async call(transactionRequest: TransactionRequest): Promise<string> {
    return this._provider.call(transactionRequest);
  }
}
