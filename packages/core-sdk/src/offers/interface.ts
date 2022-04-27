import { OfferStruct, utils, abis } from "@bosonprotocol/common";
import { Interface } from "@ethersproject/abi";
import { getAddress } from "@ethersproject/address";
import { CreateOfferArgs } from "./types";

export const bosonOfferHandlerIface = new Interface(abis.IBosonOfferHandlerABI);

export function encodeCreateOffer(args: CreateOfferArgs) {
  return bosonOfferHandlerIface.encodeFunctionData("createOffer", [
    createOfferArgsToStruct(args)
  ]);
}

export function createOfferArgsToStruct(
  args: CreateOfferArgs
): Partial<OfferStruct> {
  const {
    exchangeToken,
    validFromDateInMS,
    validUntilDateInMS,
    redeemableFromDateInMS,
    fulfillmentPeriodDurationInMS,
    voucherValidDurationInMS,
    ...restArgs
  } = args;

  return {
    id: "0",
    sellerId: "0",
    ...restArgs,
    exchangeToken: getAddress(exchangeToken),
    validFromDate: utils.timestamp.msToSec(validFromDateInMS),
    validUntilDate: utils.timestamp.msToSec(validUntilDateInMS),
    redeemableFromDate: utils.timestamp.msToSec(redeemableFromDateInMS),
    fulfillmentPeriodDuration: utils.timestamp.msToSec(
      fulfillmentPeriodDurationInMS
    ),
    voucherValidDuration: utils.timestamp.msToSec(voucherValidDurationInMS)
  };
}
