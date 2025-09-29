import {
  abis,
  ConditionStruct,
  DRParametersStruct,
  OfferDatesStruct,
  OfferDurationsStruct,
  OfferStruct
} from "@bosonprotocol/common";
import { Interface } from "@ethersproject/abi";
import { BigNumberish } from "@ethersproject/bignumber";
import {
  argsToDRParametersStruct,
  argsToOfferDatesStruct,
  argsToOfferDurationsStruct,
  argsToOfferStruct
} from "../offers/interface";
import { CreateOfferAndCommitArgs } from "@bosonprotocol/common/src";

export const bosonExchangeHandlerIface = new Interface(
  abis.IBosonExchangeHandlerABI
);

export const bosonExchangeCommitHandlerIface = new Interface(
  abis.IBosonExchangeCommitHandlerABI
);

export function encodeCommitToOffer(buyer: string, offerId: BigNumberish) {
  return bosonExchangeCommitHandlerIface.encodeFunctionData("commitToOffer", [
    buyer,
    offerId
  ]);
}

export function encodeCommitToConditionalOffer(
  buyer: string,
  offerId: BigNumberish,
  tokenId: BigNumberish
) {
  return bosonExchangeCommitHandlerIface.encodeFunctionData(
    "commitToConditionalOffer",
    [buyer, offerId, tokenId]
  );
}

export function encodeCreateOfferAndCommit(args: CreateOfferAndCommitArgs) {
  return bosonExchangeCommitHandlerIface.encodeFunctionData(
    "createOfferAndCommit",
    createOfferAndCommitArgsToStructs(args)
  );
}

export function createOfferAndCommitArgsToStructs(
  args: CreateOfferAndCommitArgs
): [
  Partial<OfferStruct>,
  Partial<OfferDatesStruct>,
  Partial<OfferDurationsStruct>,
  Partial<DRParametersStruct>,
  Partial<ConditionStruct>,
  BigNumberish,
  BigNumberish,
  boolean
] {
  const feeLimit = args.feeLimit !== undefined ? args.feeLimit : args.price;
  return [
    argsToOfferStruct(args),
    argsToOfferDatesStruct(args),
    argsToOfferDurationsStruct(args),
    argsToDRParametersStruct(args),
    args.condition,
    args.agentId,
    feeLimit,
    args.useDepositedFunds
  ];
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
