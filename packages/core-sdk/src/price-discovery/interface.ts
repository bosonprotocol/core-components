import { abis, PriceDiscoveryStruct } from "@bosonprotocol/common";
import { Interface } from "@ethersproject/abi";
import { BigNumberish } from "@ethersproject/bignumber";

export const priceDiscoveryHandlerIface = new Interface(
  abis.IBosonPriceDiscoveryHandlerABI
);

export function encodeCommitToPriceDiscoveryOffer(
  buyer: string,
  tokenIdOrOfferId: BigNumberish,
  priceDiscovery: PriceDiscoveryStruct
) {
  return priceDiscoveryHandlerIface.encodeFunctionData(
    "commitToPriceDiscoveryOffer",
    [buyer, tokenIdOrOfferId, priceDiscovery]
  );
}
