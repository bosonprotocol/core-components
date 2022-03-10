import {
  Web3LibAdapter,
  TransactionResponse,
  OfferStruct,
  utils,
  abis,
  MetadataStorage
} from "@bosonprotocol/common";
import { Interface } from "@ethersproject/abi";
import { getAddress } from "@ethersproject/address";
import { createOfferArgsSchema } from "./validation";
import { CreateOfferArgs } from "./types";

export const bosonOfferHandlerIface = new Interface(abis.IBosonOfferHandlerABI);

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

  const calldata = encodeCreateOffer(args.offerToCreate);

  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: calldata
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

export function encodeCreateOffer(args: CreateOfferArgs) {
  return bosonOfferHandlerIface.encodeFunctionData("createOffer", [
    createOfferArgsToStruct(args)
  ]);
}

export function createOfferArgsToStruct(
  args: CreateOfferArgs
): Partial<OfferStruct> {
  const {
    exchangeToken,
    seller,
    validFromDateInMS,
    validUntilDateInMS,
    redeemableDateInMS,
    fulfillmentPeriodDurationInMS,
    voucherValidDurationInMS,
    ...restArgs
  } = args;

  return {
    id: "0",
    ...restArgs,
    exchangeToken: getAddress(exchangeToken),
    seller: getAddress(seller),
    validFromDate: utils.timestamp.msToSec(validFromDateInMS),
    validUntilDate: utils.timestamp.msToSec(validUntilDateInMS),
    redeemableDate: utils.timestamp.msToSec(redeemableDateInMS),
    fulfillmentPeriodDuration: utils.timestamp.msToSec(
      fulfillmentPeriodDurationInMS
    ),
    voucherValidDuration: utils.timestamp.msToSec(voucherValidDurationInMS)
  };
}
