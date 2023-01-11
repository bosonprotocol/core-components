import { abis } from "@bosonprotocol/common";
import { Interface } from "@ethersproject/abi";
import { BigNumberish } from "@ethersproject/bignumber";

export const bosonExchangeHandlerIface = new Interface(
  abis.IBosonExchangeHandlerABI
);

export function encodeCommitToOffer(buyer: string, offerId: BigNumberish) {
  return bosonExchangeHandlerIface.encodeFunctionData("commitToOffer", [
    buyer,
    offerId
  ]);
}

export function encodeCompleteExchange(exchangeId: BigNumberish) {
  return bosonExchangeHandlerIface.encodeFunctionData("completeExchange", [
    exchangeId
  ]);
}

export function encodeCompleteExchangeBatch(exchangeIds: BigNumberish[]) {
  return bosonExchangeHandlerIface.encodeFunctionData("completeExchangeBatch", [
    exchangeIds
  ]);
}

export function encodeRevokeVoucher(exchangeId: BigNumberish) {
  return bosonExchangeHandlerIface.encodeFunctionData("revokeVoucher", [
    exchangeId
  ]);
}

export function encodeCancelVoucher(exchangeId: BigNumberish) {
  return bosonExchangeHandlerIface.encodeFunctionData("cancelVoucher", [
    exchangeId
  ]);
}
export function encodeExpireVoucher(exchangeId: BigNumberish) {
  return bosonExchangeHandlerIface.encodeFunctionData("expireVoucher", [
    exchangeId
  ]);
}
export function encodeRedeemVoucher(exchangeId: BigNumberish) {
  return bosonExchangeHandlerIface.encodeFunctionData("redeemVoucher", [
    exchangeId
  ]);
}
