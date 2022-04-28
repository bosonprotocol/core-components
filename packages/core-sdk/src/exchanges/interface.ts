import { abis } from "@bosonprotocol/common";
import { Interface } from "@ethersproject/abi";
import { BigNumberish } from "@ethersproject/bignumber";

export const bosonExchangeHandlerIface = new Interface(
  abis.IBosonExchangeHandlerABI
);

export function encodeCommitToOffer(buyer: string, offerId: BigNumberish) {
  return bosonExchangeHandlerIface.encodeFunctionData("commitToOffer", [
    buyer,
    offerId
  ]);
}
