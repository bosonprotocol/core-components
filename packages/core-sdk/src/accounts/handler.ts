import {
  Web3LibAdapter,
  TransactionResponse,
  TransactionRequest,
  utils,
  MetadataStorage
} from "@bosonprotocol/common";
import { BigNumberish } from "@ethersproject/bignumber";
import { formatBytes32String } from "@ethersproject/strings";
import { DisputeResolverFieldsFragment } from "../subgraph";
import {
  encodeCreateSeller,
  encodeUpdateSeller,
  encodeCreateDisputeResolver,
  encodeAddFeesToDisputeResolver,
  encodeAddSellersToAllowList,
  encodeRemoveFeesFromDisputeResolver,
  encodeRemoveSellersFromAllowList,
  encodeUpdateDisputeResolver,
  encodeOptInToSellerUpdate,
  encodeOptInToDisputeResolverUpdate,
  encodeCreateNewCollection,
  encodeIsSellerSaltAvailable,
  decodeIsSellerSaltAvailable,
  encodeCalculateCollectionAddress,
  decodeCalculateCollectionAddress,
  encodeAddRoyaltyRecipients,
  encodeUpdateRoyaltyRecipients,
  encodeGetRoyaltyRecipients,
  decodeGetRoyaltyRecipients,
  encodeRemoveRoyaltyRecipients
} from "./interface";
import { getDisputeResolverById } from "./subgraph";
import {
  CreateSellerArgs,
  UpdateSellerArgs,
  CreateDisputeResolverArgs,
  DisputeResolutionFee,
  DisputeResolverUpdates,
  OptInToSellerUpdateArgs,
  OptInToDisputeResolverUpdateArgs,
  CreateCollectionArgs,
  RoyaltyRecipientInfo
} from "./types";
import { storeMetadataOnTheGraph } from "../offers/storage";

export const INITIAL_COLLECTION_ID = "initial";

export async function findCollectionSalt(args: {
  sellerToCreate: CreateSellerArgs;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
}): Promise<string> {
  // collectionSalt is added to the seller admin address to give the sellerSalt that is used to compute the voucher contract address
  // The seller creation will fail in case sellerSalt already exists
  // This may happen if the admin address was already assigned to another seller in the past
  // In that case, we add a random suffix on the collectionId to generate a different salt
  let collectionSalt = formatBytes32String(INITIAL_COLLECTION_ID);
  const isAvailable = await isSellerSaltAvailable({
    adminAddress: args.sellerToCreate.admin,
    salt: collectionSalt,
    contractAddress: args.contractAddress,
    web3Lib: args.web3Lib
  });
  if (!isAvailable) {
    const uuid = Math.floor(Math.random() * 100000000).toFixed(0);
    collectionSalt = formatBytes32String(
      `${INITIAL_COLLECTION_ID}-${uuid}`.slice(0, 31)
    );
  }
  return collectionSalt;
}

