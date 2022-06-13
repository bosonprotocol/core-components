import { BigNumberish } from "@ethersproject/bignumber";
import { isAddress } from "@ethersproject/address";
import { AddressZero } from "@ethersproject/constants";
import { Web3LibAdapter, TransactionResponse } from "@bosonprotocol/common";
import { encodeDepositFunds } from "./interface";

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
