import {
  Web3LibAdapter,
  TransactionResponse,
  MetadataStorage,
  utils
} from "@bosonprotocol/common";
import { encodeCreateSellerAndOffer } from "./interface";
import { storeMetadataOnTheGraph } from "../offers/storage";

import { CreateOfferArgs } from "../offers/types";
import { CreateSellerArgs } from "../accounts/types";

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
