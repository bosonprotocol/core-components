import { RequestManager } from "eth-connect";
import {
  TransactionResponse,
  Web3LibAdapter,
  TransactionRequest,
  TransactionReceipt
} from "@bosonprotocol/common";

/**
 * `Web3LibAdapter` implementation targeting `eth-connect` in a Decentraland
 * environment.
 */
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
    const chainId = await this._requestManager.net_version();
    return parseInt(chainId);
  }

  public async getBalance(
    addressOrName: string,
    blockNumber?: string | number
  ): Promise<string> {
    const balance = await this._requestManager.eth_getBalance(
      addressOrName,
      (blockNumber || (await this._requestManager.eth_blockNumber())).toString()
    );
    return balance.toString();
  }

  public async sendTransaction(
    transactionRequest: TransactionRequest
  ): Promise<TransactionResponse> {
    const txHash = await this._requestManager.eth_sendTransaction({
      from: transactionRequest.from || "0x",
      to: transactionRequest.to || "0x",
      data: transactionRequest.data || "0x",
      gas: transactionRequest.gasLimit?.toString(),
      gasPrice: transactionRequest.gasPrice?.toString(),
      value: transactionRequest.value?.toString(),
      nonce: transactionRequest.nonce?.toString()
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

  public async send(rpcMethod: string, payload: unknown[]): Promise<string> {
    throw new Error("Not implemented");
  }

  private async _wait(txHash: string, confirmations?: number): Promise<any> {
    throw new Error("Not implemented");
  }

  public async getTransactionReceipt(txHash): Promise<TransactionReceipt> {
    const txObject = await this._requestManager.eth_getTransactionByHash(
      txHash
    );

    const txReceipt = await this._requestManager.eth_getTransactionReceipt(
      txHash
    );
    return {
      from: txObject.from,
      to: txObject.to,
      status: txReceipt.status
        ? parseInt(txReceipt.status.toString())
        : undefined,
      logs: txReceipt.logs.map((log) => {
        return { data: log.data, topics: log.topics };
      }),
      transactionHash: txReceipt.transactionHash,
      effectiveGasPrice: txReceipt.gasUsed
    };
  }
}
