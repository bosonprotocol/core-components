import { BigNumberish } from "@ethersproject/bignumber";
import {
  Web3LibAdapter,
  TransactionResponse,
  MetadataStorage
} from "@bosonprotocol/common";
import { createOfferArgsSchema } from "./validation";
import { bosonOfferHandlerIface, encodeCreateOffer } from "./interface";
import { getOfferById } from "./subgraph";
import { CreateOfferArgs } from "./types";

export async function createOffer(args: {
  offerToCreate: CreateOfferArgs;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  metadataStorage?: MetadataStorage;
  theGraphStorage?: MetadataStorage;
}): Promise<TransactionResponse> {
  await createOfferArgsSchema.validate(args.offerToCreate, {
    abortEarly: false
  });

  // We use the feature `ipfsOnEthereum` in our subgraph to resolve metadata from IPFS
  // and store them in the graph. In order for the graph node to reliably resolve them,
  // we need to add the metadata additionally to the IPFS node of the graph.
  // See https://thegraph.com/docs/en/developer/assemblyscript-api/#ipfs-api
  if (args.metadataStorage && args.theGraphStorage) {
    await storeMetadataOnTheGraph({
      metadataUri: args.offerToCreate.metadataUri,
      metadataStorage: args.metadataStorage,
      theGraphStorage: args.theGraphStorage
    });
  }

  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: encodeCreateOffer(args.offerToCreate)
  });
}

export async function voidOffer(args: {
  contractAddress: string;
  subgraphUrl: string;
  offerId: BigNumberish;
  web3Lib: Web3LibAdapter;
}): Promise<TransactionResponse> {
  const offer = await getOfferById(args.subgraphUrl, args.offerId);

  if (!offer) {
    throw new Error(`Offer with id "${args.offerId}" does not exist`);
  }

  if (offer.voidedAt) {
    throw new Error(`Offer with id "${args.offerId}" is already voided`);
  }

  const signerAddress = await args.web3Lib.getSignerAddress();
  if (offer.seller.address.toLowerCase() !== signerAddress.toLowerCase()) {
    throw new Error(
      `Signer with address "${signerAddress}" is not the seller "${offer.seller.address}"`
    );
  }

  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: bosonOfferHandlerIface.encodeFunctionData("voidOffer", [args.offerId])
  });
}

export async function storeMetadataOnTheGraph(args: {
  metadataUri: string;
  metadataStorage: MetadataStorage;
  theGraphStorage: MetadataStorage;
}): Promise<string> {
  // TODO: check if `metadataUri` valid ipfs hash/url?
  const metadata = await args.metadataStorage.getMetadata(args.metadataUri);
  const metadataUri = await args.theGraphStorage.storeMetadata(metadata);
  return metadataUri;
}
