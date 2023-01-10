import { abis } from "@bosonprotocol/common";
import { Interface } from "@ethersproject/abi";
import { BigNumberish } from "@ethersproject/bignumber";

export const bosonGroupHandlerIface = new Interface(abis.IBosonGroupHandlerABI);

export function encodeBurnPremintedVouchers(offerId: BigNumberish) {
  return bosonGroupHandlerIface.encodeFunctionData("burnPremintedVouchers", [
    offerId
  ]);
}

export function encodeGetAvailablePreMints(offerId: BigNumberish) {
  return bosonGroupHandlerIface.encodeFunctionData("getAvailablePreMints", [
    offerId
  ]);
}

export function decodeGetAvailablePreMints(result: string) {
  return bosonGroupHandlerIface.decodeFunctionResult(
    "getAvailablePreMints",
    result
  );
}

export function encodeGetRangeByOfferId(offerId: BigNumberish) {
  return bosonGroupHandlerIface.encodeFunctionData("getAvailablePreMints", [
    offerId
  ]);
}

export function decodeGetRangeByOfferId(result: string) {
  return bosonGroupHandlerIface.decodeFunctionResult(
    "getAvailablePreMints",
    result
  );
}

export function encodePreMint(offerId: BigNumberish, amount: BigNumberish) {
  return bosonGroupHandlerIface.encodeFunctionData("preMint", [
    offerId,
    amount
  ]);
}
