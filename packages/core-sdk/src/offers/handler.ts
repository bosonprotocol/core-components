import { BigNumberish } from "@ethersproject/bignumber";
import {
  Web3LibAdapter,
  TransactionResponse,
  MetadataStorage,
  utils,
  RoyaltyInfo,
  TransactionRequest,
  FullOfferArgs,
  OfferCreator
} from "@bosonprotocol/common";
import {
  bosonOfferHandlerIface,
  decodeGetOfferHash,
  encodeCreateOffer,
  encodeCreateOfferBatch,
  encodeGetOfferHash,
  encodeReserveRange,
  encodeUpdateOfferRoyaltyRecipients,
  encodeUpdateOfferRoyaltyRecipientsBatch,
  encodeVoidNonListedOffer,
  encodeVoidNonListedOfferBatch
} from "./interface";
import { getOfferById, getOffers } from "./subgraph";
import { storeMetadataOnTheGraph } from "./storage";
import { CreateOfferArgs } from "./types";
import { OfferFieldsFragment } from "../subgraph";
import { storeMetadataItems } from "../metadata/storeMetadataItems";
import { getDisputeResolverById } from "../accounts/subgraph";

// Overload: returnTxInfo is true → returns TransactionRequest
export async function createOffer(args: {
  offerToCreate: CreateOfferArgs;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  subgraphUrl: string;
  metadataStorage?: MetadataStorage;
  theGraphStorage?: MetadataStorage;
  txRequest?: TransactionRequest;
  returnTxInfo: true;
}): Promise<TransactionRequest>;

// Overload: returnTxInfo is false or undefined → returns TransactionResponse
export async function createOffer(args: {
  offerToCreate: CreateOfferArgs;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  subgraphUrl: string;
  metadataStorage?: MetadataStorage;
  theGraphStorage?: MetadataStorage;
  txRequest?: TransactionRequest;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;

// Implementation
export async function createOffer(args: {
  offerToCreate: CreateOfferArgs;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  subgraphUrl: string;
  metadataStorage?: MetadataStorage;
  theGraphStorage?: MetadataStorage;
  txRequest?: TransactionRequest;
  returnTxInfo?: boolean;
}): Promise<TransactionRequest | TransactionResponse> {
  utils.validation.createOfferArgsSchema.validateSync(args.offerToCreate, {
    abortEarly: false
  });

  const { disputeResolverId, exchangeToken } = args.offerToCreate;
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
    metadataUriOrHash: args.offerToCreate.metadataUri,
    metadataStorage: args.metadataStorage,
    theGraphStorage: args.theGraphStorage
  });

  await storeMetadataItems({
    ...args,
    createOffersArgs: [args.offerToCreate]
  });

  const transactionRequest = {
    ...args.txRequest,
    to: args.contractAddress,
    data: encodeCreateOffer(args.offerToCreate)
  } satisfies TransactionRequest;

  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    const txResponse = await args.web3Lib.sendTransaction(transactionRequest);
    return txResponse;
  }
}

// Overload: returnTxInfo is true → returns TransactionRequest
export async function createOfferBatch(args: {
  offersToCreate: CreateOfferArgs[];
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  metadataStorage?: MetadataStorage;
  theGraphStorage?: MetadataStorage;
  returnTxInfo: true;
}): Promise<TransactionRequest>;