// Overload: returnTxInfo is true → returns TransactionRequest
export async function createSeller(args: {
  sellerToCreate: CreateSellerArgs;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  metadataStorage?: MetadataStorage;
  theGraphStorage?: MetadataStorage;
  returnTxInfo: true;
}): Promise<TransactionRequest>;
// Overload: returnTxInfo is false or undefined → returns TransactionResponse
export async function createSeller(args: {
  sellerToCreate: CreateSellerArgs;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  metadataStorage?: MetadataStorage;
  theGraphStorage?: MetadataStorage;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;
// Implementation
export async function createSeller(args: {
  sellerToCreate: CreateSellerArgs;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  metadataStorage?: MetadataStorage;
  theGraphStorage?: MetadataStorage;
  returnTxInfo?: boolean;
}): Promise<TransactionResponse | TransactionRequest> {
  const collectionSalt = await findCollectionSalt(args);
  await Promise.all(
    [args.sellerToCreate.contractUri, args.sellerToCreate.metadataUri].map(
      (metadataUri) =>
        storeMetadataOnTheGraph({
          metadataUriOrHash: metadataUri,
          metadataStorage: args.metadataStorage,
          theGraphStorage: args.theGraphStorage
        })
    )
  );
  const transactionRequest = {
    to: args.contractAddress,
    data: encodeCreateSeller(args.sellerToCreate, collectionSalt)
  } satisfies TransactionRequest;
  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

// Overload: returnTxInfo is true → returns TransactionRequest
export async function updateSeller(args: {
  sellerUpdates: UpdateSellerArgs;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  metadataStorage: MetadataStorage;
  theGraphStorage: MetadataStorage;
  returnTxInfo: true;
}): Promise<TransactionRequest>;
// Overload: returnTxInfo is false or undefined → returns TransactionResponse
export async function updateSeller(args: {
  sellerUpdates: UpdateSellerArgs;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  metadataStorage: MetadataStorage;
  theGraphStorage: MetadataStorage;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;
// Implementation
export async function updateSeller(args: {
  sellerUpdates: UpdateSellerArgs;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  metadataStorage: MetadataStorage;
  theGraphStorage: MetadataStorage;
  returnTxInfo?: boolean;
}): Promise<TransactionResponse | TransactionRequest> {
  await storeMetadataOnTheGraph({
    metadataUriOrHash: args.sellerUpdates.metadataUri,
    metadataStorage: args.metadataStorage,
    theGraphStorage: args.theGraphStorage
  });
  const transactionRequest = {
    to: args.contractAddress,
    data: encodeUpdateSeller(args.sellerUpdates)
  } satisfies TransactionRequest;
  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

// Overload: returnTxInfo is true → returns TransactionRequest
export async function optInToSellerUpdate(args: {
  sellerUpdates: OptInToSellerUpdateArgs;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo: true;
}): Promise<TransactionRequest>;
// Overload: returnTxInfo is false or undefined → returns TransactionResponse
export async function optInToSellerUpdate(args: {
  sellerUpdates: OptInToSellerUpdateArgs;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;
// Implementation
export async function optInToSellerUpdate(args: {
  sellerUpdates: OptInToSellerUpdateArgs;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: boolean;
}): Promise<TransactionResponse | TransactionRequest> {
  const transactionRequest = {
    to: args.contractAddress,
    data: encodeOptInToSellerUpdate(args.sellerUpdates)
  } satisfies TransactionRequest;
  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

// Overload: returnTxInfo is true → returns TransactionRequest
export async function createDisputeResolver(args: {
  disputeResolverToCreate: CreateDisputeResolverArgs;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo: true;
}): Promise<TransactionRequest>;
// Overload: returnTxInfo is false or undefined → returns TransactionResponse
export async function createDisputeResolver(args: {
  disputeResolverToCreate: CreateDisputeResolverArgs;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;
// Implementation
export async function createDisputeResolver(args: {
  disputeResolverToCreate: CreateDisputeResolverArgs;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: boolean;
}): Promise<TransactionResponse | TransactionRequest> {
  // TODO: validate metadata
  // disputeResolverToCreate.metadataUri

  const transactionRequest = {
    to: args.contractAddress,
    data: encodeCreateDisputeResolver(args.disputeResolverToCreate)
  } satisfies TransactionRequest;
  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

// Overload: returnTxInfo is true → returns TransactionRequest
export async function addFeesToDisputeResolver(args: {
  disputeResolverId: BigNumberish;
  fees: DisputeResolutionFee[];
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo: true;
}): Promise<TransactionRequest>;
// Overload: returnTxInfo is false or undefined → returns TransactionResponse
export async function addFeesToDisputeResolver(args: {
  disputeResolverId: BigNumberish;
  fees: DisputeResolutionFee[];
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;
// Implementation
export async function addFeesToDisputeResolver(args: {
  disputeResolverId: BigNumberish;
  fees: DisputeResolutionFee[];
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: boolean;
}): Promise<TransactionResponse | TransactionRequest> {
  const transactionRequest = {
    to: args.contractAddress,
    data: encodeAddFeesToDisputeResolver(args)
  } satisfies TransactionRequest;
  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

// Overload: returnTxInfo is true → returns TransactionRequest
export async function addSellersToAllowList(args: {
  disputeResolverId: BigNumberish;
  sellerAllowList: BigNumberish[];
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo: true;
}): Promise<TransactionRequest>;
// Overload: returnTxInfo is false or undefined → returns TransactionResponse
export async function addSellersToAllowList(args: {
  disputeResolverId: BigNumberish;
  sellerAllowList: BigNumberish[];
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;
// Implementation
export async function addSellersToAllowList(args: {
  disputeResolverId: BigNumberish;
  sellerAllowList: BigNumberish[];
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: boolean;
}): Promise<TransactionResponse | TransactionRequest> {
  const transactionRequest = {
    to: args.contractAddress,
    data: encodeAddSellersToAllowList(args)
  } satisfies TransactionRequest;
  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

// Overload: returnTxInfo is true → returns TransactionRequest
export async function removeFeesFromDisputeResolver(args: {
  disputeResolverId: BigNumberish;
  feeTokenAddresses: string[];
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo: true;
}): Promise<TransactionRequest>;
// Overload: returnTxInfo is false or undefined → returns TransactionResponse
export async function removeFeesFromDisputeResolver(args: {
  disputeResolverId: BigNumberish;
  feeTokenAddresses: string[];
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;
// Implementation
export async function removeFeesFromDisputeResolver(args: {
  disputeResolverId: BigNumberish;
  feeTokenAddresses: string[];
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: boolean;
}): Promise<TransactionResponse | TransactionRequest> {
  const transactionRequest = {
    to: args.contractAddress,
    data: encodeRemoveFeesFromDisputeResolver(args)
  } satisfies TransactionRequest;
  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

// Overload: returnTxInfo is true → returns TransactionRequest
export async function removeSellersFromAllowList(args: {
  disputeResolverId: BigNumberish;
  sellerAllowList: BigNumberish[];
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo: true;
}): Promise<TransactionRequest>;
// Overload: returnTxInfo is false or undefined → returns TransactionResponse
export async function removeSellersFromAllowList(args: {
  disputeResolverId: BigNumberish;
  sellerAllowList: BigNumberish[];
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;
// Implementation
export async function removeSellersFromAllowList(args: {
  disputeResolverId: BigNumberish;
  sellerAllowList: BigNumberish[];
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: boolean;
}): Promise<TransactionResponse | TransactionRequest> {
  const transactionRequest = {
    to: args.contractAddress,
    data: encodeRemoveSellersFromAllowList(args)
  } satisfies TransactionRequest;
  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

// Overload: returnTxInfo is true → returns TransactionRequest
export async function updateDisputeResolver(args: {
  disputeResolverId: BigNumberish;
  updates: DisputeResolverUpdates;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  subgraphUrl: string;
  returnTxInfo: true;
}): Promise<TransactionRequest>;
// Overload: returnTxInfo is false or undefined → returns TransactionResponse
export async function updateDisputeResolver(args: {
  disputeResolverId: BigNumberish;
  updates: DisputeResolverUpdates;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  subgraphUrl: string;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;
// Implementation
export async function updateDisputeResolver(args: {
  disputeResolverId: BigNumberish;
  updates: DisputeResolverUpdates;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  subgraphUrl: string;
  returnTxInfo?: boolean;
}): Promise<TransactionResponse | TransactionRequest> {
  const disputeResolver = await getDisputeResolverById(
    args.subgraphUrl,
    args.disputeResolverId
  );

  assertDisputeResolver(args.disputeResolverId, disputeResolver);

  // TODO: validate metadata
  // updates.metadataUri

  const transactionRequest = {
    to: args.contractAddress,
    data: encodeUpdateDisputeResolver({
      ...disputeResolver,
      ...args.updates,
      escalationResponsePeriod: args.updates.escalationResponsePeriodInMS
        ? utils.timestamp.msToSec(args.updates.escalationResponsePeriodInMS)
        : disputeResolver.escalationResponsePeriod
    })
  } satisfies TransactionRequest;
  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

// Overload: returnTxInfo is true → returns TransactionRequest
export async function optInToDisputeResolverUpdate(args: {
  disputeResolverUpdates: OptInToDisputeResolverUpdateArgs;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo: true;
}): Promise<TransactionRequest>;
// Overload: returnTxInfo is false or undefined → returns TransactionResponse
export async function optInToDisputeResolverUpdate(args: {
  disputeResolverUpdates: OptInToDisputeResolverUpdateArgs;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;
// Implementation
export async function optInToDisputeResolverUpdate(args: {
  disputeResolverUpdates: OptInToDisputeResolverUpdateArgs;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: boolean;
}): Promise<TransactionResponse | TransactionRequest> {
  const transactionRequest = {
    to: args.contractAddress,
    data: encodeOptInToDisputeResolverUpdate(args.disputeResolverUpdates)
  } satisfies TransactionRequest;
  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

function assertDisputeResolver(
  disputeResolverId: BigNumberish,
  disputeResolver?: DisputeResolverFieldsFragment
) {
  if (!disputeResolver) {
    throw new Error(
      `Dispute resolver with id ${disputeResolverId} does not exist`
    );
  }
}

// Overload: returnTxInfo is true → returns TransactionRequest
export async function createNewCollection(args: {
  collectionToCreate: CreateCollectionArgs;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  metadataStorage: MetadataStorage;
  theGraphStorage: MetadataStorage;
  returnTxInfo: true;
}): Promise<TransactionRequest>;
// Overload: returnTxInfo is false or undefined → returns TransactionResponse
export async function createNewCollection(args: {
  collectionToCreate: CreateCollectionArgs;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  metadataStorage: MetadataStorage;
  theGraphStorage: MetadataStorage;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;
// Implementation
export async function createNewCollection(args: {
  collectionToCreate: CreateCollectionArgs;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  metadataStorage: MetadataStorage;
  theGraphStorage: MetadataStorage;
  returnTxInfo?: boolean;
}): Promise<TransactionResponse | TransactionRequest> {
  // call calculateCollectionAddress() to check no collection with the same collectionId already exists
  if (args.collectionToCreate.sellerId) {
    const { isAvailable } = await calculateCollectionAddress({
      sellerId: args.collectionToCreate.sellerId,
      collectionId: args.collectionToCreate.collectionId,
      contractAddress: args.contractAddress,
      web3Lib: args.web3Lib
    });
    if (!isAvailable) {
      throw new Error(
        `CollectionId '${args.collectionToCreate.collectionId}' is not available for seller '${args.collectionToCreate.sellerId}'`
      );
    }
  }
  await storeMetadataOnTheGraph({
    metadataUriOrHash: args.collectionToCreate.contractUri,
    metadataStorage: args.metadataStorage,
    theGraphStorage: args.theGraphStorage
  });
  const transactionRequest = {
    to: args.contractAddress,
    data: encodeCreateNewCollection(args.collectionToCreate)
  } satisfies TransactionRequest;
  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

export async function isSellerSaltAvailable(args: {
  adminAddress: string;
  salt: string;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
}): Promise<boolean> {
  const result = await args.web3Lib.call({
    to: args.contractAddress,
    data: encodeIsSellerSaltAvailable(args.adminAddress, args.salt)
  });
  return decodeIsSellerSaltAvailable(result);
}

export async function calculateCollectionAddress(args: {
  sellerId: BigNumberish;
  collectionId: string;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
}): Promise<{ collectionAddress: string; isAvailable: boolean }> {
  if (args.collectionId.length >= 32) {
    throw new Error(`collectionId length should not exceed 31 characters`);
  }
  const collectionSalt = formatBytes32String(args.collectionId);
  const result = await args.web3Lib.call({
    to: args.contractAddress,
    data: encodeCalculateCollectionAddress(args.sellerId, collectionSalt)
  });
  return decodeCalculateCollectionAddress(result);
}

// Overload: returnTxInfo is true → returns TransactionRequest
export async function addRoyaltyRecipients(args: {
  sellerId: BigNumberish;
  royaltyRecipients: RoyaltyRecipientInfo[];
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo: true;
}): Promise<TransactionRequest>;
// Overload: returnTxInfo is false or undefined → returns TransactionResponse
export async function addRoyaltyRecipients(args: {
  sellerId: BigNumberish;
  royaltyRecipients: RoyaltyRecipientInfo[];
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;
// Implementation
export async function addRoyaltyRecipients(args: {
  sellerId: BigNumberish;
  royaltyRecipients: RoyaltyRecipientInfo[];
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: boolean;
}): Promise<TransactionResponse | TransactionRequest> {
  const transactionRequest = {
    to: args.contractAddress,
    data: encodeAddRoyaltyRecipients(args)
  } satisfies TransactionRequest;
  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

// Overload: returnTxInfo is true → returns TransactionRequest
export async function updateRoyaltyRecipients(args: {
  sellerId: BigNumberish;
  royaltyRecipientIds: BigNumberish[];
  royaltyRecipients: RoyaltyRecipientInfo[];
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo: true;
}): Promise<TransactionRequest>;
// Overload: returnTxInfo is false or undefined → returns TransactionResponse
export async function updateRoyaltyRecipients(args: {
  sellerId: BigNumberish;
  royaltyRecipientIds: BigNumberish[];
  royaltyRecipients: RoyaltyRecipientInfo[];
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;
// Implementation
export async function updateRoyaltyRecipients(args: {
  sellerId: BigNumberish;
  royaltyRecipientIds: BigNumberish[];
  royaltyRecipients: RoyaltyRecipientInfo[];
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: boolean;
}): Promise<TransactionResponse | TransactionRequest> {
  const transactionRequest = {
    to: args.contractAddress,
    data: encodeUpdateRoyaltyRecipients(args)
  } satisfies TransactionRequest;
  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

// Overload: returnTxInfo is true → returns TransactionRequest
export async function removeRoyaltyRecipients(args: {
  sellerId: BigNumberish;
  royaltyRecipientIds: BigNumberish[];
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo: true;
}): Promise<TransactionRequest>;
// Overload: returnTxInfo is false or undefined → returns TransactionResponse
export async function removeRoyaltyRecipients(args: {
  sellerId: BigNumberish;
  royaltyRecipientIds: BigNumberish[];
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;
// Implementation
export async function removeRoyaltyRecipients(args: {
  sellerId: BigNumberish;
  royaltyRecipientIds: BigNumberish[];
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: boolean;
}): Promise<TransactionResponse | TransactionRequest> {
  const transactionRequest = {
    to: args.contractAddress,
    data: encodeRemoveRoyaltyRecipients(args)
  } satisfies TransactionRequest;
  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

export async function getRoyaltyRecipients(args: {
  sellerId: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
}): Promise<RoyaltyRecipientInfo[]> {
  const result = await args.web3Lib.call({
    to: args.contractAddress,
    data: encodeGetRoyaltyRecipients(args)
  });
  return decodeGetRoyaltyRecipients(result);
}
