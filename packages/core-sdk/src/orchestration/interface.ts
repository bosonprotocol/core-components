import { abis } from "@bosonprotocol/common";
import { Interface } from "@ethersproject/abi";
import { createSellerArgsToStruct } from "../accounts/interface";
import { createOfferArgsToStructs } from "../offers/interface";

import { CreateSellerArgs } from "../accounts/types";
import { CreateOfferArgs } from "../offers/types";

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
