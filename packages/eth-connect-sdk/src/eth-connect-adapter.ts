import { RequestManager } from "eth-connect";
import {
  TransactionResponse,
  Web3LibAdapter,
  TransactionRequest,
  TransactionReceipt
} from "@bosonprotocol/common";

export type ExternalFeatures = {
  delay: (ms: number) => Promise<undefined>;
  getSignerAddress?: () => Promise<string>;
};

const TX_POLLING_DELAY = 2000;

/**
 * `Web3LibAdapter` implementation targeting `eth-connect` in a Decentraland
 * environment.
 */
export class EthConnectAdapter implements Web3LibAdapter {
  private _requestManager: RequestManager;
  private _externalFeatures: ExternalFeatures;

  private static receiptData = new Map<string, { from: string; to: string }>();

  constructor(
    requestManager: RequestManager,
    externalFeatures: ExternalFeatures
  ) {
    this._requestManager = requestManager;
    this._externalFeatures = externalFeatures;
  }

  public async getSignerAddress() {
    if (this._externalFeatures?.getSignerAddress) {
      const address = await this._externalFeatures?.getSignerAddress();
      return address;
    }
    // Note: usage of requestManager.eth_accounts is prohibited by DCL kernel
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
    const from = transactionRequest.from || (await this.getSignerAddress());
    const to = transactionRequest.to || "0x";
    const txHash = await this._requestManager.eth_sendTransaction({
      from,
      to,
      data: transactionRequest.data || "0x",
      gas: transactionRequest.gasLimit?.toString(),
      gasPrice: transactionRequest.gasPrice?.toString(),
      value: transactionRequest.value?.toString(),
      nonce: transactionRequest.nonce?.toString()
    });
    const receiptData = { from, to };
    EthConnectAdapter.receiptData.set(txHash, receiptData);
    return {
      hash: txHash,
      wait: async (confirmations?: number) => this._wait(txHash, receiptData)
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
    return this._requestManager.sendAsync({
      method: rpcMethod,
      params: payload
    });
  }

  private async _wait(
    txHash: string,
    receiptData: { from: string; to: string },
    confirmations?: number
  ): Promise<TransactionReceipt> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<TransactionReceipt>(async (resolve, reject) => {
      // Note: usage of requestManager.waitForCompletion is prohibited by DCL kernel (since 07-2021)
      let receipt = null;
      const account = await this.getSignerAddress();
      const blockNumber = await this._requestManager.eth_blockNumber();
      const presumedNonce = await this._requestManager.eth_getTransactionCount(
        account,
        blockNumber
      );
      let nonce = presumedNonce;
      while (receipt == null && nonce <= presumedNonce) {
        await this._externalFeatures.delay(TX_POLLING_DELAY);
        receipt = await this._requestManager.eth_getTransactionReceipt(txHash);
        const blockNumber = await this._requestManager.eth_blockNumber();
        nonce = await this._requestManager.eth_getTransactionCount(
          account,
          blockNumber
        );
      }
      console.log("receipt", receipt);
      // try getting more data about the transaction

      // receipt.status === 0 --> failed (TBC)
      if (receipt && receipt.status === 0) {
        reject(`Transaction failed:\n${receipt.transactionHash}`);
      } else {
        // Note: if nonce has increased, we can suppose the transaction has been speed up or cancelled
        resolve(await this.getTransactionReceipt(txHash, receiptData));
      }
    });
  }

  public async getTransactionReceipt(
    txHash,
    receiptData?: { from: string; to: string }
  ): Promise<TransactionReceipt> {
    const txObject = receiptData || EthConnectAdapter.receiptData.get(txHash);
    // Note: usage of requestManager.eth_getTransactionByHash is prohibited by DCL kernel

    const txReceipt = await this._requestManager.eth_getTransactionReceipt(
      txHash
    );
    return {
      from: txObject?.from,
      to: txObject?.to,
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
