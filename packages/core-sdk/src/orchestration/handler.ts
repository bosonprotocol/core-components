import {
  Web3LibAdapter,
  TransactionRequest,
  TransactionResponse,
  MetadataStorage,
  utils,
  ConditionStruct,
  FullOfferArgs,
  OfferCreator
} from "@bosonprotocol/common";
import {
  encodeCommitToConditionalOfferAndRedeemVoucher,
  encodeCommitToOfferAndRedeemVoucher,
  encodeCreateOfferCommitAndRedeem,
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
import { AddressZero } from "@ethersproject/constants";

import { CreateOfferArgs } from "../offers/types";
import { CreateSellerArgs } from "../accounts/types";
import { BigNumberish } from "@ethersproject/bignumber";
import { findCollectionSalt } from "../accounts/handler";
import { PremintParametersStruct } from "@bosonprotocol/common/src";
import { storeMetadataItems } from "../metadata/storeMetadataItems";
import { getOfferById } from "../offers/subgraph";
import {
  checkOfferIsCommittable,
  isFullOfferVoided
} from "../exchanges/handler";
import { ensureAllowance } from "../erc20/handler";
import { getDisputeResolverById } from "../accounts/subgraph";

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

// commitToOfferAndRedeemVoucher overloads
export async function commitToOfferAndRedeemVoucher(args: {
  offerId: BigNumberish;
  contractAddress: string;
  subgraphUrl: string;
  web3Lib: Web3LibAdapter;
  metadataStorage?: MetadataStorage;
  theGraphStorage?: MetadataStorage;
  returnTxInfo: true;
}): Promise<TransactionRequest>;

export async function commitToOfferAndRedeemVoucher(args: {
  offerId: BigNumberish;
  contractAddress: string;
  subgraphUrl: string;
  web3Lib: Web3LibAdapter;
  metadataStorage?: MetadataStorage;
  theGraphStorage?: MetadataStorage;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;

export async function commitToOfferAndRedeemVoucher(args: {
  offerId: BigNumberish;
  contractAddress: string;
  subgraphUrl: string;
  web3Lib: Web3LibAdapter;
  metadataStorage?: MetadataStorage;
  theGraphStorage?: MetadataStorage;
  returnTxInfo?: boolean;
}): Promise<TransactionRequest | TransactionResponse> {
  const offer = await getOfferById(args.subgraphUrl, args.offerId);

  await checkOfferIsCommittable(args.offerId, offer);

  if (offer.creator !== OfferCreator.Seller) {
    throw new Error(
      `Offer with id ${args.offerId.toString()} is not seller initiated`
    );
  }

  if (offer.condition) {
    // keep compatibility with previous version
    if (args.returnTxInfo) {
      return commitToConditionalOfferAndRedeemVoucher({
        ...args,
        returnTxInfo: true,
        tokenId: offer.condition.minTokenId
      });
    }
    return commitToConditionalOfferAndRedeemVoucher({
      ...args,
      returnTxInfo: false,
      tokenId: offer.condition.minTokenId
    });
  }

  if (offer.exchangeToken.address !== AddressZero) {
    const owner = await args.web3Lib.getSignerAddress();
    await ensureAllowance({
      owner,
      spender: args.contractAddress,
      contractAddress: offer.exchangeToken.address,
      value: offer.price,
      web3Lib: args.web3Lib
    });
  }

  const transactionRequest = {
    to: args.contractAddress,
    data: encodeCommitToOfferAndRedeemVoucher(args.offerId),
    value: offer.exchangeToken.address === AddressZero ? offer.price : "0"
  } satisfies TransactionRequest;

  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

// commitToConditionalOfferAndRedeemVoucher overloads
export async function commitToConditionalOfferAndRedeemVoucher(args: {
  offerId: BigNumberish;
  tokenId: BigNumberish;
  contractAddress: string;
  subgraphUrl: string;
  web3Lib: Web3LibAdapter;
  metadataStorage?: MetadataStorage;
  theGraphStorage?: MetadataStorage;
  returnTxInfo: true;
}): Promise<TransactionRequest>;

export async function commitToConditionalOfferAndRedeemVoucher(args: {
  offerId: BigNumberish;
  tokenId: BigNumberish;
  contractAddress: string;
  subgraphUrl: string;
  web3Lib: Web3LibAdapter;
  metadataStorage?: MetadataStorage;
  theGraphStorage?: MetadataStorage;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;

export async function commitToConditionalOfferAndRedeemVoucher(args: {
  offerId: BigNumberish;
  tokenId: BigNumberish;
  contractAddress: string;
  subgraphUrl: string;
  web3Lib: Web3LibAdapter;
  metadataStorage?: MetadataStorage;
  theGraphStorage?: MetadataStorage;
  returnTxInfo?: boolean;
}): Promise<TransactionRequest | TransactionResponse> {
  const offer = await getOfferById(args.subgraphUrl, args.offerId);

  await checkOfferIsCommittable(args.offerId, offer);

  if (offer.exchangeToken.address !== AddressZero) {
    const owner = await args.web3Lib.getSignerAddress();
    await ensureAllowance({
      owner,
      spender: args.contractAddress,
      contractAddress: offer.exchangeToken.address,
      value: offer.price,
      web3Lib: args.web3Lib
    });
  }

  const transactionRequest = {
    to: args.contractAddress,
    data: encodeCommitToConditionalOfferAndRedeemVoucher(
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

// createOfferCommitAndRedeem overloads
export async function createOfferCommitAndRedeem(args: {
  createOfferAndCommitArgs: FullOfferArgs;
  contractAddress: string;
  subgraphUrl: string;
  web3Lib: Web3LibAdapter;
  txRequest?: TransactionRequest;
  metadataStorage?: MetadataStorage;
  theGraphStorage?: MetadataStorage;
  returnTxInfo: true;
}): Promise<TransactionRequest>;

export async function createOfferCommitAndRedeem(args: {
  createOfferAndCommitArgs: FullOfferArgs;
  contractAddress: string;
  subgraphUrl: string;
  web3Lib: Web3LibAdapter;
  txRequest?: TransactionRequest;
  metadataStorage?: MetadataStorage;
  theGraphStorage?: MetadataStorage;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;

export async function createOfferCommitAndRedeem(args: {
  createOfferAndCommitArgs: FullOfferArgs;
  contractAddress: string;
  subgraphUrl: string;
  web3Lib: Web3LibAdapter;
  txRequest?: TransactionRequest;
  metadataStorage?: MetadataStorage;
  theGraphStorage?: MetadataStorage;
  returnTxInfo?: boolean;
}): Promise<TransactionRequest | TransactionResponse> {
  utils.validation.createOfferAndCommitArgsSchema.validateSync(
    args.createOfferAndCommitArgs,
    {
      abortEarly: false
    }
  );

  const { disputeResolverId, exchangeToken, price, sellerDeposit, creator } =
    args.createOfferAndCommitArgs;
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

  if (
    await isFullOfferVoided({
      ...args,
      fullOfferArgsUnsigned: args.createOfferAndCommitArgs
    })
  ) {
    throw new Error(`The offer has been voided`);
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

  const committerPayment =
    creator === OfferCreator.Buyer ? sellerDeposit : price;

  if (exchangeToken !== AddressZero) {
    const owner = await args.web3Lib.getSignerAddress();
    await ensureAllowance({
      owner,
      spender: args.contractAddress,
      contractAddress: exchangeToken,
      value: committerPayment,
      web3Lib: args.web3Lib
    });
  }

  const transactionRequest = {
    ...args.txRequest,
    to: args.contractAddress,
    data: encodeCreateOfferCommitAndRedeem(args.createOfferAndCommitArgs),
    value: exchangeToken === AddressZero ? committerPayment : "0"
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
