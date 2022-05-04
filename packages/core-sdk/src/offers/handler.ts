import { BigNumberish } from "@ethersproject/bignumber";
import {
  Web3LibAdapter,
  TransactionResponse,
  MetadataStorage,
  utils
} from "@bosonprotocol/common";
import { bosonOfferHandlerIface, encodeCreateOffer } from "./interface";
import { getOfferById } from "./subgraph";
import { storeMetadataOnTheGraph } from "./storage";
import { CreateOfferArgs } from "./types";

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
  if (offer.seller.operator.toLowerCase() !== signerAddress.toLowerCase()) {
    throw new Error(
      `Signer with address "${signerAddress}" is not the operator "${offer.seller.operator}"`
    );
  }

  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: bosonOfferHandlerIface.encodeFunctionData("voidOffer", [args.offerId])
  });
}
