import { BigNumberish } from "@ethersproject/bignumber";
import { Web3LibAdapter, TransactionResponse } from "@bosonprotocol/common";
import { encodeCommitToOffer } from "./interface";
import { getOfferById } from "../offers/subgraph";

export async function commitToOffer(args: {
  buyer: string;
  offerId: BigNumberish;
  contractAddress: string;
  subgraphUrl: string;
  web3Lib: Web3LibAdapter;
}): Promise<TransactionResponse> {
  const offer = await getOfferById(args.subgraphUrl, args.offerId);

  if (!offer) {
    throw new Error(`Offer with id "${args.offerId}" does not exist`);
  }

  if (offer.voidedAt) {
    throw new Error(`Offer with id "${args.offerId}" has been voided`);
  }

  if (Date.now() < Number(offer.validFromDate) * 1000) {
    throw new Error(`Offer with id "${args.offerId}" is not valid yet`);
  }

  if (Date.now() >= Number(offer.validUntilDate) * 1000) {
    throw new Error(`Offer with id "${args.offerId}" is not valid anymore`);
  }

  if (Number(offer.quantityAvailable) === 0) {
    throw new Error(`Offer with id "${args.offerId}" is sold out`);
  }

  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: encodeCommitToOffer(args.buyer, args.offerId)
  });
}
