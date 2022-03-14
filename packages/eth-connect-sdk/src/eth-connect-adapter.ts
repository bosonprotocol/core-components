import { RequestManager } from "eth-connect";
import {
  TransactionResponse,
  Web3LibAdapter,
  TransactionRequest
} from "@bosonprotocol/common";

export class EthConnectAdapter implements Web3LibAdapter {
  private _requestManager: RequestManager;

  constructor(requestManager: RequestManager) {
    this._requestManager = requestManager;
  }

  public async getSignerAddress() {
    const [address] = await this._requestManager.eth_accounts();
    return address;
  }

  public async getChainId(): Promise<number> {
    return this._requestManager.provider.getChainId();
  }

  public async getBalance(address: string): Promise<string> {
    const blockNumber = await this._requestManager.eth_blockNumber();
    const balance = await this._requestManager.eth_getBalance(
      address,
      blockNumber.toString()
    );
    return balance.toString();
  }

  public async sendTransaction(
    transactionRequest: TransactionRequest
  ): Promise<TransactionResponse> {
    const txHash = await this._requestManager.eth_sendTransaction({
      from: "0x",
      to: transactionRequest.to || "0x",
      gas: transactionRequest?.gasLimit.toString(),
      gasPrice: transactionRequest?.gasPrice.toString(),
      value: transactionRequest?.value.toString(),
      data: transactionRequest.data || "0x",
      nonce: transactionRequest?.nonce.toString()
    });

    return {
      hash: txHash,
      wait: async (confirmations?: number) => this._wait(txHash)
    };
  }

  public async call(transactionRequest: TransactionRequest): Promise<string> {
    const blockNumber = await this._requestManager.eth_blockNumber();
    return this._requestManager.eth_call(
      {
        data: transactionRequest.data,
        to: transactionRequest.to
      },
      blockNumber
    );
  }

  private async _wait(txHash: string, confirmations?: number): Promise<any> {
    throw new Error("Not implemented");
  }
}
