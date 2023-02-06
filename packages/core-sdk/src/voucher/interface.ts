import { abis } from "@bosonprotocol/common";
import { Interface } from "@ethersproject/abi";
import { BigNumberish } from "@ethersproject/bignumber";

export const bosonVoucherIface = new Interface(abis.IBosonVoucherABI);

export function encodeBurnPremintedVouchers(offerId: BigNumberish) {
  return bosonVoucherIface.encodeFunctionData("burnPremintedVouchers", [
    offerId
  ]);
}

export function encodeGetAvailablePreMints(offerId: BigNumberish) {
  return bosonVoucherIface.encodeFunctionData("getAvailablePreMints", [
    offerId
  ]);
}

export function decodeGetAvailablePreMints(result: string) {
  return bosonVoucherIface.decodeFunctionResult("getAvailablePreMints", result);
}

export function encodeIsApprovedForAll(owner: string, operator: string) {
  return bosonVoucherIface.encodeFunctionData("isApprovedForAll", [
    owner,
    operator
  ]);
}

export function decodeIsApprovedForAll(result: string) {
  return bosonVoucherIface.decodeFunctionResult("isApprovedForAll", result);
}

export function encodeGetRangeByOfferId(offerId: BigNumberish) {
  return bosonVoucherIface.encodeFunctionData("getRangeByOfferId", [offerId]);
}

export function decodeGetRangeByOfferId(result: string) {
  return bosonVoucherIface.decodeFunctionResult("getRangeByOfferId", result);
}

export function encodePreMint(offerId: BigNumberish, amount: BigNumberish) {
  return bosonVoucherIface.encodeFunctionData("preMint", [offerId, amount]);
}

export function encodeSetApprovalForAll(operator: string, approved: boolean) {
  return bosonVoucherIface.encodeFunctionData("setApprovalForAll", [
    operator,
    approved
  ]);
}

export function encodeTransferFrom(
  from: BigNumberish,
  to: BigNumberish,
  tokenId: BigNumberish
) {
  return bosonVoucherIface.encodeFunctionData("transferFrom", [
    from,
    to,
    tokenId
  ]);
}
