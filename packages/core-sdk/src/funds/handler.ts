import { BigNumberish } from "@ethersproject/bignumber";
import { isAddress } from "@ethersproject/address";
import { AddressZero } from "@ethersproject/constants";
import { Web3LibAdapter, TransactionResponse } from "@bosonprotocol/common";
import { encodeDepositFunds, encodeWithdrawFunds } from "./interface";
import { getFunds } from "./subgraph";

export async function depositFunds(args: {
  sellerId: BigNumberish;
  fundsTokenAddress?: string;
  fundsAmount: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
}): Promise<TransactionResponse> {
  const { fundsTokenAddress = AddressZero } = args;

  if (!isAddress(fundsTokenAddress)) {
    throw new Error(`Invalid fundsTokenAddress: ${fundsTokenAddress}`);
  }

  const isNativeCoin = fundsTokenAddress === AddressZero;

  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: encodeDepositFunds(
      args.sellerId,
      args.fundsTokenAddress,
      args.fundsAmount
    ),
    value: isNativeCoin ? args.fundsAmount : "0"
  });
}

export async function withdrawFunds(args: {
  sellerId: BigNumberish;
  tokensToWithdraw: Array<string>;
  amountsToWithdraw: Array<BigNumberish>;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
}): Promise<TransactionResponse> {
  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: encodeWithdrawFunds(
      args.sellerId,
      args.tokensToWithdraw,
      args.amountsToWithdraw
    )
  });
}

export async function withdrawAllAvailableFunds(args: {
  sellerId: BigNumberish;
  subgraphUrl: string;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
}): Promise<TransactionResponse> {
  const funds = await getFunds(args.subgraphUrl, {
    fundsFilter: {
      accountId: args.sellerId.toString()
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
        tokensToWithdraw: [],
        amountsToWithdraw: []
      }
    );

  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: encodeWithdrawFunds(
      args.sellerId,
      tokensToWithdraw,
      amountsToWithdraw
    )
  });
}
