import { BigNumberish } from "@ethersproject/bignumber";
import { isAddress } from "@ethersproject/address";
import { AddressZero } from "@ethersproject/constants";
import {
  Web3LibAdapter,
  TransactionRequest,
  TransactionResponse
} from "@bosonprotocol/common";
import { encodeDepositFunds, encodeWithdrawFunds } from "./interface";
import { getFunds } from "./subgraph";

// Overload: returnTxInfo is true -> returns TransactionRequest
export async function depositFunds(args: {
  entityId: BigNumberish;
  fundsTokenAddress?: string;
  fundsAmount: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo: true;
}): Promise<TransactionRequest>;

// Overload: returnTxInfo is false or undefined -> returns TransactionResponse
export async function depositFunds(args: {
  entityId: BigNumberish;
  fundsTokenAddress?: string;
  fundsAmount: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;

// Implementation
export async function depositFunds(args: {
  entityId: BigNumberish;
  fundsTokenAddress?: string;
  fundsAmount: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: boolean;
}): Promise<TransactionRequest | TransactionResponse> {
  const { fundsTokenAddress = AddressZero } = args;

  if (!isAddress(fundsTokenAddress)) {
    throw new Error(`Invalid fundsTokenAddress: ${fundsTokenAddress}`);
  }

  const isNativeCoin = fundsTokenAddress === AddressZero;

  const transactionRequest: TransactionRequest = {
    to: args.contractAddress,
    data: encodeDepositFunds(
      args.entityId,
      fundsTokenAddress,
      args.fundsAmount
    ),
    value: isNativeCoin ? args.fundsAmount : "0"
  };

  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

// Overload: returnTxInfo is true -> returns TransactionRequest
export async function withdrawFunds(args: {
  entityId: BigNumberish;
  tokensToWithdraw: Array<string>;
  amountsToWithdraw: Array<BigNumberish>;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo: true;
}): Promise<TransactionRequest>;

// Overload: returnTxInfo is false or undefined -> returns TransactionResponse
export async function withdrawFunds(args: {
  entityId: BigNumberish;
  tokensToWithdraw: Array<string>;
  amountsToWithdraw: Array<BigNumberish>;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;

// Implementation
export async function withdrawFunds(args: {
  entityId: BigNumberish;
  tokensToWithdraw: Array<string>;
  amountsToWithdraw: Array<BigNumberish>;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: boolean;
}): Promise<TransactionRequest | TransactionResponse> {
  const transactionRequest: TransactionRequest = {
    to: args.contractAddress,
    data: encodeWithdrawFunds(
      args.entityId,
      args.tokensToWithdraw,
      args.amountsToWithdraw
    )
  };

  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

// Overload: returnTxInfo is true -> returns TransactionRequest
export async function withdrawAllAvailableFunds(args: {
  entityId: BigNumberish;
  subgraphUrl: string;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo: true;
}): Promise<TransactionRequest>;

// Overload: returnTxInfo is false or undefined -> returns TransactionResponse
export async function withdrawAllAvailableFunds(args: {
  entityId: BigNumberish;
  subgraphUrl: string;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;

// Implementation
export async function withdrawAllAvailableFunds(args: {
  entityId: BigNumberish;
  subgraphUrl: string;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: boolean;
}): Promise<TransactionRequest | TransactionResponse> {
  const funds = await getFunds(args.subgraphUrl, {
    fundsFilter: {
      accountId: args.entityId.toString()
    }
  });

  const { tokensToWithdraw, amountsToWithdraw } = funds
    .filter((fund) => Number(fund.availableAmount))
    .reduce(
      (acc, fund) => {
        acc.tokensToWithdraw.push(fund.token.address);
        acc.amountsToWithdraw.push(fund.availableAmount);
        return acc;
      },
      {
        tokensToWithdraw: [] as string[],
        amountsToWithdraw: [] as BigNumberish[]
      }
    );

  const transactionRequest: TransactionRequest = {
    to: args.contractAddress,
    data: encodeWithdrawFunds(
      args.entityId,
      tokensToWithdraw,
      amountsToWithdraw
    )
  };

  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}
