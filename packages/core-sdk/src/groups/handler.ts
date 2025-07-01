import {
  TransactionResponse,
  TransactionRequest,
  CreateGroupArgs,
  Web3LibAdapter
} from "@bosonprotocol/common";
import { encodeCreateGroup } from "./interface";

// Overload: returnTxInfo is true -> returns TransactionRequest
export async function createGroup(args: {
  groupToCreate: CreateGroupArgs;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo: true;
}): Promise<TransactionRequest>;

// Overload: returnTxInfo is false or undefined -> returns TransactionResponse
export async function createGroup(args: {
  groupToCreate: CreateGroupArgs;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;

// Implementation
export async function createGroup(args: {
  groupToCreate: CreateGroupArgs;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: boolean;
}): Promise<TransactionRequest | TransactionResponse> {
  const transactionRequest: TransactionRequest = {
    to: args.contractAddress,
    data: encodeCreateGroup(args.groupToCreate)
  };

  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}
