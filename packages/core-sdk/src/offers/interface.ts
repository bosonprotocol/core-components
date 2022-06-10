import {
  OfferStruct,
  utils,
  abis,
  OfferDatesStruct,
  OfferDurationsStruct
} from "@bosonprotocol/common";
import { Interface } from "@ethersproject/abi";
import { getAddress } from "@ethersproject/address";
import { CreateOfferArgs } from "./types";

export const bosonOfferHandlerIface = new Interface(abis.IBosonOfferHandlerABI);

export function encodeCreateOffer(args: CreateOfferArgs) {
  return bosonOfferHandlerIface.encodeFunctionData(
    "createOffer",
    createOfferArgsToStructs(args)
  );
}

export function createOfferArgsToStructs(
  args: CreateOfferArgs
): [
  Partial<OfferStruct>,
  Partial<OfferDatesStruct>,
  Partial<OfferDurationsStruct>
] {
  return [
    argsToOfferStruct(args),
    argsToOfferDatesStruct(args),
    argsToOfferDurationsStruct(args)
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
    fulfillmentPeriodDurationInMS,
    voucherValidDurationInMS = 0,
    resolutionPeriodDurationInMS
  } = args;

  return {
    fulfillmentPeriod: utils.timestamp.msToSec(fulfillmentPeriodDurationInMS),
    voucherValid: utils.timestamp.msToSec(voucherValidDurationInMS),
    resolutionPeriod: utils.timestamp.msToSec(resolutionPeriodDurationInMS)
  };
}
