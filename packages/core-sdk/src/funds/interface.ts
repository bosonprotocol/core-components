import { abis } from "@bosonprotocol/common";
import { Interface } from "@ethersproject/abi";
import { BigNumberish } from "@ethersproject/bignumber";

export const bosonFundsHandlerIface = new Interface(abis.IBosonFundsHandlerABI);

export function encodeDepositFunds(
  entityId: BigNumberish,
  tokenAddress: string,
  amount: BigNumberish
) {
  return bosonFundsHandlerIface.encodeFunctionData("depositFunds", [
    entityId,
    tokenAddress,
    amount
  ]);
}

export function encodeWithdrawFunds(
  entityId: BigNumberish,
  tokensToWithdraw: Array<string>,
  amountsToWithdraw: Array<BigNumberish>
) {
  return bosonFundsHandlerIface.encodeFunctionData("withdrawFunds", [
    entityId,
    tokensToWithdraw,
    amountsToWithdraw
  ]);
}
