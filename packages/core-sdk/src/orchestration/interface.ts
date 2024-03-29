import { abis, ConditionStruct } from "@bosonprotocol/common";
import { Interface } from "@ethersproject/abi";
import { createSellerArgsToStruct } from "../accounts/interface";
import { createOfferArgsToStructs } from "../offers/interface";

import { CreateSellerArgs } from "../accounts/types";
import { CreateOfferArgs } from "../offers/types";
import { BigNumberish } from "@ethersproject/bignumber";
import { conditionArgsToStructs } from "../groups/interface";
import { PremintParametersStruct } from "@bosonprotocol/common/src";

export const bosonOrchestrationHandlerIface = new Interface(
  abis.IBosonOrchestrationHandlerABI
);

export function encodeCreateSellerAndOffer(
  seller: CreateSellerArgs,
  collectionSalt: string,
  offer: CreateOfferArgs
) {
  const sellerArgs = createSellerArgsToStruct(seller, collectionSalt);
  const offerArgs = createOfferArgsToStructs(offer);
  return bosonOrchestrationHandlerIface.encodeFunctionData(
    "createSellerAndOffer",
    [
      sellerArgs.sellerStruct,
      offerArgs[0], // offer
      offerArgs[1], // offerDates
      offerArgs[2], // offerDurations
      offerArgs[3], // disputeResolverId
      sellerArgs.authTokenStruct,
      sellerArgs.voucherInitValues,
      offerArgs[4], // agentId
      offerArgs[5] // feeLimit
    ]
  );
}

export function encodeCreateOfferWithCondition(
  offer: CreateOfferArgs,
  condition: ConditionStruct
) {
  const offerArgs = createOfferArgsToStructs(offer);
  return bosonOrchestrationHandlerIface.encodeFunctionData(
    "createOfferWithCondition",
    [
      offerArgs[0], // offer
      offerArgs[1], // offerDates
      offerArgs[2], // offerDurations
      offerArgs[3], // disputeResolverId
      conditionArgsToStructs(condition),
      offerArgs[4], // agentId
      offerArgs[5] // feeLimit
    ]
  );
}

export function encodeCreateSellerAndOfferWithCondition(
  seller: CreateSellerArgs,
  collectionSalt: string,
  offer: CreateOfferArgs,
  condition: ConditionStruct
) {
  const sellerArgs = createSellerArgsToStruct(seller, collectionSalt);
  const offerArgs = createOfferArgsToStructs(offer);
  return bosonOrchestrationHandlerIface.encodeFunctionData(
    "createSellerAndOfferWithCondition",
    [
      sellerArgs.sellerStruct,
      offerArgs[0], // offer
      offerArgs[1], // offerDates
      offerArgs[2], // offerDurations
      offerArgs[3], // disputeResolverId
      conditionArgsToStructs(condition),
      sellerArgs.authTokenStruct,
      sellerArgs.voucherInitValues,
      offerArgs[4], // agentId
      offerArgs[5] // feeLimit
    ]
  );
}

export function encodeCreatePremintedOfferAddToGroup(
  offer: CreateOfferArgs,
  premintParameters: PremintParametersStruct,
  groupId: BigNumberish
) {
  const offerArgs = createOfferArgsToStructs(offer);

  return bosonOrchestrationHandlerIface.encodeFunctionData(
    "createPremintedOfferAddToGroup",
    [
      offerArgs[0], // offer
      offerArgs[1], // offerDates
      offerArgs[2], // offerDurations
      offerArgs[3], // disputeResolverId
      premintParameters,
      groupId,
      offerArgs[4], // agentId
      offerArgs[5] // feeLimit
    ]
  );
}

export function encodeCreatePremintedOfferWithCondition(
  offer: CreateOfferArgs,
  premintParameters: PremintParametersStruct,
  condition: ConditionStruct
) {
  const offerArgs = createOfferArgsToStructs(offer);
  return bosonOrchestrationHandlerIface.encodeFunctionData(
    "createPremintedOfferWithCondition",
    [
      offerArgs[0], // offer
      offerArgs[1], // offerDates
      offerArgs[2], // offerDurations
      offerArgs[3], // disputeResolverId
      premintParameters,
      conditionArgsToStructs(condition),
      offerArgs[4], // agentId
      offerArgs[5] // feeLimit
    ]
  );
}

export function encodeCreateSellerAndPremintedOffer(
  seller: CreateSellerArgs,
  collectionSalt: string,
  offer: CreateOfferArgs,
  premintParameters: PremintParametersStruct
) {
  const sellerArgs = createSellerArgsToStruct(seller, collectionSalt);
  const offerArgs = createOfferArgsToStructs(offer);
  return bosonOrchestrationHandlerIface.encodeFunctionData(
    "createSellerAndPremintedOffer",
    [
      sellerArgs.sellerStruct,
      offerArgs[0], // offer
      offerArgs[1], // offerDates
      offerArgs[2], // offerDurations
      offerArgs[3], // disputeResolverId
      premintParameters,
      sellerArgs.authTokenStruct,
      sellerArgs.voucherInitValues,
      offerArgs[4], // agentId
      offerArgs[5] // feeLimit
    ]
  );
}

export function encodeCreateSellerAndPremintedOfferWithCondition(
  seller: CreateSellerArgs,
  collectionSalt: string,
  offer: CreateOfferArgs,
  premintParameters: PremintParametersStruct,
  condition: ConditionStruct
) {
  const sellerArgs = createSellerArgsToStruct(seller, collectionSalt);
  const offerArgs = createOfferArgsToStructs(offer);
  return bosonOrchestrationHandlerIface.encodeFunctionData(
    "createSellerAndPremintedOfferWithCondition",
    [
      sellerArgs.sellerStruct,
      offerArgs[0], // offer
      offerArgs[1], // offerDates
      offerArgs[2], // offerDurations
      offerArgs[3], // disputeResolverId
      premintParameters,
      conditionArgsToStructs(condition),
      sellerArgs.authTokenStruct,
      sellerArgs.voucherInitValues,
      offerArgs[4], // agentId
      offerArgs[5] // feeLimit
    ]
  );
}

export function encodeRaiseAndEscalateDispute(exchangeId: BigNumberish) {
  return bosonOrchestrationHandlerIface.encodeFunctionData(
    "raiseAndEscalateDispute",
    [exchangeId]
  );
}
