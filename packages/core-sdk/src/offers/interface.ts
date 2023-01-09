import {
  OfferStruct,
  utils,
  abis,
  OfferDatesStruct,
  OfferDurationsStruct
} from "@bosonprotocol/common";
import { Interface } from "@ethersproject/abi";
import { getAddress } from "@ethersproject/address";
import { BigNumberish } from "@ethersproject/bignumber";
import { CreateOfferArgs } from "./types";

export const bosonOfferHandlerIface = new Interface(abis.IBosonOfferHandlerABI);

export function encodeCreateOffer(args: CreateOfferArgs) {
  return bosonOfferHandlerIface.encodeFunctionData(
    "createOffer",
    createOfferArgsToStructs(args)
  );
}

export function encodeCreateOfferBatch(argsBatch: CreateOfferArgs[]) {
  const argsTuples: [
    Partial<OfferStruct>,
    Partial<OfferDatesStruct>,
    Partial<OfferDurationsStruct>,
    BigNumberish,
    BigNumberish
  ][] = argsBatch.map((args) => [
    argsToOfferStruct(args),
    argsToOfferDatesStruct(args),
    argsToOfferDurationsStruct(args),
    args.disputeResolverId,
    args.agentId
  ]);
  const [offers, offerDates, offerDurations, disputeResolverIds, agentIds]: [
    Partial<OfferStruct>[],
    Partial<OfferDatesStruct>[],
    Partial<OfferDurationsStruct>[],
    BigNumberish[],
    BigNumberish[]
  ] = argsTuples.reduce(
    (acc, tuple) => {
      const [offer, offerDates, offerDurations, disputeResolverId, agentId] =
        tuple;
      return [
        [...acc[0], offer],
        [...acc[1], offerDates],
        [...acc[2], offerDurations],
        [...acc[3], disputeResolverId],
        [...acc[4], agentId]
      ];
    },
    [[], [], [], [], []]
  );

  return bosonOfferHandlerIface.encodeFunctionData("createOfferBatch", [
    offers,
    offerDates,
    offerDurations,
    disputeResolverIds,
    agentIds
  ]);
}

export function createOfferArgsToStructs(
  args: CreateOfferArgs
): [
  Partial<OfferStruct>,
  Partial<OfferDatesStruct>,
  Partial<OfferDurationsStruct>,
  BigNumberish,
  BigNumberish
] {
  return [
    argsToOfferStruct(args),
    argsToOfferDatesStruct(args),
    argsToOfferDurationsStruct(args),
    args.disputeResolverId,
    args.agentId
  ];
}

export function argsToOfferStruct(args: CreateOfferArgs): Partial<OfferStruct> {
  const { exchangeToken, ...restArgs } = args;

  return {
    id: "0",
    sellerId: "0",
    ...restArgs,
    exchangeToken: getAddress(exchangeToken)
  };
}

export function argsToOfferDatesStruct(
  args: CreateOfferArgs
): Partial<OfferDatesStruct> {
  const {
    validFromDateInMS,
    validUntilDateInMS,
    voucherRedeemableFromDateInMS,
    voucherRedeemableUntilDateInMS
  } = args;

  return {
    validFrom: utils.timestamp.msToSec(validFromDateInMS),
    validUntil: utils.timestamp.msToSec(validUntilDateInMS),
    voucherRedeemableFrom: utils.timestamp.msToSec(
      voucherRedeemableFromDateInMS
    ),
    voucherRedeemableUntil: utils.timestamp.msToSec(
      voucherRedeemableUntilDateInMS
    )
  };
}

export function argsToOfferDurationsStruct(
  args: CreateOfferArgs
): Partial<OfferDurationsStruct> {
  const {
    disputePeriodDurationInMS,
    voucherValidDurationInMS = 0,
    resolutionPeriodDurationInMS
  } = args;

  return {
    disputePeriod: utils.timestamp.msToSec(disputePeriodDurationInMS),
    voucherValid: utils.timestamp.msToSec(voucherValidDurationInMS),
    resolutionPeriod: utils.timestamp.msToSec(resolutionPeriodDurationInMS)
  };
}
