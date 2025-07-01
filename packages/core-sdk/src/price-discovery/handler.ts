import {
  Web3LibAdapter,
  PriceDiscoveryStruct,
  TransactionResponse,
  TransactionRequest
} from "@bosonprotocol/common";
import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import * as exchanges from "../exchanges/handler";
import { getOfferById } from "../offers/subgraph";
import { AddressZero } from "@ethersproject/constants";
import { encodeCommitToPriceDiscoveryOffer } from "./interface";

// Overload: returnTxInfo is true → returns TransactionRequest
export async function commitToPriceDiscoveryOffer(args: {
  contractAddress: string;
  subgraphUrl: string;
  web3Lib: Web3LibAdapter;
  buyer: string;
  tokenIdOrOfferId: BigNumberish;
  priceDiscovery: PriceDiscoveryStruct;
  returnTxInfo: true;
}): Promise<TransactionRequest>;

// Overload: returnTxInfo is false or undefined → returns TransactionResponse
export async function commitToPriceDiscoveryOffer(args: {
  contractAddress: string;
  subgraphUrl: string;
  web3Lib: Web3LibAdapter;
  buyer: string;
  tokenIdOrOfferId: BigNumberish;
  priceDiscovery: PriceDiscoveryStruct;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;

// Implementation
export async function commitToPriceDiscoveryOffer(args: {
  contractAddress: string;
  subgraphUrl: string;
  web3Lib: Web3LibAdapter;
  buyer: string;
  tokenIdOrOfferId: BigNumberish;
  priceDiscovery: PriceDiscoveryStruct;
  returnTxInfo?: boolean;
}): Promise<TransactionRequest | TransactionResponse> {
  let { offerId } = exchanges.parseTokenId(args.tokenIdOrOfferId);
  if (offerId.eq(0)) {
    offerId = BigNumber.from(args.tokenIdOrOfferId);
  }
  const offer = await getOfferById(args.subgraphUrl, offerId);

  // TODO: do we need to check allowance?

  const transactionRequest = {
    to: args.contractAddress,
    data: encodeCommitToPriceDiscoveryOffer(
      args.buyer,
      args.tokenIdOrOfferId,
      args.priceDiscovery
    ),
    value: offer.exchangeToken.address === AddressZero ? offer.price : "0"
  } satisfies TransactionRequest;

  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}
