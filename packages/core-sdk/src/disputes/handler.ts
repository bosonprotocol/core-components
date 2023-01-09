import { Web3LibAdapter, TransactionResponse } from "@bosonprotocol/common";
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
import { prepareDataSignatureParameters } from "../utils/signature";

export async function raiseDispute(args: {
  exchangeId: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
}): Promise<TransactionResponse> {
  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: encodeRaiseDispute(args)
  });
}

export async function retractDispute(args: {
  exchangeId: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
}): Promise<TransactionResponse> {
  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: encodeRetractDispute(args.exchangeId)
  });
}

export async function extendDisputeTimeout(args: {
  exchangeId: BigNumberish;
  newDisputeTimeout: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
}): Promise<TransactionResponse> {
  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: encodeExtendDisputeTimeout(args)
  });
}

export async function expireDispute(args: {
  exchangeId: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
}): Promise<TransactionResponse> {
  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: encodeExpireDispute(args.exchangeId)
  });
}

export async function expireDisputeBatch(args: {
  exchangeIds: BigNumberish[];
  contractAddress: string;
  web3Lib: Web3LibAdapter;
}): Promise<TransactionResponse> {
  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: encodeExpireDisputeBatch(args.exchangeIds)
  });
}

export async function resolveDispute(args: {
  exchangeId: BigNumberish;
  buyerPercentBasisPoints: BigNumberish;
  sigR: BytesLike;
  sigS: BytesLike;
  sigV: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
}): Promise<TransactionResponse> {
  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: encodeResolveDispute(args)
  });
}

export async function escalateDispute(args: {
  exchangeId: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
}): Promise<TransactionResponse> {
  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: encodeEscalateDispute(args.exchangeId)
  });
}

export async function decideDispute(args: {
  exchangeId: BigNumberish;
  buyerPercent: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
}): Promise<TransactionResponse> {
  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: encodeDecideDispute(args)
  });
}

export async function refuseEscalatedDispute(args: {
  exchangeId: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
}): Promise<TransactionResponse> {
  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: encodeRefuseEscalatedDispute(args.exchangeId)
  });
}

export async function expireEscalatedDispute(args: {
  exchangeId: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
}): Promise<TransactionResponse> {
  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: encodeExpireEscalatedDispute(args.exchangeId)
  });
}

export async function signResolutionProposal(args: {
  exchangeId: BigNumberish;
  buyerPercentBasisPoints: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  chainId: number;
}) {
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

  return prepareDataSignatureParameters({
    message,
    customSignatureType,
    web3Lib: args.web3Lib,
    verifyingContractAddress: args.contractAddress,
    chainId: args.chainId,
    primaryType: "Resolution"
  });
}
