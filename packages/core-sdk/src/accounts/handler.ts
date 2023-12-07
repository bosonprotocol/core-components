import {
  Web3LibAdapter,
  TransactionResponse,
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
  decodeIsSellerSaltAvailable
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
  CreateCollectionArgs
} from "./types";
import { storeMetadataOnTheGraph } from "../offers/storage";

export async function setSellerCollectionId(args: {
  sellerToCreate: CreateSellerArgs;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
}): Promise<CreateSellerArgs> {
  if (!args.sellerToCreate.collectionId) {
    let collectionId = "collection-0";
    const isAvailable = await isSellerSaltAvailable({
      adminAddress: args.sellerToCreate.admin,
      salt: formatBytes32String(collectionId),
      contractAddress: args.contractAddress,
      web3Lib: args.web3Lib
    });
    if (!isAvailable) {
      const uuid = Math.floor(Math.random() * 100000000).toFixed(0);
      collectionId = `collection-0-${uuid}`;
      console.log(`new collectionId ${collectionId}`);
    }
    args.sellerToCreate.collectionId = collectionId;
  }
  return args.sellerToCreate;
}

export async function createSeller(args: {
  sellerToCreate: CreateSellerArgs;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  metadataStorage?: MetadataStorage;
  theGraphStorage?: MetadataStorage;
}): Promise<TransactionResponse> {
  const sellerToCreate = await setSellerCollectionId(args);
  await storeMetadataOnTheGraph({
    metadataUriOrHash: args.sellerToCreate.metadataUri,
    metadataStorage: args.metadataStorage,
    theGraphStorage: args.theGraphStorage
  });
  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: encodeCreateSeller(sellerToCreate)
  });
}

export async function updateSeller(args: {
  sellerUpdates: UpdateSellerArgs;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  metadataStorage: MetadataStorage;
  theGraphStorage: MetadataStorage;
}): Promise<TransactionResponse> {
  await storeMetadataOnTheGraph({
    metadataUriOrHash: args.sellerUpdates.metadataUri,
    metadataStorage: args.metadataStorage,
    theGraphStorage: args.theGraphStorage
  });
  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: encodeUpdateSeller(args.sellerUpdates)
  });
}

export async function optInToSellerUpdate(args: {
  sellerUpdates: OptInToSellerUpdateArgs;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
}): Promise<TransactionResponse> {
  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: encodeOptInToSellerUpdate(args.sellerUpdates)
  });
}

export async function createDisputeResolver(args: {
  disputeResolverToCreate: CreateDisputeResolverArgs;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
}) {
  // TODO: validate metadata
  // disputeResolverToCreate.metadataUri

  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: encodeCreateDisputeResolver(args.disputeResolverToCreate)
  });
}

export async function addFeesToDisputeResolver(args: {
  disputeResolverId: BigNumberish;
  fees: DisputeResolutionFee[];
  contractAddress: string;
  web3Lib: Web3LibAdapter;
}) {
  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: encodeAddFeesToDisputeResolver(args)
  });
}

export async function addSellersToAllowList(args: {
  disputeResolverId: BigNumberish;
  sellerAllowList: BigNumberish[];
  contractAddress: string;
  web3Lib: Web3LibAdapter;
}) {
  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: encodeAddSellersToAllowList(args)
  });
}

export async function removeFeesFromDisputeResolver(args: {
  disputeResolverId: BigNumberish;
  feeTokenAddresses: string[];
  contractAddress: string;
  web3Lib: Web3LibAdapter;
}) {
  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: encodeRemoveFeesFromDisputeResolver(args)
  });
}

export async function removeSellersFromAllowList(args: {
  disputeResolverId: BigNumberish;
  sellerAllowList: BigNumberish[];
  contractAddress: string;
  web3Lib: Web3LibAdapter;
}) {
  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: encodeRemoveSellersFromAllowList(args)
  });
}

export async function updateDisputeResolver(args: {
  disputeResolverId: BigNumberish;
  updates: DisputeResolverUpdates;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  subgraphUrl: string;
}) {
  const disputeResolver = await getDisputeResolverById(
    args.subgraphUrl,
    args.disputeResolverId
  );

  assertDisputeResolver(args.disputeResolverId, disputeResolver);

  // TODO: validate metadata
  // updates.metadataUri

  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: encodeUpdateDisputeResolver({
      ...disputeResolver,
      ...args.updates,
      escalationResponsePeriod: args.updates.escalationResponsePeriodInMS
        ? utils.timestamp.msToSec(args.updates.escalationResponsePeriodInMS)
        : disputeResolver.escalationResponsePeriod
    })
  });
}

export async function optInToDisputeResolverUpdate(args: {
  disputeResolverUpdates: OptInToDisputeResolverUpdateArgs;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
}): Promise<TransactionResponse> {
  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: encodeOptInToDisputeResolverUpdate(args.disputeResolverUpdates)
  });
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

export async function createNewCollection(args: {
  collectionToCreate: CreateCollectionArgs;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
}): Promise<TransactionResponse> {
  // TODO: call calculateCollectionAddress() to check no collection with the same collectionId already exists
  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: encodeCreateNewCollection(args.collectionToCreate)
  });
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
