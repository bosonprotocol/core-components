import { BigNumberish } from "@ethersproject/bignumber";

export type ContractAddresses = {
  protocolDiamond: string;
};

export type ProtocolConfig = {
  envName: string;
  chainId: number;
  subgraphUrl: string;
  contracts: ContractAddresses;
};

export type CreateOfferArgs = {
  id: BigNumberish;
  price: BigNumberish;
  deposit: BigNumberish;
  penalty: BigNumberish;
  quantity: BigNumberish;
  validFromDateInMS: BigNumberish;
  validUntilDateInMS: BigNumberish;
  redeemableDateInMS: BigNumberish;
  fulfillmentPeriodDurationInMS: BigNumberish;
  voucherValidDurationInMS: BigNumberish;
  seller: string;
  exchangeToken: string;
  metadataUri: string;
  metadataHash: string;
};

export type OfferStruct = {
  id: BigNumberish;
  price: BigNumberish;
  deposit: BigNumberish;
  penalty: BigNumberish;
  quantity: BigNumberish;
  validFromDate: BigNumberish;
  validUntilDate: BigNumberish;
  redeemableDate: BigNumberish;
  fulfillmentPeriodDuration: BigNumberish;
  voucherValidDuration: BigNumberish;
  seller: string;
  exchangeToken: string;
  metadataUri: string;
  metadataHash: string;
  voided: boolean;
};

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
  wait: (confirmations: number) => Promise<TransactionReceipt>;
};

export type TransactionReceipt = {
  from: string;
  to: string;
  status?: number;
  logs: Log[];
};

export interface Web3LibAdapter {
  getChainId(): Promise<number>;
  getBalance(address: string): Promise<BigNumberish>;
  sendTransaction(
    transactionRequest: TransactionRequest
  ): Promise<TransactionResponse>;
}

export type Metadata = {
  title: string;
  description: string;
};

export interface MetadataStorage {
  getMetadata(metadataUri: string): Promise<Metadata>;
  storeMetadata(metadata: Metadata): Promise<string>;
}
