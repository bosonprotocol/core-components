import {
  OfferStruct,
  utils,
  abis,
  OfferDatesStruct,
  OfferDurationsStruct,
  PriceType
} from "@bosonprotocol/common";
import { Interface } from "@ethersproject/abi";
import { getAddress } from "@ethersproject/address";
import { BigNumberish } from "@ethersproject/bignumber";
import { CreateOfferArgs } from "./types";
import { AddressZero } from "@ethersproject/constants";

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
    BigNumberish,
    BigNumberish
  ][] = argsBatch.map((args) => createOfferArgsToStructs(args));
  const [
    offers,
    offerDates,
    offerDurations,
    disputeResolverIds,
    agentIds,
    feeLimits
  ]: [
    Partial<OfferStruct>[],
    Partial<OfferDatesStruct>[],
    Partial<OfferDurationsStruct>[],
    BigNumberish[],
    BigNumberish[],
    BigNumberish[]
  ] = argsTuples.reduce(
    (acc, tuple) => {
      const [
        offer,
        offerDates,
        offerDurations,
        disputeResolverId,
        agentId,
        feeLimit
      ] = tuple;
      return [
        [...acc[0], offer],
        [...acc[1], offerDates],
        [...acc[2], offerDurations],
        [...acc[3], disputeResolverId],
        [...acc[4], agentId],
        [...acc[5], feeLimit]
      ];
    },
    [[], [], [], [], [], []]
  );

  return bosonOfferHandlerIface.encodeFunctionData("createOfferBatch", [
    offers,
    offerDates,
    offerDurations,
    disputeResolverIds,
    agentIds,
    feeLimits
  ]);
}

export function createOfferArgsToStructs(
  args: CreateOfferArgs
): [
  Partial<OfferStruct>,
  Partial<OfferDatesStruct>,
  Partial<OfferDurationsStruct>,
  BigNumberish,
  BigNumberish,
  BigNumberish
] {
  const feeLimit = args.feeLimit !== undefined ? args.feeLimit : args.price;
  return [
    argsToOfferStruct(args),
    argsToOfferDatesStruct(args),
    argsToOfferDurationsStruct(args),
    args.disputeResolverId,
    args.agentId,
    feeLimit
  ];
}

export function argsToOfferStruct(args: CreateOfferArgs): Partial<OfferStruct> {
  const { exchangeToken, ...restArgs } = args;

  const priceType =
    args.priceType !== undefined ? args.priceType : PriceType.Static;
  const royaltyInfo =
    args.royaltyInfo !== undefined
      ? args.royaltyInfo
      : [
          {
            recipients: [AddressZero],
            bps: [0]
          }
        ];

  return {
    id: "0",
    sellerId: "0",
    ...restArgs,
    exchangeToken: getAddress(exchangeToken),
    priceType,
    royaltyInfo: royaltyInfo.map((royaltyInfoItem) => {
      return {
        ...royaltyInfoItem,
        recipients: royaltyInfoItem.recipients.map((recipient) =>
          getAddress(recipient)
        )
      };
    })
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

export function encodeReserveRange(
  offerId: BigNumberish,
  length: BigNumberish,
  to: string
) {
  return bosonOfferHandlerIface.encodeFunctionData("reserveRange", [
    offerId,
    length,
    to
  ]);
}
