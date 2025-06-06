import {
  Web3LibAdapter,
  TransactionRequest,
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
import { findCollectionSalt } from "../accounts/handler";
import { PremintParametersStruct } from "@bosonprotocol/common/src";
import { storeMetadataItems } from "../metadata/storeMetadataItems";

// createOfferAndSeller overloads
export async function createOfferAndSeller(args: {
  offerToCreate: CreateOfferArgs;
  sellerToCreate: CreateSellerArgs;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  metadataStorage?: MetadataStorage;
  theGraphStorage?: MetadataStorage;
  returnTxInfo: true;
}): Promise<TransactionRequest>;

export async function createOfferAndSeller(args: {
  offerToCreate: CreateOfferArgs;
  sellerToCreate: CreateSellerArgs;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  metadataStorage?: MetadataStorage;
  theGraphStorage?: MetadataStorage;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;

export async function createOfferAndSeller(args: {
  offerToCreate: CreateOfferArgs;
  sellerToCreate: CreateSellerArgs;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  metadataStorage?: MetadataStorage;
  theGraphStorage?: MetadataStorage;
  returnTxInfo?: boolean;
}): Promise<TransactionRequest | TransactionResponse> {
  utils.validation.createOfferArgsSchema.validateSync(args.offerToCreate, {
    abortEarly: false
  });

  utils.validation.createSellerArgsSchema.validateSync(args.sellerToCreate, {
    abortEarly: false
  });

  await Promise.all(
    [
      args.offerToCreate.metadataUri,
      args.sellerToCreate.metadataUri,
      args.sellerToCreate.contractUri
    ].map((metadataUri) =>
      storeMetadataOnTheGraph({
        metadataUriOrHash: metadataUri,
        metadataStorage: args.metadataStorage,
        theGraphStorage: args.theGraphStorage
      })
    )
  );

  await storeMetadataItems({
    ...args,
    createOffersArgs: [args.offerToCreate]
  });

  const collectionSalt = await findCollectionSalt(args);
  const transactionRequest = {
    to: args.contractAddress,
    data: encodeCreateSellerAndOffer(
      args.sellerToCreate,
      collectionSalt,
      args.offerToCreate
    )
  } satisfies TransactionRequest;

  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

// createOfferWithCondition overloads
export async function createOfferWithCondition(args: {
  offerToCreate: CreateOfferArgs;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  metadataStorage?: MetadataStorage;
  theGraphStorage?: MetadataStorage;
  condition: ConditionStruct;
  returnTxInfo: true;
}): Promise<TransactionRequest>;

export async function createOfferWithCondition(args: {
  offerToCreate: CreateOfferArgs;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  metadataStorage?: MetadataStorage;
  theGraphStorage?: MetadataStorage;
  condition: ConditionStruct;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;

export async function createOfferWithCondition(args: {
  offerToCreate: CreateOfferArgs;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  metadataStorage?: MetadataStorage;
  theGraphStorage?: MetadataStorage;
  condition: ConditionStruct;
  returnTxInfo?: boolean;
}): Promise<TransactionRequest | TransactionResponse> {
  utils.validation.createOfferArgsSchema.validateSync(args.offerToCreate, {
    abortEarly: false
  });

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
    to: args.contractAddress,
    data: encodeCreateOfferWithCondition(args.offerToCreate, args.condition)
  } satisfies TransactionRequest;

  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

// createSellerAndOfferWithCondition overloads
export async function createSellerAndOfferWithCondition(args: {
  sellerToCreate: CreateSellerArgs;
  offerToCreate: CreateOfferArgs;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  metadataStorage?: MetadataStorage;
  theGraphStorage?: MetadataStorage;
  condition: ConditionStruct;
  returnTxInfo: true;
}): Promise<TransactionRequest>;

export async function createSellerAndOfferWithCondition(args: {
  sellerToCreate: CreateSellerArgs;
  offerToCreate: CreateOfferArgs;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  metadataStorage?: MetadataStorage;
  theGraphStorage?: MetadataStorage;
  condition: ConditionStruct;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;

export async function createSellerAndOfferWithCondition(args: {
  sellerToCreate: CreateSellerArgs;
  offerToCreate: CreateOfferArgs;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  metadataStorage?: MetadataStorage;
  theGraphStorage?: MetadataStorage;
  condition: ConditionStruct;
  returnTxInfo?: boolean;
}): Promise<TransactionRequest | TransactionResponse> {
  utils.validation.createOfferArgsSchema.validateSync(args.offerToCreate, {
    abortEarly: false
  });

  await Promise.all(
    [
      args.offerToCreate.metadataUri,
      args.sellerToCreate.metadataUri,
      args.sellerToCreate.contractUri
    ].map((metadataUri) =>
      storeMetadataOnTheGraph({
        metadataUriOrHash: metadataUri,
        metadataStorage: args.metadataStorage,
        theGraphStorage: args.theGraphStorage
      })
    )
  );

  await storeMetadataItems({
    ...args,
    createOffersArgs: [args.offerToCreate]
  });

  const collectionSalt = await findCollectionSalt(args);
  const transactionRequest = {
    to: args.contractAddress,
    data: encodeCreateSellerAndOfferWithCondition(
      args.sellerToCreate,
      collectionSalt,
      args.offerToCreate,
      args.condition
    )
  } satisfies TransactionRequest;

  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

// createPremintedOfferAddToGroup overloads
export async function createPremintedOfferAddToGroup(args: {
  offerToCreate: CreateOfferArgs;
  premintParameters: PremintParametersStruct;
  groupId: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  metadataStorage?: MetadataStorage;
  theGraphStorage?: MetadataStorage;
  returnTxInfo: true;
}): Promise<TransactionRequest>;

export async function createPremintedOfferAddToGroup(args: {
  offerToCreate: CreateOfferArgs;
  premintParameters: PremintParametersStruct;
  groupId: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  metadataStorage?: MetadataStorage;
  theGraphStorage?: MetadataStorage;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;

export async function createPremintedOfferAddToGroup(args: {
  offerToCreate: CreateOfferArgs;
  premintParameters: PremintParametersStruct;
  groupId: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  metadataStorage?: MetadataStorage;
  theGraphStorage?: MetadataStorage;
  returnTxInfo?: boolean;
}): Promise<TransactionRequest | TransactionResponse> {
  utils.validation.createOfferArgsSchema.validateSync(args.offerToCreate, {
    abortEarly: false
  });

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
    to: args.contractAddress,
    data: encodeCreatePremintedOfferAddToGroup(
      args.offerToCreate,
      args.premintParameters,
      args.groupId
    )
  } satisfies TransactionRequest;

  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

// createPremintedOfferWithCondition overloads
export async function createPremintedOfferWithCondition(args: {
  offerToCreate: CreateOfferArgs;
  premintParameters: PremintParametersStruct;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  metadataStorage?: MetadataStorage;
  theGraphStorage?: MetadataStorage;
  condition: ConditionStruct;
  returnTxInfo: true;
}): Promise<TransactionRequest>;

export async function createPremintedOfferWithCondition(args: {
  offerToCreate: CreateOfferArgs;
  premintParameters: PremintParametersStruct;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  metadataStorage?: MetadataStorage;
  theGraphStorage?: MetadataStorage;
  condition: ConditionStruct;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;

export async function createPremintedOfferWithCondition(args: {
  offerToCreate: CreateOfferArgs;
  premintParameters: PremintParametersStruct;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  metadataStorage?: MetadataStorage;
  theGraphStorage?: MetadataStorage;
  condition: ConditionStruct;
  returnTxInfo?: boolean;
}): Promise<TransactionRequest | TransactionResponse> {
  utils.validation.createOfferArgsSchema.validateSync(args.offerToCreate, {
    abortEarly: false
  });

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
    to: args.contractAddress,
    data: encodeCreatePremintedOfferWithCondition(
      args.offerToCreate,
      args.premintParameters,
      args.condition
    )
  } satisfies TransactionRequest;

  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

// createSellerAndPremintedOffer overloads
export async function createSellerAndPremintedOffer(args: {
  sellerToCreate: CreateSellerArgs;
  offerToCreate: CreateOfferArgs;
  premintParameters: PremintParametersStruct;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  metadataStorage?: MetadataStorage;
  theGraphStorage?: MetadataStorage;
  returnTxInfo: true;
}): Promise<TransactionRequest>;

export async function createSellerAndPremintedOffer(args: {
  sellerToCreate: CreateSellerArgs;
  offerToCreate: CreateOfferArgs;
  premintParameters: PremintParametersStruct;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  metadataStorage?: MetadataStorage;
  theGraphStorage?: MetadataStorage;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;

export async function createSellerAndPremintedOffer(args: {
  sellerToCreate: CreateSellerArgs;
  offerToCreate: CreateOfferArgs;
  premintParameters: PremintParametersStruct;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  metadataStorage?: MetadataStorage;
  theGraphStorage?: MetadataStorage;
  returnTxInfo?: boolean;
}): Promise<TransactionRequest | TransactionResponse> {
  utils.validation.createOfferArgsSchema.validateSync(args.offerToCreate, {
    abortEarly: false
  });

  await Promise.all(
    [
      args.offerToCreate.metadataUri,
      args.sellerToCreate.metadataUri,
      args.sellerToCreate.contractUri
    ].map((metadataUri) =>
      storeMetadataOnTheGraph({
        metadataUriOrHash: metadataUri,
        metadataStorage: args.metadataStorage,
        theGraphStorage: args.theGraphStorage
      })
    )
  );

  await storeMetadataItems({
    ...args,
    createOffersArgs: [args.offerToCreate]
  });

  const collectionSalt = await findCollectionSalt(args);
  const transactionRequest = {
    to: args.contractAddress,
    data: encodeCreateSellerAndPremintedOffer(
      args.sellerToCreate,
      collectionSalt,
      args.offerToCreate,
      args.premintParameters
    )
  } satisfies TransactionRequest;

  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

// createSellerAndPremintedOfferWithCondition overloads
export async function createSellerAndPremintedOfferWithCondition(args: {
  sellerToCreate: CreateSellerArgs;
  offerToCreate: CreateOfferArgs;
  premintParameters: PremintParametersStruct;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  metadataStorage?: MetadataStorage;
  theGraphStorage?: MetadataStorage;
  condition: ConditionStruct;
  returnTxInfo: true;
}): Promise<TransactionRequest>;

export async function createSellerAndPremintedOfferWithCondition(args: {
  sellerToCreate: CreateSellerArgs;
  offerToCreate: CreateOfferArgs;
  premintParameters: PremintParametersStruct;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  metadataStorage?: MetadataStorage;
  theGraphStorage?: MetadataStorage;
  condition: ConditionStruct;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;

export async function createSellerAndPremintedOfferWithCondition(args: {
  sellerToCreate: CreateSellerArgs;
  offerToCreate: CreateOfferArgs;
  premintParameters: PremintParametersStruct;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  metadataStorage?: MetadataStorage;
  theGraphStorage?: MetadataStorage;
  condition: ConditionStruct;
  returnTxInfo?: boolean;
}): Promise<TransactionRequest | TransactionResponse> {
  utils.validation.createOfferArgsSchema.validateSync(args.offerToCreate, {
    abortEarly: false
  });

  await Promise.all(
    [
      args.offerToCreate.metadataUri,
      args.sellerToCreate.metadataUri,
      args.sellerToCreate.contractUri
    ].map((metadataUri) =>
      storeMetadataOnTheGraph({
        metadataUriOrHash: metadataUri,
        metadataStorage: args.metadataStorage,
        theGraphStorage: args.theGraphStorage
      })
    )
  );

  await storeMetadataItems({
    ...args,
    createOffersArgs: [args.offerToCreate]
  });

  const collectionSalt = await findCollectionSalt(args);
  const transactionRequest = {
    to: args.contractAddress,
    data: encodeCreateSellerAndPremintedOfferWithCondition(
      args.sellerToCreate,
      collectionSalt,
      args.offerToCreate,
      args.premintParameters,
      args.condition
    )
  } satisfies TransactionRequest;

  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

// raiseAndEscalateDispute overloads
export async function raiseAndEscalateDispute(args: {
  exchangeId: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  metadataStorage?: MetadataStorage;
  theGraphStorage?: MetadataStorage;
  returnTxInfo: true;
}): Promise<TransactionRequest>;

export async function raiseAndEscalateDispute(args: {
  exchangeId: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  metadataStorage?: MetadataStorage;
  theGraphStorage?: MetadataStorage;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;

export async function raiseAndEscalateDispute(args: {
  exchangeId: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  metadataStorage?: MetadataStorage;
  theGraphStorage?: MetadataStorage;
  returnTxInfo?: boolean;
}): Promise<TransactionRequest | TransactionResponse> {
  const transactionRequest = {
    to: args.contractAddress,
    data: encodeRaiseAndEscalateDispute(args.exchangeId)
  } satisfies TransactionRequest;

  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}
