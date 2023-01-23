import {
  Web3LibAdapter,
  TransactionResponse,
  MetadataStorage,
  utils,
  ConditionStruct
} from "@bosonprotocol/common";
import {
  encodeCreateOfferWithCondition,
  encodeCreatePremintedOfferAddToGroup,
  encodeCreatePremintedOfferWithCondition,
  encodeCreateSellerAndOffer,
  encodeCreateSellerAndOfferWithCondition,
  encodeCreateSellerAndPremintedOffer,
  encodeCreateSellerAndPremintedOfferWithCondition,
  encodeRaiseAndEscalateDispute
} from "./interface";
import { storeMetadataOnTheGraph } from "../offers/storage";

import { CreateOfferArgs } from "../offers/types";
import { CreateSellerArgs } from "../accounts/types";
import { BigNumberish } from "@ethersproject/bignumber";

export async function createOfferAndSeller(args: {
  offerToCreate: CreateOfferArgs;
  sellerToCreate: CreateSellerArgs;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  metadataStorage?: MetadataStorage;
  theGraphStorage?: MetadataStorage;
}): Promise<TransactionResponse> {
  utils.validation.createOfferArgsSchema.validateSync(args.offerToCreate, {
    abortEarly: false
  });

  utils.validation.createSellerArgsSchema.validateSync(args.sellerToCreate, {
    abortEarly: false
  });

  await storeMetadataOnTheGraph({
    metadataUriOrHash: args.offerToCreate.metadataUri,
    metadataStorage: args.metadataStorage,
    theGraphStorage: args.theGraphStorage
  });

  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: encodeCreateSellerAndOffer(args.sellerToCreate, args.offerToCreate)
  });
}

export async function createOfferWithCondition(args: {
  offerToCreate: CreateOfferArgs;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  metadataStorage?: MetadataStorage;
  theGraphStorage?: MetadataStorage;
  condition: ConditionStruct;
}): Promise<TransactionResponse> {
  utils.validation.createOfferArgsSchema.validateSync(args.offerToCreate, {
    abortEarly: false
  });

  await storeMetadataOnTheGraph({
    metadataUriOrHash: args.offerToCreate.metadataUri,
    metadataStorage: args.metadataStorage,
    theGraphStorage: args.theGraphStorage
  });

  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: encodeCreateOfferWithCondition(args.offerToCreate, args.condition)
  });
}

export async function createSellerAndOfferWithCondition(args: {
  sellerToCreate: CreateSellerArgs;
  offerToCreate: CreateOfferArgs;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  metadataStorage?: MetadataStorage;
  theGraphStorage?: MetadataStorage;
  condition: ConditionStruct;
}): Promise<TransactionResponse> {
  utils.validation.createOfferArgsSchema.validateSync(args.offerToCreate, {
    abortEarly: false
  });

  await storeMetadataOnTheGraph({
    metadataUriOrHash: args.offerToCreate.metadataUri,
    metadataStorage: args.metadataStorage,
    theGraphStorage: args.theGraphStorage
  });

  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: encodeCreateSellerAndOfferWithCondition(
      args.sellerToCreate,
      args.offerToCreate,
      args.condition
    )
  });
}

export async function createPremintedOfferAddToGroup(args: {
  offerToCreate: CreateOfferArgs;
  reservedRangeLength: BigNumberish;
  groupId: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  metadataStorage?: MetadataStorage;
  theGraphStorage?: MetadataStorage;
}): Promise<TransactionResponse> {
  utils.validation.createOfferArgsSchema.validateSync(args.offerToCreate, {
    abortEarly: false
  });

  await storeMetadataOnTheGraph({
    metadataUriOrHash: args.offerToCreate.metadataUri,
    metadataStorage: args.metadataStorage,
    theGraphStorage: args.theGraphStorage
  });

  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: encodeCreatePremintedOfferAddToGroup(
      args.offerToCreate,
      args.reservedRangeLength,
      args.groupId
    )
  });
}

export async function createPremintedOfferWithCondition(args: {
  offerToCreate: CreateOfferArgs;
  reservedRangeLength: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  metadataStorage?: MetadataStorage;
  theGraphStorage?: MetadataStorage;
  condition: ConditionStruct;
}): Promise<TransactionResponse> {
  utils.validation.createOfferArgsSchema.validateSync(args.offerToCreate, {
    abortEarly: false
  });

  await storeMetadataOnTheGraph({
    metadataUriOrHash: args.offerToCreate.metadataUri,
    metadataStorage: args.metadataStorage,
    theGraphStorage: args.theGraphStorage
  });

  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: encodeCreatePremintedOfferWithCondition(
      args.offerToCreate,
      args.reservedRangeLength,
      args.condition
    )
  });
}

export async function createSellerAndPremintedOffer(args: {
  sellerToCreate: CreateSellerArgs;
  offerToCreate: CreateOfferArgs;
  reservedRangeLength: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  metadataStorage?: MetadataStorage;
  theGraphStorage?: MetadataStorage;
}): Promise<TransactionResponse> {
  utils.validation.createOfferArgsSchema.validateSync(args.offerToCreate, {
    abortEarly: false
  });

  await storeMetadataOnTheGraph({
    metadataUriOrHash: args.offerToCreate.metadataUri,
    metadataStorage: args.metadataStorage,
    theGraphStorage: args.theGraphStorage
  });

  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: encodeCreateSellerAndPremintedOffer(
      args.sellerToCreate,
      args.offerToCreate,
      args.reservedRangeLength
    )
  });
}

export async function createSellerAndPremintedOfferWithCondition(args: {
  sellerToCreate: CreateSellerArgs;
  offerToCreate: CreateOfferArgs;
  reservedRangeLength: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  metadataStorage?: MetadataStorage;
  theGraphStorage?: MetadataStorage;
  condition: ConditionStruct;
}): Promise<TransactionResponse> {
  utils.validation.createOfferArgsSchema.validateSync(args.offerToCreate, {
    abortEarly: false
  });

  await storeMetadataOnTheGraph({
    metadataUriOrHash: args.offerToCreate.metadataUri,
    metadataStorage: args.metadataStorage,
    theGraphStorage: args.theGraphStorage
  });

  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: encodeCreateSellerAndPremintedOfferWithCondition(
      args.sellerToCreate,
      args.offerToCreate,
      args.reservedRangeLength,
      args.condition
    )
  });
}

export async function raiseAndEscalateDispute(args: {
  exchangeId: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  metadataStorage?: MetadataStorage;
  theGraphStorage?: MetadataStorage;
}): Promise<TransactionResponse> {
  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: encodeRaiseAndEscalateDispute(args.exchangeId)
  });
}
