import { BigNumberish, BigNumber } from "@ethersproject/bignumber";
import { AddressZero } from "@ethersproject/constants";
import {
  Web3LibAdapter,
  TransactionResponse,
  TransactionRequest,
  utils,
  MetadataStorage
} from "@bosonprotocol/common";
import {
  encodeCancelVoucher,
  encodeCommitToOffer,
  encodeCompleteExchange,
  encodeCompleteExchangeBatch,
  encodeRevokeVoucher,
  encodeExpireVoucher,
  encodeRedeemVoucher,
  encodeCommitToConditionalOffer,
  encodeCreateOfferAndCommit
} from "./interface";
import { getOfferById } from "../offers/subgraph";
import { getExchangeById, getExchanges } from "../exchanges/subgraph";
import {
  ExchangeFieldsFragment,
  ExchangeState,
  OfferFieldsFragment
} from "../subgraph";
import { ensureAllowance } from "../erc20/handler";
import { CreateOfferAndCommitArgs } from "@bosonprotocol/common/src";
import { getDisputeResolverById } from "../accounts/subgraph";
import { storeMetadataOnTheGraph } from "../offers/storage";
import { storeMetadataItems } from "../metadata/storeMetadataItems";

type BaseExchangeHandlerArgs = {
  contractAddress: string;
  subgraphUrl: string;
  web3Lib: Web3LibAdapter;
};

export function checkOfferIsCommittable(
  offerId: BigNumberish,
  offer: OfferFieldsFragment
) {
  if (!offer) {
    throw new Error(`Offer with id ${offerId.toString()} does not exist`);
  }

  if (offer.voidedAt) {
    throw new Error(`Offer with id ${offerId.toString()} has been voided`);
  }

  if (Date.now() < Number(offer.validFromDate) * 1000) {
    throw new Error(`Offer with id ${offerId.toString()} is not valid yet`);
  }

  if (Date.now() >= Number(offer.validUntilDate) * 1000) {
    throw new Error(`Offer with id ${offerId.toString()} is not valid anymore`);
  }

  if (Number(offer.quantityAvailable) === 0) {
    throw new Error(`Offer with id ${offerId.toString()} is sold out`);
  }
}

// Overload: returnTxInfo is true → returns TransactionRequest
export async function commitToOffer(
  args: BaseExchangeHandlerArgs & {
    buyer: string;
    offerId: BigNumberish;
    returnTxInfo: true;
  }
): Promise<TransactionRequest>;

// Overload: returnTxInfo is false or undefined → returns TransactionResponse
export async function commitToOffer(
  args: BaseExchangeHandlerArgs & {
    buyer: string;
    offerId: BigNumberish;
    returnTxInfo?: false | undefined;
  }
): Promise<TransactionResponse>;

