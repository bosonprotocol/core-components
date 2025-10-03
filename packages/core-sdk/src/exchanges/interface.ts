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
import { FullOfferArgs } from "@bosonprotocol/common/src";
import { conditionArgsToStructs } from "../groups/interface";

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

export function encodeCreateOfferAndCommit(args: FullOfferArgs) {
  return bosonExchangeCommitHandlerIface.encodeFunctionData(
    "createOfferAndCommit",
    fullOfferArgsToStructs(args)
  );
}

function fullOfferArgsToStructs(
  args: FullOfferArgs
): [
  [
    Partial<OfferStruct>,
    Partial<OfferDatesStruct>,
    Partial<OfferDurationsStruct>,
    Partial<DRParametersStruct>,
    Omit<ConditionStruct, "gatingType"> & { gating: number },
    BigNumberish,
    BigNumberish,
    boolean
  ],
  string,
  string,
  string,
  BigNumberish,
  [BigNumberish, [string[], BigNumberish[]], BigNumberish]
] {
  return [
    fullOfferArgsToStruct(args),
    args.offerCreator,
    args.committer,
    args.signature,
    args.conditionalTokenId || "0",
    [
      args.sellerOfferParams.collectionIndex,
      [
        args.sellerOfferParams.royaltyInfo.recipients,
        args.sellerOfferParams.royaltyInfo.bps
      ],
      args.sellerOfferParams.mutualizerAddress
    ]
  ];
}

export function fullOfferArgsToStruct(
  args: Omit<
    FullOfferArgs,
    | "offerCreator"
    | "committer"
    | "signature"
    | "conditionalTokenId"
    | "sellerOfferParams"
  >
): [
  Partial<OfferStruct>,
  Partial<OfferDatesStruct>,
  Partial<OfferDurationsStruct>,
  Partial<DRParametersStruct>,
  Omit<ConditionStruct, "gatingType"> & { gating: number },
  BigNumberish,
  BigNumberish,
  boolean
] {
  const feeLimit = args.feeLimit !== undefined ? args.feeLimit : args.price;

  return [
    // fullOffer
    argsToOfferStruct(args),
    argsToOfferDatesStruct(args),
    argsToOfferDurationsStruct(args),
    argsToDRParametersStruct(args),
    conditionArgsToStructs(args.condition),
    args.agentId,
    feeLimit.toString(),
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
