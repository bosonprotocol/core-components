import {
  OfferStruct,
  utils,
  abis,
  OfferDatesStruct,
  OfferDurationsStruct
} from "@bosonprotocol/common";
import { Interface } from "@ethersproject/abi";
import { getAddress } from "@ethersproject/address";
import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
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
    voucherRedeemableFromDateInMS
  } = args;

  return {
    validFrom: utils.timestamp.msToSec(validFromDateInMS),
    validUntil: utils.timestamp.msToSec(validUntilDateInMS),
    voucherRedeemableFrom: utils.timestamp.msToSec(
      voucherRedeemableFromDateInMS
    ),
    voucherRedeemableUntil:
      // NOTE: Field `voucherRedeemableUntil` not yet fully supported in protocol.
      // Therefore converting to `voucherValid` field.
      "0"
  };
}

export function argsToOfferDurationsStruct(
  args: CreateOfferArgs
): Partial<OfferDurationsStruct> {
  const {
    fulfillmentPeriodDurationInMS,
    voucherRedeemableUntilDateInMS,
    voucherRedeemableFromDateInMS,
    voucherValidDurationInMS = 0,
    resolutionPeriodDurationInMS
  } = args;

  return {
    fulfillmentPeriod: utils.timestamp.msToSec(fulfillmentPeriodDurationInMS),
    voucherValid: utils.timestamp.msToSec(
      voucherValidDurationInMS ||
        // NOTE: Field `voucherRedeemableUntil` not yet fully supported in protocol.
        // Therefore converting to `voucherValid` field.
        BigNumber.from(voucherRedeemableUntilDateInMS).sub(
          BigNumber.from(voucherRedeemableFromDateInMS)
        )
    ),
    resolutionPeriod: utils.timestamp.msToSec(resolutionPeriodDurationInMS)
  };
}
