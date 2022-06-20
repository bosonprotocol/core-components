import { BigNumberish } from "@ethersproject/bignumber";
import { Web3LibAdapter, TransactionResponse } from "@bosonprotocol/common";
import {
  encodeCancelVoucher,
  encodeCommitToOffer,
  encodeRevokeVoucher,
  encodeRedeemVoucher
} from "./interface";
import { getOfferById } from "../offers/subgraph";
import { getExchangeById } from "../exchanges/subgraph";
import { ExchangeFieldsFragment, ExchangeState } from "../subgraph";

export async function commitToOffer(args: {
  buyer: string;
  offerId: BigNumberish;
  contractAddress: string;
  subgraphUrl: string;
  web3Lib: Web3LibAdapter;
}): Promise<TransactionResponse> {
  const offer = await getOfferById(args.subgraphUrl, args.offerId);

  if (!offer) {
    throw new Error(`Offer with id ${args.offerId} does not exist`);
  }

  if (offer.voidedAt) {
    throw new Error(`Offer with id ${args.offerId} has been voided`);
  }

  if (Date.now() < Number(offer.validFromDate) * 1000) {
    throw new Error(`Offer with id ${args.offerId} is not valid yet`);
  }

  if (Date.now() >= Number(offer.validUntilDate) * 1000) {
    throw new Error(`Offer with id ${args.offerId} is not valid anymore`);
  }

  if (Number(offer.quantityAvailable) === 0) {
    throw new Error(`Offer with id ${args.offerId} is sold out`);
  }

  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: encodeCommitToOffer(args.buyer, args.offerId),
    value: offer.price
  });
}

export async function revokeVoucher(args: {
  exchangeId: BigNumberish;
  contractAddress: string;
  subgraphUrl: string;
  web3Lib: Web3LibAdapter;
}): Promise<TransactionResponse> {
  const [exchange, signerAddress] = await Promise.all([
    getExchangeById(args.subgraphUrl, args.exchangeId),
    args.web3Lib.getSignerAddress()
  ]);

  assertExchange(args.exchangeId, exchange);
  assertExchangeState(exchange, ExchangeState.Committed);
  assertSignerIsOperator(signerAddress, exchange);

  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: encodeRevokeVoucher(args.exchangeId)
  });
}

export async function cancelVoucher(args: {
  exchangeId: BigNumberish;
  contractAddress: string;
  subgraphUrl: string;
  web3Lib: Web3LibAdapter;
}): Promise<TransactionResponse> {
  const [exchange, signerAddress] = await Promise.all([
    getExchangeById(args.subgraphUrl, args.exchangeId),
    args.web3Lib.getSignerAddress()
  ]);

  assertExchange(args.exchangeId, exchange);
  assertExchangeState(exchange, ExchangeState.Committed);
  assertSignerIsBuyer(signerAddress, exchange);

  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: encodeCancelVoucher(args.exchangeId)
  });
}

export async function redeemVoucher(args: {
  exchangeId: BigNumberish;
  contractAddress: string;
  subgraphUrl: string;
  web3Lib: Web3LibAdapter;
}): Promise<TransactionResponse> {
  const [exchange, signerAddress] = await Promise.all([
    getExchangeById(args.subgraphUrl, args.exchangeId),
    args.web3Lib.getSignerAddress()
  ]);

  assertExchange(args.exchangeId, exchange);
  assertExchangeState(exchange, ExchangeState.Committed);
  assertSignerIsBuyer(signerAddress, exchange);

  if (Date.now() < Number(exchange.offer.voucherRedeemableFromDate) * 1000) {
    throw new Error(`Voucher not redeemable yet`);
  }

  if (Date.now() > Number(exchange.validUntilDate) * 1000) {
    throw new Error(`Voucher can not be redeemed anymore`);
  }

  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: encodeRedeemVoucher(args.exchangeId)
  });
}

function assertExchange(
  exchangeId: BigNumberish,
  exchange?: ExchangeFieldsFragment
) {
  if (!exchange) {
    throw new Error(`Exchange with id ${exchangeId} does not exist`);
  }
}

function assertExchangeState(
  exchange: ExchangeFieldsFragment,
  requiredState: ExchangeState
) {
  if (exchange.state !== requiredState) {
    throw new Error(
      `Exchange with id ${exchange.id} not in required state: ${requiredState}, actual state: ${exchange.state}`
    );
  }
}

function assertSignerIsOperator(
  signer: string,
  exchange: ExchangeFieldsFragment
) {
  if (exchange.seller.operator.toLowerCase() !== signer.toLowerCase()) {
    throw new Error(
      `Signer ${signer} is not the operator ${exchange.seller.operator}`
    );
  }
}

function assertSignerIsBuyer(signer: string, exchange: ExchangeFieldsFragment) {
  if (exchange.buyer.wallet.toLowerCase() !== signer.toLowerCase()) {
    throw new Error(
      `Signer ${signer} is not the buyer ${exchange.buyer.wallet}`
    );
  }
}
