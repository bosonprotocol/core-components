import { OfferStruct, utils, abis, Log } from "@bosonprotocol/common";
import { Interface } from "@ethersproject/abi";
import { getAddress } from "@ethersproject/address";
import { CreateOfferArgs } from "./types";

export const bosonOfferHandlerIface = new Interface(abis.IBosonOfferHandlerABI);

export function getCreatedOfferIdFromLogs(logs: Log[]) {
  const parsedLogs = logs.map((log) => parseLog(log.data, log.topics));

  const [offerCreatedLog] = parsedLogs.filter(
    (log) => log.name === "OfferCreated"
  );

  if (!offerCreatedLog) {
    return null;
  }

  return String(offerCreatedLog.args.offerId);
}

export function parseLog(data: string, topics: string[]) {
  return bosonOfferHandlerIface.parseLog({ data, topics });
}

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
    seller,
    validFromDateInMS,
    validUntilDateInMS,
    redeemableDateInMS,
    fulfillmentPeriodDurationInMS,
    voucherValidDurationInMS,
    ...restArgs
  } = args;

  return {
    id: "0",
    ...restArgs,
    exchangeToken: getAddress(exchangeToken),
    seller: getAddress(seller),
    validFromDate: utils.timestamp.msToSec(validFromDateInMS),
    validUntilDate: utils.timestamp.msToSec(validUntilDateInMS),
    redeemableDate: utils.timestamp.msToSec(redeemableDateInMS),
    fulfillmentPeriodDuration: utils.timestamp.msToSec(
      fulfillmentPeriodDurationInMS
    ),
    voucherValidDuration: utils.timestamp.msToSec(voucherValidDurationInMS)
  };
}
