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
  return bosonOrchestrationHandlerIface.encodeFunctionData(
    "createSellerAndOffer",
    [
      createSellerArgsToStruct(seller),
      seller.contractUri,
      ...createOfferArgsToStructs(offer)
    ]
  );
}
