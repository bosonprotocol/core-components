import {
  OfferStruct,
  utils,
  abis,
  OfferDatesStruct,
  OfferDurationsStruct,
  PriceType,
  RoyaltyInfo,
  OfferCreator,
  DRParametersStruct,
  FullOfferArgs
} from "@bosonprotocol/common";
import { Interface } from "@ethersproject/abi";
import { getAddress } from "@ethersproject/address";
import { BigNumberish } from "@ethersproject/bignumber";
import { CreateOfferArgs } from "./types";
import { AddressZero } from "@ethersproject/constants";
import { fullOfferArgsToStruct } from "../exchanges/interface";

export const bosonOfferHandlerIface = new Interface(abis.IBosonOfferHandlerABI);

export function encodeCreateOffer(args: CreateOfferArgs) {
  return bosonOfferHandlerIface.encodeFunctionData(
    "createOffer",
    createOfferArgsToStructs(args)
  );
}

export function encodeUpdateOfferRoyaltyRecipients(args: {
  offerId: BigNumberish;
  royaltyInfo: RoyaltyInfo;
}) {
  return bosonOfferHandlerIface.encodeFunctionData(
    "updateOfferRoyaltyRecipients",
    [args.offerId, args.royaltyInfo]
  );
}

export function encodeUpdateOfferRoyaltyRecipientsBatch(args: {
  offerIds: BigNumberish[];
  royaltyInfo: RoyaltyInfo;
}) {
  return bosonOfferHandlerIface.encodeFunctionData(
    "updateOfferRoyaltyRecipientsBatch",
    [args.offerIds, args.royaltyInfo]
  );
}

export function encodeCreateOfferBatch(argsBatch: CreateOfferArgs[]) {
  const argsTuples: [
    Partial<OfferStruct>,
    Partial<OfferDatesStruct>,
    Partial<OfferDurationsStruct>,
    Partial<DRParametersStruct>,
    BigNumberish,
    BigNumberish
  ][] = argsBatch.map((args) => createOfferArgsToStructs(args));
  const [
    offers,
    offerDates,
    offerDurations,
    drParameters,
    agentIds,
    feeLimits
  ]: [
    Partial<OfferStruct>[],
    Partial<OfferDatesStruct>[],
    Partial<OfferDurationsStruct>[],
    Partial<DRParametersStruct>[],
    BigNumberish[],
    BigNumberish[]
  ] = argsTuples.reduce<
    [
      Partial<OfferStruct>[],
      Partial<OfferDatesStruct>[],
      Partial<OfferDurationsStruct>[],
      Partial<DRParametersStruct>[],
      BigNumberish[],
      BigNumberish[]
    ]
  >(
    (acc, tuple) => {
      const [
        offer,
        offerDates,
        offerDurations,
        drParameters,
        agentId,
        feeLimit
      ] = tuple;
      return [
        [...acc[0], offer],
        [...acc[1], offerDates],
        [...acc[2], offerDurations],
        [...acc[3], drParameters],
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
    drParameters,
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
  Partial<DRParametersStruct>,
  BigNumberish,
  BigNumberish
] {
  const feeLimit = args.feeLimit !== undefined ? args.feeLimit : args.price;
  return [
    argsToOfferStruct(args),
    argsToOfferDatesStruct(args),
    argsToOfferDurationsStruct(args),
    argsToDRParametersStruct(args),
    args.agentId,
    feeLimit
  ];
}

export function argsToOfferStruct(args: CreateOfferArgs): Partial<OfferStruct> {
  const { exchangeToken, ...restArgs } = args;

  const priceType =
    args.priceType !== undefined ? args.priceType : PriceType.Static;
  const creator =
    args.creator !== undefined ? args.creator : OfferCreator.Seller;
  const royaltyInfo =
    args.royaltyInfo !== undefined
      ? args.royaltyInfo
      : [
          {
            recipients: [],
            bps: []
          }
        ];

  return {
    id: "0",
    sellerId: "0",
    buyerId: "0",
    voided: false,
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
    }),
    creator
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

export function argsToDRParametersStruct(
  args: CreateOfferArgs
): Partial<DRParametersStruct> {
  return {
    disputeResolverId: args.disputeResolverId,
    mutualizerAddress: args.mutualizerAddress || AddressZero
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

export function encodeVoidNonListedOffer(
  args: Omit<
    FullOfferArgs,
    | "offerCreator"
    | "committer"
    | "signature"
    | "conditionalTokenId"
    | "sellerOfferParams"
  >
) {
  return bosonOfferHandlerIface.encodeFunctionData("voidNonListedOffer", [
    fullOfferArgsToStruct(args)
  ]);
}
