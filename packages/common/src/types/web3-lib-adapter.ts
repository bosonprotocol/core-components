import { BigNumberish } from "@ethersproject/bignumber";

export type Log = {
  data: string;
  topics: string[];
};

export type TransactionRequest = Partial<{
  to: string;
  from: string;
  nonce: number;
  data: string;
  value: BigNumberish;
  gasLimit: BigNumberish;
  gasPrice: BigNumberish;
}>;

export type TransactionResponse = {
  hash: string;
  wait: (confirmations?: number) => Promise<TransactionReceipt>;
};

export type TransactionReceipt = {
  from: string;
  to: string;
  status?: number;
  logs: Log[];
  transactionHash: string;
  effectiveGasPrice: BigNumberish;
};

export interface Web3LibAdapter {
  getSignerAddress(): Promise<string>;
  getChainId(): Promise<number>;
  getBalance(
    addressOrName: string,
    blockNumber?: string | number
  ): Promise<BigNumberish>;
  sendTransaction(
    transactionRequest: TransactionRequest
  ): Promise<TransactionResponse>;
  call(transactionRequest: TransactionRequest): Promise<string>;
  send(rpcMethod: string, payload: unknown[]): Promise<string>;
  getTransactionReceipt(txHash: string): Promise<TransactionReceipt>;
}