// Overload: returnTxInfo is false or undefined → returns TransactionResponse
export async function createOfferBatch(args: {
  offersToCreate: CreateOfferArgs[];
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  metadataStorage?: MetadataStorage;
  theGraphStorage?: MetadataStorage;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;

// Implementation
export async function createOfferBatch(args: {
  offersToCreate: CreateOfferArgs[];
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  metadataStorage?: MetadataStorage;
  theGraphStorage?: MetadataStorage;
  returnTxInfo?: boolean;
}): Promise<TransactionRequest | TransactionResponse> {
  for (const offerToCreate of args.offersToCreate) {
    utils.validation.createOfferArgsSchema.validateSync(offerToCreate, {
      abortEarly: false
    });
  }

  await Promise.all(
    args.offersToCreate.map((offerToCreate) =>
      storeMetadataOnTheGraph({
        metadataUriOrHash: offerToCreate.metadataUri,
        metadataStorage: args.metadataStorage,
        theGraphStorage: args.theGraphStorage
      })
    )
  );

  await storeMetadataItems({
    ...args,
    createOffersArgs: args.offersToCreate
  });

  const transactionRequest = {
    to: args.contractAddress,
    data: encodeCreateOfferBatch(args.offersToCreate)
  } satisfies TransactionRequest;

  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

// Overload: returnTxInfo is true → returns TransactionRequest
export async function reserveRange(args: {
  contractAddress: string;
  subgraphUrl: string;
  offerId: BigNumberish;
  length: BigNumberish;
  to: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo: true;
}): Promise<TransactionRequest>;

// Overload: returnTxInfo is false or undefined → returns TransactionResponse
export async function reserveRange(args: {
  contractAddress: string;
  subgraphUrl: string;
  offerId: BigNumberish;
  length: BigNumberish;
  to: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;

// Implementation
export async function reserveRange(args: {
  contractAddress: string;
  subgraphUrl: string;
  offerId: BigNumberish;
  length: BigNumberish;
  to: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: boolean;
}): Promise<TransactionRequest | TransactionResponse> {
  const offerFromSubgraph = await getOfferById(args.subgraphUrl, args.offerId);
  const signerAddress = await args.web3Lib.getSignerAddress();

  checkIfOfferReservable(
    args.offerId,
    args.length,
    signerAddress,
    offerFromSubgraph
  );

  const transactionRequest = {
    to: args.contractAddress,
    data: encodeReserveRange(args.offerId, args.length, args.to)
  } satisfies TransactionRequest;

  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

// Overload: returnTxInfo is true → returns TransactionRequest
export async function voidOffer(args: {
  contractAddress: string;
  subgraphUrl: string;
  offerId: BigNumberish;
  web3Lib: Web3LibAdapter;
  returnTxInfo: true;
}): Promise<TransactionRequest>;

// Overload: returnTxInfo is false or undefined → returns TransactionResponse
export async function voidOffer(args: {
  contractAddress: string;
  subgraphUrl: string;
  offerId: BigNumberish;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;

// Implementation
export async function voidOffer(args: {
  contractAddress: string;
  subgraphUrl: string;
  offerId: BigNumberish;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: boolean;
}): Promise<TransactionRequest | TransactionResponse> {
  const offerFromSubgraph = await getOfferById(args.subgraphUrl, args.offerId);
  const signerAddress = await args.web3Lib.getSignerAddress();

  checkIfOfferVoidable(args.offerId, signerAddress, offerFromSubgraph);

  const transactionRequest = {
    to: args.contractAddress,
    data: bosonOfferHandlerIface.encodeFunctionData("voidOffer", [args.offerId])
  } satisfies TransactionRequest;

  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

// Overload: returnTxInfo is true → returns TransactionRequest
export async function voidOfferBatch(args: {
  contractAddress: string;
  subgraphUrl: string;
  offerIds: BigNumberish[];
  web3Lib: Web3LibAdapter;
  returnTxInfo: true;
}): Promise<TransactionRequest>;

// Overload: returnTxInfo is false or undefined → returns TransactionResponse
export async function voidOfferBatch(args: {
  contractAddress: string;
  subgraphUrl: string;
  offerIds: BigNumberish[];
  web3Lib: Web3LibAdapter;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;

// Implementation
export async function voidOfferBatch(args: {
  contractAddress: string;
  subgraphUrl: string;
  offerIds: BigNumberish[];
  web3Lib: Web3LibAdapter;
  returnTxInfo?: boolean;
}): Promise<TransactionRequest | TransactionResponse> {
  const offersFromSubgraph = await getOffers(args.subgraphUrl, {
    offersFilter: {
      id_in: args.offerIds.map(String)
    }
  });
  const signerAddress = await args.web3Lib.getSignerAddress();

  const invalidOfferIdErrors = [];
  for (const offerId of args.offerIds) {
    const offerFromSubgraph = offersFromSubgraph.find(
      (offer) => offer.id === offerId.toString()
    );
    try {
      checkIfOfferVoidable(offerId, signerAddress, offerFromSubgraph);
    } catch (error) {
      invalidOfferIdErrors.push(error);
    }
  }

  if (invalidOfferIdErrors.length) {
    throw new Error(`Some offers can not be voided. ${invalidOfferIdErrors}`);
  }

  const transactionRequest = {
    to: args.contractAddress,
    data: bosonOfferHandlerIface.encodeFunctionData("voidOfferBatch", [
      args.offerIds
    ])
  } satisfies TransactionRequest;

  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

// Overload: returnTxInfo is true → returns TransactionRequest
export async function voidNonListedOffer(args: {
  contractAddress: string;
  subgraphUrl: string;
  fullOffer: Omit<
    FullOfferArgs,
    | "offerCreator"
    | "committer"
    | "signature"
    | "conditionalTokenId"
    | "sellerOfferParams"
  >;
  web3Lib: Web3LibAdapter;
  returnTxInfo: true;
}): Promise<TransactionRequest>;

// Overload: returnTxInfo is false or undefined → returns TransactionResponse
export async function voidNonListedOffer(args: {
  contractAddress: string;
  subgraphUrl: string;
  fullOffer: Omit<
    FullOfferArgs,
    | "offerCreator"
    | "committer"
    | "signature"
    | "conditionalTokenId"
    | "sellerOfferParams"
  >;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;

// Implementation
export async function voidNonListedOffer(args: {
  contractAddress: string;
  subgraphUrl: string;
  fullOffer: Omit<
    FullOfferArgs,
    | "offerCreator"
    | "committer"
    | "signature"
    | "conditionalTokenId"
    | "sellerOfferParams"
  >;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: boolean;
}): Promise<TransactionRequest | TransactionResponse> {
  const transactionRequest = {
    to: args.contractAddress,
    data: encodeVoidNonListedOffer(args.fullOffer)
  } satisfies TransactionRequest;

  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

// Overload: returnTxInfo is true → returns TransactionRequest
export async function voidNonListedOfferBatch(args: {
  contractAddress: string;
  subgraphUrl: string;
  fullOffers: Omit<
    FullOfferArgs,
    | "offerCreator"
    | "committer"
    | "signature"
    | "conditionalTokenId"
    | "sellerOfferParams"
  >[];
  web3Lib: Web3LibAdapter;
  returnTxInfo: true;
}): Promise<TransactionRequest>;

// Overload: returnTxInfo is false or undefined → returns TransactionResponse
export async function voidNonListedOfferBatch(args: {
  contractAddress: string;
  subgraphUrl: string;
  fullOffers: Omit<
    FullOfferArgs,
    | "offerCreator"
    | "committer"
    | "signature"
    | "conditionalTokenId"
    | "sellerOfferParams"
  >[];
  web3Lib: Web3LibAdapter;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;

// Implementation
export async function voidNonListedOfferBatch(args: {
  contractAddress: string;
  subgraphUrl: string;
  fullOffers: Omit<
    FullOfferArgs,
    | "offerCreator"
    | "committer"
    | "signature"
    | "conditionalTokenId"
    | "sellerOfferParams"
  >[];
  web3Lib: Web3LibAdapter;
  returnTxInfo?: boolean;
}): Promise<TransactionRequest | TransactionResponse> {
  const transactionRequest = {
    to: args.contractAddress,
    data: encodeVoidNonListedOfferBatch(args.fullOffers)
  } satisfies TransactionRequest;

  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

// Overload: returnTxInfo is true → returns TransactionRequest
export async function extendOffer(args: {
  contractAddress: string;
  subgraphUrl: string;
  offerId: BigNumberish;
  validUntil: BigNumberish;
  web3Lib: Web3LibAdapter;
  returnTxInfo: true;
}): Promise<TransactionRequest>;

// Overload: returnTxInfo is false or undefined → returns TransactionResponse
export async function extendOffer(args: {
  contractAddress: string;
  subgraphUrl: string;
  offerId: BigNumberish;
  validUntil: BigNumberish;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;

// Implementation
export async function extendOffer(args: {
  contractAddress: string;
  subgraphUrl: string;
  offerId: BigNumberish;
  validUntil: BigNumberish;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: boolean;
}): Promise<TransactionRequest | TransactionResponse> {
  const transactionRequest = {
    to: args.contractAddress,
    data: bosonOfferHandlerIface.encodeFunctionData("extendOffer", [
      args.offerId,
      args.validUntil
    ])
  } satisfies TransactionRequest;

  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

// Overload: returnTxInfo is true → returns TransactionRequest
export async function extendOfferBatch(args: {
  contractAddress: string;
  subgraphUrl: string;
  offerIds: BigNumberish[];
  validUntil: BigNumberish;
  web3Lib: Web3LibAdapter;
  returnTxInfo: true;
}): Promise<TransactionRequest>;

// Overload: returnTxInfo is false or undefined → returns TransactionResponse
export async function extendOfferBatch(args: {
  contractAddress: string;
  subgraphUrl: string;
  offerIds: BigNumberish[];
  validUntil: BigNumberish;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;

// Implementation
export async function extendOfferBatch(args: {
  contractAddress: string;
  subgraphUrl: string;
  offerIds: BigNumberish[];
  validUntil: BigNumberish;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: boolean;
}): Promise<TransactionRequest | TransactionResponse> {
  const transactionRequest = {
    to: args.contractAddress,
    data: bosonOfferHandlerIface.encodeFunctionData("extendOfferBatch", [
      args.offerIds,
      args.validUntil
    ])
  } satisfies TransactionRequest;

  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

// Overload: returnTxInfo is true → returns TransactionRequest
export async function updateOfferRoyaltyRecipients(args: {
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  offerId: BigNumberish;
  royaltyInfo: RoyaltyInfo;
  returnTxInfo: true;
}): Promise<TransactionRequest>;

// Overload: returnTxInfo is false or undefined → returns TransactionResponse
export async function updateOfferRoyaltyRecipients(args: {
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  offerId: BigNumberish;
  royaltyInfo: RoyaltyInfo;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;

// Implementation
export async function updateOfferRoyaltyRecipients(args: {
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  offerId: BigNumberish;
  royaltyInfo: RoyaltyInfo;
  returnTxInfo?: boolean;
}): Promise<TransactionRequest | TransactionResponse> {
  const transactionRequest = {
    to: args.contractAddress,
    data: encodeUpdateOfferRoyaltyRecipients(args)
  } satisfies TransactionRequest;

  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

// Overload: returnTxInfo is true → returns TransactionRequest
export async function updateOfferRoyaltyRecipientsBatch(args: {
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  offerIds: BigNumberish[];
  royaltyInfo: RoyaltyInfo;
  returnTxInfo: true;
}): Promise<TransactionRequest>;

// Overload: returnTxInfo is false or undefined → returns TransactionResponse
export async function updateOfferRoyaltyRecipientsBatch(args: {
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  offerIds: BigNumberish[];
  royaltyInfo: RoyaltyInfo;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;

// Implementation
export async function updateOfferRoyaltyRecipientsBatch(args: {
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  offerIds: BigNumberish[];
  royaltyInfo: RoyaltyInfo;
  returnTxInfo?: boolean;
}): Promise<TransactionRequest | TransactionResponse> {
  const transactionRequest = {
    to: args.contractAddress,
    data: encodeUpdateOfferRoyaltyRecipientsBatch(args)
  } satisfies TransactionRequest;

  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

function checkIfOfferVoidable(
  offerId: BigNumberish,
  signerAddress: string,
  offerFromSubgraph?: OfferFieldsFragment
) {
  if (!offerFromSubgraph) {
    throw new Error(`Offer with id "${offerId}" does not exist`);
  }

  if (offerFromSubgraph.voidedAt) {
    throw new Error(`Offer with id "${offerId}" is already voided`);
  }

  if (
    offerFromSubgraph.creator === OfferCreator.Seller &&
    offerFromSubgraph.seller.assistant.toLowerCase() !==
      signerAddress.toLowerCase()
  ) {
    throw new Error(
      `Signer with address "${signerAddress}" is not the assistant "${offerFromSubgraph.seller.assistant}" of offer with id "${offerId}"`
    );
  }

  if (
    offerFromSubgraph.creator === OfferCreator.Buyer &&
    offerFromSubgraph.buyer?.wallet.toLowerCase() !==
      signerAddress.toLowerCase()
  ) {
    throw new Error(
      `Signer with address "${signerAddress}" is not the creator's wallet "${offerFromSubgraph.buyer?.wallet}" of offer with id "${offerId}"`
    );
  }
}

function checkIfOfferReservable(
  offerId: BigNumberish,
  length: BigNumberish,
  signerAddress: string,
  offerFromSubgraph?: OfferFieldsFragment
) {
  checkIfOfferVoidable(offerId, signerAddress, offerFromSubgraph);

  if (!length) {
    throw new Error(`Range length is zero`);
  }

  if (offerFromSubgraph.quantityAvailable < length) {
    throw new Error(`Range length is too large`);
  }
}

export async function getOfferHash(args: {
  fullOfferArgsUnsigned: Omit<FullOfferArgs, "signature">;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
}): Promise<string> {
  const result = await args.web3Lib.call({
    to: args.contractAddress,
    data: encodeGetOfferHash(args.fullOfferArgsUnsigned)
  });
  return decodeGetOfferHash(result);
}
