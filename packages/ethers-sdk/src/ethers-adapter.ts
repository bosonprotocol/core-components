import { BigNumberish, providers, Signer } from "ethers";
import {
  TransactionResponse,
  Web3LibAdapter,
  TransactionRequest
} from "@bosonprotocol/common";

export class EthersAdapter implements Web3LibAdapter {
  private _signer: Signer;
  private _provider: providers.JsonRpcProvider;

  constructor(provider: providers.JsonRpcProvider, signer?: Signer) {
    this._provider = provider;

    this._signer = signer
      ? signer.connect(this._provider)
      : this._provider.getSigner();
  }

  public async getSignerAddress() {
    return this._signer.getAddress();
  }

  public async getChainId(): Promise<number> {
    return this._signer.getChainId();
  }

  public async getBalance(
    addressOrName: string,
    blockNumber?: string | number
  ): Promise<BigNumberish> {
    return this._provider.getBalance(addressOrName, blockNumber);
  }

  public async sendTransaction(
    transactionRequest: TransactionRequest
  ): Promise<TransactionResponse> {
    return this._signer.sendTransaction(transactionRequest);
  }

  public async call(transactionRequest: TransactionRequest): Promise<string> {
    return this._provider.call(transactionRequest);
  }

  public async send(rpcMethod: string, payload: unknown[]): Promise<string> {
    return this._provider.send(rpcMethod, payload);
  }
}
