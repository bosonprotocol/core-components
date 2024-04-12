import {
  Web3LibAdapter,
  PriceDiscoveryStruct,
  TransactionResponse
} from "@bosonprotocol/common";
import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import * as exchanges from "../exchanges/handler";
import { getOfferById } from "../offers/subgraph";
import { AddressZero } from "@ethersproject/constants";
import { encodeCommitToPriceDiscoveryOffer } from "./interface";

export async function commitToPriceDiscoveryOffer(args: {
  contractAddress: string;
  subgraphUrl: string;
  web3Lib: Web3LibAdapter;
  buyer: string;
  tokenIdOrOfferId: BigNumberish;
  priceDiscovery: PriceDiscoveryStruct;
}): Promise<TransactionResponse> {
  let { offerId } = exchanges.parseTokenId(args.tokenIdOrOfferId);
  if (offerId.eq(0)) {
    offerId = BigNumber.from(args.tokenIdOrOfferId);
  }
  const offer = await getOfferById(args.subgraphUrl, offerId);

  // is Offer committable condition is different from classic
  //  usecase (for instance quantityAvailable can be 0, as the rNFT are already preminted)
  // await exchanges.checkOfferIsCommittable(offerId, offer);

  // TODO: do we need to check allowance?

  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: encodeCommitToPriceDiscoveryOffer(
      args.buyer,
      args.tokenIdOrOfferId,
      args.priceDiscovery
    ),
    value: offer.exchangeToken.address === AddressZero ? offer.price : "0"
  });
}
