import { CreateOfferArgs, MetadataStorage } from "@bosonprotocol/common";
import { storeMetadataOnTheGraph } from "../offers/storage";
import { bundle } from "..";

export async function storeMetadataItems(args: {
  createOffersArgs: CreateOfferArgs[];
  metadataStorage?: MetadataStorage;
  theGraphStorage?: MetadataStorage;
}) {
  await Promise.all(
    args.createOffersArgs.map(async (offerToCreate) => {
      const offerMetadata = await args.metadataStorage?.getMetadata(
        offerToCreate.metadataUri
      );
      if (offerMetadata?.type === "BUNDLE") {
        await Promise.all(
          (offerMetadata as bundle.BundleMetadata).items.map((item) => {
            return storeMetadataOnTheGraph({
              metadataUriOrHash: item.url,
              metadataStorage: args.metadataStorage,
              theGraphStorage: args.theGraphStorage
            });
          })
        );
      }
    })
  );
}
