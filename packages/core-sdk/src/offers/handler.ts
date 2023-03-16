import { BigNumberish } from "@ethersproject/bignumber";
import {
  Web3LibAdapter,
  TransactionResponse,
  MetadataStorage,
  utils
} from "@bosonprotocol/common";
import {
  bosonOfferHandlerIface,
  encodeCreateOffer,
  encodeCreateOfferBatch,
  encodeReserveRange
} from "./interface";
import { getOfferById, getOffers } from "./subgraph";
import { storeMetadataOnTheGraph } from "./storage";
import { CreateOfferArgs } from "./types";
import { OfferFieldsFragment } from "../subgraph";

export async function createOffer(args: {
  offerToCreate: CreateOfferArgs;
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
    data: encodeCreateOffer(args.offerToCreate)
  });
}

export async function createOfferBatch(args: {
  offersToCreate: CreateOfferArgs[];
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  metadataStorage?: MetadataStorage;
  theGraphStorage?: MetadataStorage;
}): Promise<TransactionResponse> {
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

  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: encodeCreateOfferBatch(args.offersToCreate)
  });
}

export async function reserveRange(args: {
  contractAddress: string;
  subgraphUrl: string;
  offerId: BigNumberish;
  length: BigNumberish;
  to: string;
  web3Lib: Web3LibAdapter;
}): Promise<TransactionResponse> {
  const offerFromSubgraph = await getOfferById(args.subgraphUrl, args.offerId);
  const signerAddress = await args.web3Lib.getSignerAddress();

  checkIfOfferReservable(
    args.offerId,
    args.length,
    signerAddress,
    offerFromSubgraph
  );

  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: encodeReserveRange(args.offerId, args.length, args.to)
  });
}

export async function voidOffer(args: {
  contractAddress: string;
  subgraphUrl: string;
  offerId: BigNumberish;
  web3Lib: Web3LibAdapter;
}): Promise<TransactionResponse> {
  const offerFromSubgraph = await getOfferById(args.subgraphUrl, args.offerId);
  const signerAddress = await args.web3Lib.getSignerAddress();

  checkIfOfferVoidable(args.offerId, signerAddress, offerFromSubgraph);

  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: bosonOfferHandlerIface.encodeFunctionData("voidOffer", [args.offerId])
  });
}

export async function voidOfferBatch(args: {
  contractAddress: string;
  subgraphUrl: string;
  offerIds: BigNumberish[];
  web3Lib: Web3LibAdapter;
}): Promise<TransactionResponse> {
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

  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: bosonOfferHandlerIface.encodeFunctionData("voidOfferBatch", [
      args.offerIds
    ])
  });
}

export async function extendOffer(args: {
  contractAddress: string;
  subgraphUrl: string;
  offerId: BigNumberish;
  validUntil: BigNumberish;
  web3Lib: Web3LibAdapter;
}): Promise<TransactionResponse> {
  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: bosonOfferHandlerIface.encodeFunctionData("extendOffer", [
      args.offerId,
      args.validUntil
    ])
  });
}

export async function extendOfferBatch(args: {
  contractAddress: string;
  subgraphUrl: string;
  offerIds: BigNumberish[];
  validUntil: BigNumberish;
  web3Lib: Web3LibAdapter;
}): Promise<TransactionResponse> {
  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: bosonOfferHandlerIface.encodeFunctionData("extendOfferBatch", [
      args.offerIds,
      args.validUntil
    ])
  });
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
    offerFromSubgraph.seller.assistant.toLowerCase() !==
    signerAddress.toLowerCase()
  ) {
    throw new Error(
      `Signer with address "${signerAddress}" is not the assistant "${offerFromSubgraph.seller.assistant}" of offer with id "${offerId}"`
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
