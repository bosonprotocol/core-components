import { BigNumberish } from "@ethersproject/bignumber";
import { AddressZero } from "@ethersproject/constants";
import { Web3LibAdapter, TransactionResponse } from "@bosonprotocol/common";
import {
  encodeCancelVoucher,
  encodeCommitToOffer,
  encodeCompleteExchange,
  encodeCompleteExchangeBatch,
  encodeRevokeVoucher,
  encodeExpireVoucher,
  encodeRedeemVoucher
} from "./interface";
import { getOfferById } from "../offers/subgraph";
import { getExchangeById, getExchanges } from "../exchanges/subgraph";
import { ExchangeFieldsFragment, ExchangeState } from "../subgraph";
import { ensureAllowance } from "../erc20/handler";

type BaseExchangeHandlerArgs = {
  contractAddress: string;
  subgraphUrl: string;
  web3Lib: Web3LibAdapter;
};

export async function commitToOffer(
  args: BaseExchangeHandlerArgs & {
    buyer: string;
    offerId: BigNumberish;
  }
): Promise<TransactionResponse> {
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

  if (offer.exchangeToken.address !== AddressZero) {
    const owner = await args.web3Lib.getSignerAddress();
    // check if we need the committer to approve the token first
    await ensureAllowance({
      owner,
      spender: args.contractAddress,
      contractAddress: offer.exchangeToken.address,
      value: offer.price,
      web3Lib: args.web3Lib
    });
  }

  return args.web3Lib.sendTransaction({
    from: args.buyer,
    to: args.contractAddress,
    data: encodeCommitToOffer(args.buyer, args.offerId),
    value: offer.exchangeToken.address === AddressZero ? offer.price : "0"
  });
}

export async function completeExchange(
  args: BaseExchangeHandlerArgs & {
    exchangeId: BigNumberish;
  }
) {
  const [exchange, signerAddress] = await Promise.all([
    getExchangeById(args.subgraphUrl, args.exchangeId),
    args.web3Lib.getSignerAddress()
  ]);

  assertCompletableExchange(args.exchangeId, exchange, signerAddress);

  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: encodeCompleteExchange(args.exchangeId)
  });
}

export async function completeExchangeBatch(
  args: BaseExchangeHandlerArgs & {
    exchangeIds: BigNumberish[];
  }
) {
  const [exchanges, signerAddress] = await Promise.all([
    getExchanges(args.subgraphUrl, {
      exchangesFilter: {
        id_in: args.exchangeIds.map((id) => id.toString())
      }
    }),
    args.web3Lib.getSignerAddress()
  ]);

  for (const exchange of exchanges) {
    assertCompletableExchange(exchange.id, exchange, signerAddress);
  }

  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: encodeCompleteExchangeBatch(args.exchangeIds)
  });
}

export async function revokeVoucher(
  args: BaseExchangeHandlerArgs & {
    exchangeId: BigNumberish;
  }
): Promise<TransactionResponse> {
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

export async function cancelVoucher(
  args: BaseExchangeHandlerArgs & {
    exchangeId: BigNumberish;
  }
): Promise<TransactionResponse> {
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

export async function expireVoucher(
  args: BaseExchangeHandlerArgs & {
    exchangeId: BigNumberish;
  }
): Promise<TransactionResponse> {
  const exchange = await getExchangeById(args.subgraphUrl, args.exchangeId);

  assertExchange(args.exchangeId, exchange);

  if (Date.now() < Number(exchange.validUntilDate) * 1000) {
    throw new Error(`Voucher is still valid`);
  }

  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: encodeExpireVoucher(args.exchangeId)
  });
}

export async function redeemVoucher(
  args: BaseExchangeHandlerArgs & {
    exchangeId: BigNumberish;
  }
): Promise<TransactionResponse> {
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

function assertSignerIsBuyerOrOperator(
  signer: string,
  exchange: ExchangeFieldsFragment
) {
  const { seller, buyer } = exchange;
  const buyerAddress = buyer.wallet;
  const operatorAddress = seller.operator;
  const isSignerOperator =
    signer.toLowerCase() === operatorAddress.toLowerCase();
  const isSignerBuyer = signer.toLowerCase() === buyerAddress.toLowerCase();

  if (!isSignerOperator && !isSignerBuyer) {
    throw new Error(
      `Signer ${signer} is required to be the buyer ${buyerAddress} or operator ${operatorAddress}`
    );
  }

  return { isSignerBuyer, isSignerOperator };
}

function assertCompletableExchange(
  exchangeId: BigNumberish,
  exchange: ExchangeFieldsFragment | null,
  signer: string
) {
  assertExchange(exchangeId, exchange);

  const { isSignerOperator, isSignerBuyer } = assertSignerIsBuyerOrOperator(
    signer,
    exchange
  );

  if (isSignerOperator && !isSignerBuyer) {
    const elapsedSinceRedeemMS =
      Date.now() - Number(exchange.redeemedDate || "0") * 1000;
    const didDisputePeriodElapse =
      elapsedSinceRedeemMS >
      Number(exchange.offer.disputePeriodDuration) * 1000;
    if (!didDisputePeriodElapse) {
      throw new Error(
        `Fulfillment period of ${
          Number(exchange.offer.disputePeriodDuration) * 1000
        } ms did not elapsed since redeem.`
      );
    }
  }
}
