import {
  Web3LibAdapter,
  TransactionResponse,
  TransactionRequest
} from "@bosonprotocol/common";
import { BigNumberish } from "@ethersproject/bignumber";
import { BytesLike } from "@ethersproject/bytes";

import {
  encodeRaiseDispute,
  encodeDecideDispute,
  encodeEscalateDispute,
  encodeExpireDispute,
  encodeExpireDisputeBatch,
  encodeExpireEscalatedDispute,
  encodeExtendDisputeTimeout,
  encodeRefuseEscalatedDispute,
  encodeResolveDispute,
  encodeRetractDispute
} from "./interface";
import {
  getSignatureParameters,
  prepareDataSignatureParameters,
  StructuredData
} from "../utils/signature";

// Overload: returnTxInfo is true → returns TransactionRequest
export async function raiseDispute(args: {
  exchangeId: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo: true;
}): Promise<TransactionRequest>;
// Overload: returnTxInfo is false or undefined → returns TransactionResponse
export async function raiseDispute(args: {
  exchangeId: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;
// Implementation
export async function raiseDispute(args: {
  exchangeId: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: boolean;
}): Promise<TransactionResponse | TransactionRequest> {
  const transactionRequest = {
    to: args.contractAddress,
    data: encodeRaiseDispute(args)
  } satisfies TransactionRequest;
  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

// Overload: returnTxInfo is true → returns TransactionRequest
export async function retractDispute(args: {
  exchangeId: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo: true;
}): Promise<TransactionRequest>;
// Overload: returnTxInfo is false or undefined → returns TransactionResponse
export async function retractDispute(args: {
  exchangeId: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;
// Implementation
export async function retractDispute(args: {
  exchangeId: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: boolean;
}): Promise<TransactionResponse | TransactionRequest> {
  const transactionRequest = {
    to: args.contractAddress,
    data: encodeRetractDispute(args.exchangeId)
  } satisfies TransactionRequest;
  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

// Overload: returnTxInfo is true → returns TransactionRequest
export async function extendDisputeTimeout(args: {
  exchangeId: BigNumberish;
  newDisputeTimeout: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo: true;
}): Promise<TransactionRequest>;
// Overload: returnTxInfo is false or undefined → returns TransactionResponse
export async function extendDisputeTimeout(args: {
  exchangeId: BigNumberish;
  newDisputeTimeout: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;
// Implementation
export async function extendDisputeTimeout(args: {
  exchangeId: BigNumberish;
  newDisputeTimeout: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: boolean;
}): Promise<TransactionResponse | TransactionRequest> {
  const transactionRequest = {
    to: args.contractAddress,
    data: encodeExtendDisputeTimeout(args)
  } satisfies TransactionRequest;
  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

// Overload: returnTxInfo is true → returns TransactionRequest
export async function expireDispute(args: {
  exchangeId: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo: true;
}): Promise<TransactionRequest>;
// Overload: returnTxInfo is false or undefined → returns TransactionResponse
export async function expireDispute(args: {
  exchangeId: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;
// Implementation
export async function expireDispute(args: {
  exchangeId: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: boolean;
}): Promise<TransactionResponse | TransactionRequest> {
  const transactionRequest = {
    to: args.contractAddress,
    data: encodeExpireDispute(args.exchangeId)
  } satisfies TransactionRequest;
  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

// Overload: returnTxInfo is true → returns TransactionRequest
export async function expireDisputeBatch(args: {
  exchangeIds: BigNumberish[];
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo: true;
}): Promise<TransactionRequest>;
// Overload: returnTxInfo is false or undefined → returns TransactionResponse
export async function expireDisputeBatch(args: {
  exchangeIds: BigNumberish[];
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;
// Implementation
export async function expireDisputeBatch(args: {
  exchangeIds: BigNumberish[];
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: boolean;
}): Promise<TransactionResponse | TransactionRequest> {
  const transactionRequest = {
    to: args.contractAddress,
    data: encodeExpireDisputeBatch(args.exchangeIds)
  } satisfies TransactionRequest;
  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

// Overload: returnTxInfo is true → returns TransactionRequest
export async function resolveDispute(
  args:
    | {
        exchangeId: BigNumberish;
        buyerPercentBasisPoints: BigNumberish;
        sigR: BytesLike;
        sigS: BytesLike;
        sigV: BigNumberish;
        contractAddress: string;
        web3Lib: Web3LibAdapter;
        returnTxInfo: true;
      }
    | {
        exchangeId: BigNumberish;
        buyerPercentBasisPoints: BigNumberish;
        signature: string;
        contractAddress: string;
        web3Lib: Web3LibAdapter;
        returnTxInfo: true;
      }
): Promise<TransactionRequest>;
// Overload: returnTxInfo is false or undefined → returns TransactionResponse
export async function resolveDispute(
  args:
    | {
        exchangeId: BigNumberish;
        buyerPercentBasisPoints: BigNumberish;
        sigR: BytesLike;
        sigS: BytesLike;
        sigV: BigNumberish;
        contractAddress: string;
        web3Lib: Web3LibAdapter;
        returnTxInfo?: false | undefined;
      }
    | {
        exchangeId: BigNumberish;
        buyerPercentBasisPoints: BigNumberish;
        signature: string;
        contractAddress: string;
        web3Lib: Web3LibAdapter;
        returnTxInfo?: false | undefined;
      }
): Promise<TransactionResponse>;
// Implementation
export async function resolveDispute(
  args:
    | {
        exchangeId: BigNumberish;
        buyerPercentBasisPoints: BigNumberish;
        sigR: BytesLike;
        sigS: BytesLike;
        sigV: BigNumberish;
        contractAddress: string;
        web3Lib: Web3LibAdapter;
        returnTxInfo?: boolean;
      }
    | {
        exchangeId: BigNumberish;
        buyerPercentBasisPoints: BigNumberish;
        signature: string;
        contractAddress: string;
        web3Lib: Web3LibAdapter;
        returnTxInfo?: boolean;
      }
): Promise<TransactionResponse | TransactionRequest> {
  const transactionRequest = {
    to: args.contractAddress,
    data: encodeResolveDispute(args)
  } satisfies TransactionRequest;
  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

// Overload: returnTxInfo is true → returns TransactionRequest
export async function escalateDispute(args: {
  exchangeId: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo: true;
}): Promise<TransactionRequest>;
// Overload: returnTxInfo is false or undefined → returns TransactionResponse
export async function escalateDispute(args: {
  exchangeId: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;
// Implementation
export async function escalateDispute(args: {
  exchangeId: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: boolean;
}): Promise<TransactionResponse | TransactionRequest> {
  const transactionRequest = {
    to: args.contractAddress,
    data: encodeEscalateDispute(args.exchangeId)
  } satisfies TransactionRequest;
  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

// Overload: returnTxInfo is true → returns TransactionRequest
export async function decideDispute(args: {
  exchangeId: BigNumberish;
  buyerPercent: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo: true;
}): Promise<TransactionRequest>;
// Overload: returnTxInfo is false or undefined → returns TransactionResponse
export async function decideDispute(args: {
  exchangeId: BigNumberish;
  buyerPercent: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;
// Implementation
export async function decideDispute(args: {
  exchangeId: BigNumberish;
  buyerPercent: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: boolean;
}): Promise<TransactionResponse | TransactionRequest> {
  const transactionRequest = {
    to: args.contractAddress,
    data: encodeDecideDispute(args)
  } satisfies TransactionRequest;
  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

// Overload: returnTxInfo is true → returns TransactionRequest
export async function refuseEscalatedDispute(args: {
  exchangeId: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo: true;
}): Promise<TransactionRequest>;
// Overload: returnTxInfo is false or undefined → returns TransactionResponse
export async function refuseEscalatedDispute(args: {
  exchangeId: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;
// Implementation
export async function refuseEscalatedDispute(args: {
  exchangeId: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: boolean;
}): Promise<TransactionResponse | TransactionRequest> {
  const transactionRequest = {
    to: args.contractAddress,
    data: encodeRefuseEscalatedDispute(args.exchangeId)
  } satisfies TransactionRequest;
  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

// Overload: returnTxInfo is true → returns TransactionRequest
export async function expireEscalatedDispute(args: {
  exchangeId: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo: true;
}): Promise<TransactionRequest>;
// Overload: returnTxInfo is false or undefined → returns TransactionResponse
export async function expireEscalatedDispute(args: {
  exchangeId: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;
// Implementation
export async function expireEscalatedDispute(args: {
  exchangeId: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: boolean;
}): Promise<TransactionResponse | TransactionRequest> {
  const transactionRequest = {
    to: args.contractAddress,
    data: encodeExpireEscalatedDispute(args.exchangeId)
  } satisfies TransactionRequest;
  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

export async function signResolutionProposal(args: {
  exchangeId: BigNumberish;
  buyerPercentBasisPoints: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  chainId: number;
  returnTypedDataToSign: true;
}): Promise<StructuredData>;
export async function signResolutionProposal(args: {
  exchangeId: BigNumberish;
  buyerPercentBasisPoints: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  chainId: number;
  returnTypedDataToSign?: false;
}): Promise<ReturnType<typeof getSignatureParameters>>;
export async function signResolutionProposal(args: {
  exchangeId: BigNumberish;
  buyerPercentBasisPoints: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  chainId: number;
  returnTypedDataToSign?: boolean;
}): Promise<StructuredData | ReturnType<typeof getSignatureParameters>> {
  const customSignatureType = {
    Resolution: [
      { name: "exchangeId", type: "uint256" },
      { name: "buyerPercentBasisPoints", type: "uint256" }
    ]
  };

  const message = {
    exchangeId: args.exchangeId.toString(),
    buyerPercentBasisPoints: args.buyerPercentBasisPoints.toString()
  };

  const signatureArgs = {
    message,
    customSignatureType,
    web3Lib: args.web3Lib,
    verifyingContractAddress: args.contractAddress,
    chainId: args.chainId,
    primaryType: "Resolution"
  } as const;

  if (args.returnTypedDataToSign) {
    return prepareDataSignatureParameters({
      ...signatureArgs,
      returnTypedDataToSign: true
    });
  } else {
    return prepareDataSignatureParameters({
      ...signatureArgs,
      returnTypedDataToSign: false
    });
  }
}
