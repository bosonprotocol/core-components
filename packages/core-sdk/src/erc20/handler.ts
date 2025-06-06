import {
  Web3LibAdapter,
  TransactionRequest,
  TransactionResponse
} from "@bosonprotocol/common";
import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { erc20Iface } from "./interface";

// Overload: returnTxInfo is true -> returns TransactionRequest
export async function approve(args: {
  contractAddress: string;
  spender: string;
  value: BigNumberish;
  web3Lib: Web3LibAdapter;
  txRequest?: TransactionRequest;
  returnTxInfo: true;
}): Promise<TransactionRequest>;

// Overload: returnTxInfo is false or undefined -> returns TransactionResponse
export async function approve(args: {
  contractAddress: string;
  spender: string;
  value: BigNumberish;
  web3Lib: Web3LibAdapter;
  txRequest?: TransactionRequest;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;

// Implementation
export async function approve(args: {
  contractAddress: string;
  spender: string;
  value: BigNumberish;
  web3Lib: Web3LibAdapter;
  txRequest?: TransactionRequest;
  returnTxInfo?: boolean;
}): Promise<TransactionRequest | TransactionResponse> {
  const transactionRequest: TransactionRequest = {
    ...args.txRequest,
    to: args.contractAddress,
    data: erc20Iface.encodeFunctionData("approve", [args.spender, args.value])
  };

  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

export async function getAllowance(args: {
  contractAddress: string;
  owner: string;
  spender: string;
  web3Lib: Web3LibAdapter;
}) {
  const result = await args.web3Lib.call({
    to: args.contractAddress,
    data: erc20Iface.encodeFunctionData("allowance", [args.owner, args.spender])
  });

  const [allowance] = erc20Iface.decodeFunctionResult("allowance", result);
  return String(allowance);
}

export async function getDecimals(args: {
  contractAddress: string;
  web3Lib: Web3LibAdapter;
}) {
  const result = await args.web3Lib.call({
    to: args.contractAddress,
    data: erc20Iface.encodeFunctionData("decimals", [])
  });

  const [decimals] = erc20Iface.decodeFunctionResult("decimals", result);
  return Number(decimals);
}

export async function getSymbol(args: {
  contractAddress: string;
  web3Lib: Web3LibAdapter;
}) {
  const result = await args.web3Lib.call({
    to: args.contractAddress,
    data: erc20Iface.encodeFunctionData("symbol", [])
  });

  const [symbols] = erc20Iface.decodeFunctionResult("symbol", result);
  return String(symbols);
}

export async function getName(args: {
  contractAddress: string;
  web3Lib: Web3LibAdapter;
}) {
  const result = await args.web3Lib.call({
    to: args.contractAddress,
    data: erc20Iface.encodeFunctionData("name", [])
  });

  const [name] = erc20Iface.decodeFunctionResult("name", result);
  return String(name);
}

export async function ensureAllowance(args: {
  owner: string;
  spender: string;
  contractAddress: string;
  value: BigNumberish;
  web3Lib: Web3LibAdapter;
  txRequest?: TransactionRequest;
}) {
  const allowance = await getAllowance(args);
  if (BigNumber.from(allowance).lt(args.value)) {
    const approveTx = await approve(args);
    await approveTx.wait();
  }
}

export async function balanceOf(args: {
  contractAddress: string;
  owner: string;
  web3Lib: Web3LibAdapter;
}): Promise<string> {
  const result = await args.web3Lib.call({
    to: args.contractAddress,
    data: erc20Iface.encodeFunctionData("balanceOf", [args.owner])
  });

  const [balance] = erc20Iface.decodeFunctionResult("balanceOf", result);
  return String(balance);
}
