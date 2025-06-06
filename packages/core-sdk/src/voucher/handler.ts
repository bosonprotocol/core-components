import {
  TransactionRequest,
  TransactionResponse,
  Web3LibAdapter
} from "@bosonprotocol/common";
import { Range } from "@bosonprotocol/common/src/types";
import { BigNumberish } from "@ethersproject/bignumber";
import {
  decodeGetAvailablePreMints,
  decodeGetRangeByOfferId,
  decodeIsApprovedForAll,
  decodeIsTrustedForwarder,
  decodeOwner,
  encodeBurnPremintedVouchers,
  encodeCallExternalContract,
  encodeGetAvailablePreMints,
  encodeGetRangeByOfferId,
  encodeIsApprovedForAll,
  encodeIsTrustedForwarder,
  encodeOwner,
  encodePreMint,
  encodeSetApprovalForAllToContract,
  encodeSetContractURI,
  encodeTransferFrom,
  encodeWithdrawToProtocol
} from "./interface";

// burnPremintedVouchers overloads
export async function burnPremintedVouchers(args: {
  offerId: BigNumberish;
  amount: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo: true;
}): Promise<TransactionRequest>;

export async function burnPremintedVouchers(args: {
  offerId: BigNumberish;
  amount: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;

export async function burnPremintedVouchers(args: {
  offerId: BigNumberish;
  amount: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: boolean;
}): Promise<TransactionRequest | TransactionResponse> {
  const transactionRequest = {
    to: args.contractAddress,
    data: encodeBurnPremintedVouchers(args.offerId, args.amount)
  } satisfies TransactionRequest;

  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

export async function owner(args: {
  contractAddress: string;
  web3Lib: Web3LibAdapter;
}): Promise<string> {
  const result = await args.web3Lib.call({
    to: args.contractAddress,
    data: encodeOwner()
  });
  return decodeOwner(result);
}

export async function isTrustedForwarder(args: {
  forwarder: string;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
}): Promise<boolean> {
  const result = await args.web3Lib.call({
    to: args.contractAddress,
    data: encodeIsTrustedForwarder(args.forwarder)
  });
  return decodeIsTrustedForwarder(result);
}

export async function getAvailablePreMints(args: {
  offerId: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
}): Promise<string> {
  const result = await args.web3Lib.call({
    to: args.contractAddress,
    data: encodeGetAvailablePreMints(args.offerId)
  });
  const [count] = decodeGetAvailablePreMints(result);
  return String(count);
}

export async function getRangeByOfferId(args: {
  offerId: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
}): Promise<Range> {
  const result = await args.web3Lib.call({
    to: args.contractAddress,
    data: encodeGetRangeByOfferId(args.offerId)
  });
  const [range] = decodeGetRangeByOfferId(result);
  return {
    start: range.start,
    length: range._length,
    minted: range.minted,
    lastBurnedTokenId: range.lastBurnedTokenId
  };
}

// preMint overloads
export async function preMint(args: {
  offerId: BigNumberish;
  amount: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo: true;
}): Promise<TransactionRequest>;

export async function preMint(args: {
  offerId: BigNumberish;
  amount: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;

export async function preMint(args: {
  offerId: BigNumberish;
  amount: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: boolean;
}): Promise<TransactionRequest | TransactionResponse> {
  const transactionRequest = {
    to: args.contractAddress,
    data: encodePreMint(args.offerId, args.amount)
  } satisfies TransactionRequest;

  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

// transferFrom overloads
export async function transferFrom(args: {
  from: BigNumberish;
  to: BigNumberish;
  tokenId: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo: true;
}): Promise<TransactionRequest>;

export async function transferFrom(args: {
  from: BigNumberish;
  to: BigNumberish;
  tokenId: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;

export async function transferFrom(args: {
  from: BigNumberish;
  to: BigNumberish;
  tokenId: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: boolean;
}): Promise<TransactionRequest | TransactionResponse> {
  const transactionRequest = {
    to: args.contractAddress,
    data: encodeTransferFrom(args.from, args.to, args.tokenId)
  } satisfies TransactionRequest;

  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

export async function isApprovedForAll(args: {
  owner: string;
  operator: string;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
}): Promise<boolean> {
  const result = await args.web3Lib.call({
    to: args.contractAddress,
    data: encodeIsApprovedForAll(args.owner, args.operator)
  });
  const [isApproved] = decodeIsApprovedForAll(result);
  return isApproved;
}

// setContractURI overloads
export async function setContractURI(args: {
  contractURI: string;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo: true;
}): Promise<TransactionRequest>;

export async function setContractURI(args: {
  contractURI: string;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;

export async function setContractURI(args: {
  contractURI: string;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: boolean;
}): Promise<TransactionRequest | TransactionResponse> {
  const transactionRequest = {
    to: args.contractAddress,
    data: encodeSetContractURI(args.contractURI)
  } satisfies TransactionRequest;

  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

// callExternalContract overloads
export async function callExternalContract(args: {
  to: string;
  data: string;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo: true;
}): Promise<TransactionRequest>;

export async function callExternalContract(args: {
  to: string;
  data: string;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;

export async function callExternalContract(args: {
  to: string;
  data: string;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: boolean;
}): Promise<TransactionRequest | TransactionResponse> {
  const transactionRequest = {
    to: args.contractAddress,
    data: encodeCallExternalContract(args.to, args.data)
  } satisfies TransactionRequest;

  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

// setApprovalForAllToContract overloads
export async function setApprovalForAllToContract(args: {
  operator: string;
  approved: boolean;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo: true;
}): Promise<TransactionRequest>;

export async function setApprovalForAllToContract(args: {
  operator: string;
  approved: boolean;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;

export async function setApprovalForAllToContract(args: {
  operator: string;
  approved: boolean;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: boolean;
}): Promise<TransactionRequest | TransactionResponse> {
  const transactionRequest = {
    to: args.contractAddress,
    data: encodeSetApprovalForAllToContract(args.operator, args.approved)
  } satisfies TransactionRequest;

  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

// withdrawToProtocol overloads
export async function withdrawToProtocol(args: {
  tokenList: string[];
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo: true;
}): Promise<TransactionRequest>;

export async function withdrawToProtocol(args: {
  tokenList: string[];
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;

export async function withdrawToProtocol(args: {
  tokenList: string[];
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: boolean;
}): Promise<TransactionRequest | TransactionResponse> {
  const transactionRequest = {
    to: args.contractAddress,
    data: encodeWithdrawToProtocol(args.tokenList)
  } satisfies TransactionRequest;

  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}