// Implementation
export async function commitToOffer(
  args: BaseExchangeHandlerArgs & {
    buyer: string;
    offerId: BigNumberish;
    returnTxInfo?: boolean;
  }
): Promise<TransactionRequest | TransactionResponse> {
  const offer = await getOfferById(args.subgraphUrl, args.offerId);

  await checkOfferIsCommittable(args.offerId, offer);

  if (offer.condition) {
    // keep compatibility with previous version
    if (args.returnTxInfo) {
      return commitToConditionalOffer({
        ...args,
        returnTxInfo: true,
        tokenId: offer.condition.minTokenId
      });
    }
    return commitToConditionalOffer({
      ...args,
      returnTxInfo: false,
      tokenId: offer.condition.minTokenId
    });
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

  const transactionRequest = {
    from: args.buyer,
    to: args.contractAddress,
    data: encodeCommitToOffer(args.buyer, args.offerId),
    value: offer.exchangeToken.address === AddressZero ? offer.price : "0"
  } satisfies TransactionRequest;

  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

// Overload: returnTxInfo is true → returns TransactionRequest
export async function commitToConditionalOffer(
  args: BaseExchangeHandlerArgs & {
    buyer: string;
    offerId: BigNumberish;
    tokenId: BigNumberish;
    returnTxInfo: true;
  }
): Promise<TransactionRequest>;

// Overload: returnTxInfo is false or undefined → returns TransactionResponse
export async function commitToConditionalOffer(
  args: BaseExchangeHandlerArgs & {
    buyer: string;
    offerId: BigNumberish;
    tokenId: BigNumberish;
    returnTxInfo?: false | undefined;
  }
): Promise<TransactionResponse>;

// Implementation
export async function commitToConditionalOffer(
  args: BaseExchangeHandlerArgs & {
    buyer: string;
    offerId: BigNumberish;
    tokenId: BigNumberish;
    returnTxInfo?: boolean;
  }
): Promise<TransactionRequest | TransactionResponse> {
  const offer = await getOfferById(args.subgraphUrl, args.offerId);

  await checkOfferIsCommittable(args.offerId, offer);

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

  const transactionRequest = {
    from: args.buyer,
    to: args.contractAddress,
    data: encodeCommitToConditionalOffer(
      args.buyer,
      args.offerId,
      args.tokenId
    ),
    value: offer.exchangeToken.address === AddressZero ? offer.price : "0"
  } satisfies TransactionRequest;

  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

// Overload: returnTxInfo is true → returns TransactionRequest
export async function createOfferAndCommit(args: {
  createOfferAndCommitArgs: CreateOfferAndCommitArgs;
  returnTxInfo: true;
  subgraphUrl: string;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  txRequest?: TransactionRequest;
  metadataStorage?: MetadataStorage;
  theGraphStorage?: MetadataStorage;
}): Promise<TransactionRequest>;

// Overload: returnTxInfo is false or undefined → returns TransactionResponse
export async function createOfferAndCommit(args: {
  createOfferAndCommitArgs: CreateOfferAndCommitArgs;
  returnTxInfo?: false | undefined;
  subgraphUrl: string;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  txRequest?: TransactionRequest;
  metadataStorage?: MetadataStorage;
  theGraphStorage?: MetadataStorage;
}): Promise<TransactionResponse>;

// Implementation
export async function createOfferAndCommit(args: {
  createOfferAndCommitArgs: CreateOfferAndCommitArgs;
  returnTxInfo?: boolean;
  subgraphUrl: string;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  txRequest?: TransactionRequest;
  metadataStorage?: MetadataStorage;
  theGraphStorage?: MetadataStorage;
}): Promise<TransactionRequest | TransactionResponse> {
  try {
    utils.validation.createOfferAndCommitArgsSchema.validateSync(
      args.createOfferAndCommitArgs,
      {
        abortEarly: false
      }
    );
  } catch (error) {
    console.error("error", error);
    throw error;
  }

  const { disputeResolverId, exchangeToken } = args.createOfferAndCommitArgs;
  const disputeResolver = await getDisputeResolverById(
    args.subgraphUrl,
    disputeResolverId
  );
  if (!disputeResolver) {
    throw new Error(
      `Dispute resolver with id "${disputeResolverId}" does not exist`
    );
  }
  if (
    !disputeResolver.fees.some(
      (fee) => fee.token.address.toLowerCase() === exchangeToken.toLowerCase()
    )
  ) {
    throw new Error(
      `Dispute resolver with id "${disputeResolverId}" does not support exchange token "${exchangeToken}"`
    );
  }

  await storeMetadataOnTheGraph({
    metadataUriOrHash: args.createOfferAndCommitArgs.metadataUri,
    metadataStorage: args.metadataStorage,
    theGraphStorage: args.theGraphStorage
  });

  await storeMetadataItems({
    ...args,
    createOffersArgs: [args.createOfferAndCommitArgs]
  });

  const transactionRequest = {
    ...args.txRequest,
    to: args.contractAddress,
    data: encodeCreateOfferAndCommit(args.createOfferAndCommitArgs)
  } satisfies TransactionRequest;

  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    const txResponse = await args.web3Lib.sendTransaction(transactionRequest);
    return txResponse;
  }
}

// Overload: returnTxInfo is true → returns TransactionRequest
export async function completeExchange(
  args: BaseExchangeHandlerArgs & {
    exchangeId: BigNumberish;
    returnTxInfo: true;
  }
): Promise<TransactionRequest>;

// Overload: returnTxInfo is false or undefined → returns TransactionResponse
export async function completeExchange(
  args: BaseExchangeHandlerArgs & {
    exchangeId: BigNumberish;
    returnTxInfo?: false | undefined;
  }
): Promise<TransactionResponse>;

// Implementation
export async function completeExchange(
  args: BaseExchangeHandlerArgs & {
    exchangeId: BigNumberish;
    returnTxInfo?: boolean;
  }
): Promise<TransactionRequest | TransactionResponse> {
  const [exchange, signerAddress] = await Promise.all([
    getExchangeById(args.subgraphUrl, args.exchangeId),
    args.web3Lib.getSignerAddress()
  ]);

  await assertCompletableExchange(
    args.exchangeId,
    exchange,
    signerAddress,
    args.web3Lib
  );

  const transactionRequest = {
    to: args.contractAddress,
    data: encodeCompleteExchange(args.exchangeId)
  } satisfies TransactionRequest;

  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

// Overload: returnTxInfo is true → returns TransactionRequest
export async function completeExchangeBatch(
  args: BaseExchangeHandlerArgs & {
    exchangeIds: BigNumberish[];
    returnTxInfo: true;
  }
): Promise<TransactionRequest>;

// Overload: returnTxInfo is false or undefined → returns TransactionResponse
export async function completeExchangeBatch(
  args: BaseExchangeHandlerArgs & {
    exchangeIds: BigNumberish[];
    returnTxInfo?: false | undefined;
  }
): Promise<TransactionResponse>;

// Implementation
export async function completeExchangeBatch(
  args: BaseExchangeHandlerArgs & {
    exchangeIds: BigNumberish[];
    returnTxInfo?: boolean;
  }
): Promise<TransactionRequest | TransactionResponse> {
  const [exchanges, signerAddress] = await Promise.all([
    getExchanges(args.subgraphUrl, {
      exchangesFilter: { id_in: args.exchangeIds.map((id) => id.toString()) }
    }),
    args.web3Lib.getSignerAddress()
  ]);

  for (const exchange of exchanges) {
    await assertCompletableExchange(
      exchange.id,
      exchange,
      signerAddress,
      args.web3Lib
    );
  }

  const transactionRequest = {
    to: args.contractAddress,
    data: encodeCompleteExchangeBatch(args.exchangeIds)
  } satisfies TransactionRequest;

  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

// Overload: returnTxInfo is true → returns TransactionRequest
export async function revokeVoucher(
  args: BaseExchangeHandlerArgs & {
    exchangeId: BigNumberish;
    returnTxInfo: true;
  }
): Promise<TransactionRequest>;

// Overload: returnTxInfo is false or undefined → returns TransactionResponse
export async function revokeVoucher(
  args: BaseExchangeHandlerArgs & {
    exchangeId: BigNumberish;
    returnTxInfo?: false | undefined;
  }
): Promise<TransactionResponse>;

// Implementation
export async function revokeVoucher(
  args: BaseExchangeHandlerArgs & {
    exchangeId: BigNumberish;
    returnTxInfo?: boolean;
  }
): Promise<TransactionRequest | TransactionResponse> {
  const [exchange, signerAddress] = await Promise.all([
    getExchangeById(args.subgraphUrl, args.exchangeId),
    args.web3Lib.getSignerAddress()
  ]);

  assertExchange(args.exchangeId, exchange);
  assertExchangeState(exchange, ExchangeState.COMMITTED);
  assertSignerIsAssistant(signerAddress, exchange);

  const transactionRequest = {
    to: args.contractAddress,
    data: encodeRevokeVoucher(args.exchangeId)
  } satisfies TransactionRequest;

  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

// Overload: returnTxInfo is true → returns TransactionRequest
export async function cancelVoucher(
  args: BaseExchangeHandlerArgs & {
    exchangeId: BigNumberish;
    returnTxInfo: true;
  }
): Promise<TransactionRequest>;

// Overload: returnTxInfo is false or undefined → returns TransactionResponse
export async function cancelVoucher(
  args: BaseExchangeHandlerArgs & {
    exchangeId: BigNumberish;
    returnTxInfo?: false | undefined;
  }
): Promise<TransactionResponse>;

// Implementation
export async function cancelVoucher(
  args: BaseExchangeHandlerArgs & {
    exchangeId: BigNumberish;
    returnTxInfo?: boolean;
  }
): Promise<TransactionRequest | TransactionResponse> {
  const [exchange, signerAddress] = await Promise.all([
    getExchangeById(args.subgraphUrl, args.exchangeId),
    args.web3Lib.getSignerAddress()
  ]);

  assertExchange(args.exchangeId, exchange);
  assertExchangeState(exchange, ExchangeState.COMMITTED);
  assertSignerIsBuyer(signerAddress, exchange);

  const transactionRequest = {
    to: args.contractAddress,
    data: encodeCancelVoucher(args.exchangeId)
  } satisfies TransactionRequest;

  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

// Overload: returnTxInfo is true → returns TransactionRequest
export async function expireVoucher(
  args: BaseExchangeHandlerArgs & {
    exchangeId: BigNumberish;
    returnTxInfo: true;
  }
): Promise<TransactionRequest>;

// Overload: returnTxInfo is false or undefined → returns TransactionResponse
export async function expireVoucher(
  args: BaseExchangeHandlerArgs & {
    exchangeId: BigNumberish;
    returnTxInfo?: false | undefined;
  }
): Promise<TransactionResponse>;

// Implementation
export async function expireVoucher(
  args: BaseExchangeHandlerArgs & {
    exchangeId: BigNumberish;
    returnTxInfo?: boolean;
  }
): Promise<TransactionRequest | TransactionResponse> {
  const exchange = await getExchangeById(args.subgraphUrl, args.exchangeId);

  assertExchange(args.exchangeId, exchange);

  if (Date.now() < Number(exchange.validUntilDate) * 1000) {
    throw new Error(`Voucher is still valid`);
  }

  const transactionRequest = {
    to: args.contractAddress,
    data: encodeExpireVoucher(args.exchangeId)
  } satisfies TransactionRequest;

  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

// Overload: returnTxInfo is true → returns TransactionRequest
export async function redeemVoucher(
  args: BaseExchangeHandlerArgs & {
    exchangeId: BigNumberish;
    returnTxInfo: true;
  }
): Promise<TransactionRequest>;

// Overload: returnTxInfo is false or undefined → returns TransactionResponse
export async function redeemVoucher(
  args: BaseExchangeHandlerArgs & {
    exchangeId: BigNumberish;
    returnTxInfo?: false | undefined;
  }
): Promise<TransactionResponse>;

// Implementation
export async function redeemVoucher(
  args: BaseExchangeHandlerArgs & {
    exchangeId: BigNumberish;
    returnTxInfo?: boolean;
  }
): Promise<TransactionRequest | TransactionResponse> {
  const [exchange, signerAddress] = await Promise.all([
    getExchangeById(args.subgraphUrl, args.exchangeId),
    args.web3Lib.getSignerAddress()
  ]);

  assertExchange(args.exchangeId, exchange);
  assertExchangeState(exchange, ExchangeState.COMMITTED);
  assertSignerIsBuyer(signerAddress, exchange);

  if (Date.now() < Number(exchange.offer.voucherRedeemableFromDate) * 1000) {
    throw new Error(`Voucher not redeemable yet`);
  }

  if (Date.now() > Number(exchange.validUntilDate) * 1000) {
    throw new Error(`Voucher can not be redeemed anymore`);
  }

  const transactionRequest = {
    to: args.contractAddress,
    data: encodeRedeemVoucher(args.exchangeId)
  } satisfies TransactionRequest;

  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
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

function assertSignerIsAssistant(
  signer: string,
  exchange: ExchangeFieldsFragment
) {
  if (exchange.seller.assistant.toLowerCase() !== signer.toLowerCase()) {
    throw new Error(
      `Signer ${signer} is not the assistant ${exchange.seller.assistant}`
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

function assertSignerIsBuyerOrAssistant(
  signer: string,
  exchange: ExchangeFieldsFragment
) {
  const { seller, buyer } = exchange;
  const buyerAddress = buyer.wallet;
  const assistantAddress = seller.assistant;
  const isSignerAssistant =
    signer.toLowerCase() === assistantAddress.toLowerCase();
  const isSignerBuyer = signer.toLowerCase() === buyerAddress.toLowerCase();

  if (!isSignerAssistant && !isSignerBuyer) {
    throw new Error(
      `Signer ${signer} is required to be the buyer ${buyerAddress} or assistant ${assistantAddress}`
    );
  }

  return { isSignerBuyer, isSignerAssistant };
}

async function assertCompletableExchange(
  exchangeId: BigNumberish,
  exchange: ExchangeFieldsFragment | null,
  signer: string,
  web3Lib: Web3LibAdapter
) {
  assertExchange(exchangeId, exchange);

  const { isSignerAssistant, isSignerBuyer } = assertSignerIsBuyerOrAssistant(
    signer,
    exchange
  );

  if (isSignerAssistant && !isSignerBuyer) {
    const now = await web3Lib.getCurrentTimeMs();
    const elapsedSinceRedeemMS =
      now - Number(exchange.redeemedDate || "0") * 1000;
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

export function getExchangeTokenId(
  exchangeId: BigNumberish,
  offerId: BigNumberish
): BigNumber {
  // Since v2.2.1, tokenId = exchangeId | offerId << 128
  return BigNumber.from(offerId).shl(128).add(exchangeId);
}

export function parseTokenId(tokenId: BigNumberish): {
  offerId: BigNumber;
  exchangeId: BigNumber;
} {
  const offerId = BigNumber.from(tokenId).shr(128);
  const exchangeId = BigNumber.from(tokenId).mask(128);
  return { offerId, exchangeId };
}
