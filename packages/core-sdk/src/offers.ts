import {
  Web3LibAdapter,
  CreateOfferArgs,
  TransactionResponse,
  OfferStruct,
  utils,
  abis
} from "@bosonprotocol/common";
import { Interface } from "@ethersproject/abi";
import { BigNumber } from "@ethersproject/bignumber";
import { getAddress } from "@ethersproject/address";

export const bosonOfferHandlerIface = new Interface(abis.IBosonOfferHandlerABI);

export async function createOffer(args: {
  offer: CreateOfferArgs;
  web3Lib: Web3LibAdapter;
}): Promise<TransactionResponse> {
  const calldata = encodeCreateOffer(args.offer);
  return args.web3Lib.sendTransaction({
    to: "0x",
    data: calldata,
    value: "0"
  });
}

export function encodeCreateOffer(args: CreateOfferArgs) {
  if (
    BigNumber.from(args.validFromDateInMS).gt(
      BigNumber.from(args.validUntilDateInMS)
    )
  ) {
    throw new Error("'validFromDate' has to be before 'validUntilDate'");
  }

  if (BigNumber.from(args.validUntilDateInMS).lt(BigNumber.from(Date.now()))) {
    throw new Error("'validUntilDate' has to be after now");
  }

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
