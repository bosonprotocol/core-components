import { abis, ConditionStruct } from "@bosonprotocol/common";
import { Interface } from "@ethersproject/abi";
import { createSellerArgsToStruct } from "../accounts/interface";
import { createOfferArgsToStructs } from "../offers/interface";

import { CreateSellerArgs } from "../accounts/types";
import { CreateOfferArgs } from "../offers/types";
import { BigNumberish } from "@ethersproject/bignumber";

export const bosonOrchestrationHandlerIface = new Interface(
  abis.IBosonOrchestrationHandlerABI
);

export function encodeCreateSellerAndOffer(
  seller: CreateSellerArgs,
  offer: CreateOfferArgs
) {
  const sellerArgs = createSellerArgsToStruct(seller);
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
      offerArgs[4] // agentId
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
      condition,
      offerArgs[4] // agentId
    ]
  );
}

export function encodeCreateSellerAndOfferWithCondition(
  seller: CreateSellerArgs,
  offer: CreateOfferArgs,
  condition: ConditionStruct
) {
  const sellerArgs = createSellerArgsToStruct(seller);
  const offerArgs = createOfferArgsToStructs(offer);
  return bosonOrchestrationHandlerIface.encodeFunctionData(
    "createSellerAndOfferWithCondition",
    [
      sellerArgs.sellerStruct,
      offerArgs[0], // offer
      offerArgs[1], // offerDates
      offerArgs[2], // offerDurations
      offerArgs[3], // disputeResolverId
      condition,
      sellerArgs.authTokenStruct,
      sellerArgs.voucherInitValues,
      offerArgs[4] // agentId
    ]
  );
}

export function encodeCreatePremintedOfferAddToGroup(
  offer: CreateOfferArgs,
  reservedRangeLength: BigNumberish,
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
      reservedRangeLength,
      groupId,
      offerArgs[4] // agentId
    ]
  );
}

export function encodeCreatePremintedOfferWithCondition(
  offer: CreateOfferArgs,
  reservedRangeLength: BigNumberish,
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
      reservedRangeLength,
      condition,
      offerArgs[4] // agentId
    ]
  );
}

export function encodeCreateSellerAndPremintedOffer(
  seller: CreateSellerArgs,
  offer: CreateOfferArgs,
  reservedRangeLength: BigNumberish
) {
  const sellerArgs = createSellerArgsToStruct(seller);
  const offerArgs = createOfferArgsToStructs(offer);
  return bosonOrchestrationHandlerIface.encodeFunctionData(
    "createSellerAndPremintedOffer",
    [
      sellerArgs.sellerStruct,
      offerArgs[0], // offer
      offerArgs[1], // offerDates
      offerArgs[2], // offerDurations
      offerArgs[3], // disputeResolverId
      reservedRangeLength,
      sellerArgs.authTokenStruct,
      sellerArgs.voucherInitValues,
      offerArgs[4] // agentId
    ]
  );
}

export function encodeCreateSellerAndPremintedOfferWithCondition(
  seller: CreateSellerArgs,
  offer: CreateOfferArgs,
  reservedRangeLength: BigNumberish,
  condition: ConditionStruct
) {
  const sellerArgs = createSellerArgsToStruct(seller);
  const offerArgs = createOfferArgsToStructs(offer);
  return bosonOrchestrationHandlerIface.encodeFunctionData(
    "createSellerAndPremintedOfferWithCondition",
    [
      sellerArgs.sellerStruct,
      offerArgs[0], // offer
      offerArgs[1], // offerDates
      offerArgs[2], // offerDurations
      offerArgs[3], // disputeResolverId
      reservedRangeLength,
      condition,
      sellerArgs.authTokenStruct,
      sellerArgs.voucherInitValues,
      offerArgs[4] // agentId
    ]
  );
}

export function encodeRaiseAndEscalateDispute(exchangeId: BigNumberish) {
  return bosonOrchestrationHandlerIface.encodeFunctionData(
    "raiseAndEscalateDispute",
    [exchangeId]
  );
}
