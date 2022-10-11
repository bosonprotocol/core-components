import { abis } from "@bosonprotocol/common";
import { Interface } from "@ethersproject/abi";
import { BigNumberish } from "@ethersproject/bignumber";
import { BytesLike } from "@ethersproject/bytes";

export const bosonDisputeHandlerIface = new Interface(
  abis.IBosonDisputeHandlerABI
);

export function encodeDecideDispute(args: {
  exchangeId: BigNumberish;
  buyerPercent: BigNumberish;
}) {
  return bosonDisputeHandlerIface.encodeFunctionData("decideDispute", [
    args.exchangeId,
    args.buyerPercent
  ]);
}

export function encodeEscalateDispute(exchangeId: BigNumberish) {
  return bosonDisputeHandlerIface.encodeFunctionData("escalateDispute", [
    exchangeId
  ]);
}

export function encodeExpireDispute(exchangeId: BigNumberish) {
  return bosonDisputeHandlerIface.encodeFunctionData("expireDispute", [
    exchangeId
  ]);
}

export function encodeExpireDisputeBatch(exchangeIds: BigNumberish[]) {
  return bosonDisputeHandlerIface.encodeFunctionData("expireDispute", [
    exchangeIds
  ]);
}

export function encodeExpireEscalatedDispute(exchangeId: BigNumberish) {
  return bosonDisputeHandlerIface.encodeFunctionData("expireEscalatedDispute", [
    exchangeId
  ]);
}

export function encodeExtendDisputeTimeout(args: {
  exchangeId: BigNumberish;
  newDisputeTimeout: BigNumberish;
}) {
  return bosonDisputeHandlerIface.encodeFunctionData("extendDisputeTimeout", [
    args.exchangeId,
    args.newDisputeTimeout
  ]);
}

export function encodeRaiseDispute(args: { exchangeId: BigNumberish }) {
  return bosonDisputeHandlerIface.encodeFunctionData("raiseDispute", [
    args.exchangeId
  ]);
}

export function encodeRefuseEscalatedDispute(exchangeId: BigNumberish) {
  return bosonDisputeHandlerIface.encodeFunctionData("refuseEscalatedDispute", [
    exchangeId
  ]);
}

export function encodeResolveDispute(args: {
  exchangeId: BigNumberish;
  buyerPercentBasisPoints: BigNumberish;
  sigR: BytesLike;
  sigS: BytesLike;
  sigV: BigNumberish;
}) {
  return bosonDisputeHandlerIface.encodeFunctionData("resolveDispute", [
    args.exchangeId,
    args.buyerPercentBasisPoints,
    args.sigR,
    args.sigS,
    args.sigV
  ]);
}

export function encodeRetractDispute(exchangeId: BigNumberish) {
  return bosonDisputeHandlerIface.encodeFunctionData("retractDispute", [
    exchangeId
  ]);
}
