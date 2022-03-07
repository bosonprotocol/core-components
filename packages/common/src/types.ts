import { BigNumberish } from "@ethersproject/bignumber";

export type ContractAddresses = {
  protocolDiamond: string;
};

export type ChainAddresses = {
  chainId: number;
  protocolDiamond: string;
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
  wait: (confirmations: number) => Promise<any>;
};

export interface Web3LibAdapter {
  getBalance(address: string): Promise<BigNumberish>;

  sendTransaction(
    transactionRequest: TransactionRequest
  ): Promise<TransactionResponse>;

  getOffer(offerId: BigNumberish): Promise<OfferStruct>;
}
