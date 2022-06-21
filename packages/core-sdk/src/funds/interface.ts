import { abis } from "@bosonprotocol/common";
import { Interface } from "@ethersproject/abi";
import { BigNumberish } from "@ethersproject/bignumber";

export const bosonFundsHandlerIface = new Interface(abis.IBosonFundsHandlerABI);

export function encodeDepositFunds(
  sellerId: BigNumberish,
  tokenAddress: string,
  amount: BigNumberish
) {
  return bosonFundsHandlerIface.encodeFunctionData("depositFunds", [
    sellerId,
    tokenAddress,
    amount
  ]);
}

export function encodeWithdrawFunds(
  sellerId: BigNumberish,
  tokensToWithdraw: Array<string>,
  amountsToWithdraw: Array<BigNumberish>
) {
  return bosonFundsHandlerIface.encodeFunctionData("withdrawFunds", [
    sellerId,
    tokensToWithdraw,
    amountsToWithdraw
  ]);
}
