import { MetadataStorage } from "@bosonprotocol/common";

/**
 * We use the feature `ipfsOnEthereum` in our subgraph to resolve metadata from IPFS
 * and store them in the graph. In order for the graph node to reliably resolve them,
 * we need to add the metadata additionally to the IPFS node of the graph.
 * See https://thegraph.com/docs/en/developer/assemblyscript-api/#ipfs-api
 */
export async function storeMetadataOnTheGraph(args: {
  metadataUriOrHash: string;
  metadataStorage?: MetadataStorage;
  theGraphStorage?: MetadataStorage;
}): Promise<string | null> {
  console.log("[storeMetadataOnTheGraph]before if, args", args);

  if (args.metadataStorage && args.theGraphStorage) {
    console.log("[storeMetadataOnTheGraph]before getMetadata, args", args);
    const metadata = await args.metadataStorage.getMetadata(
      args.metadataUriOrHash
    );
    console.log(
      "[storeMetadataOnTheGraph]before storeMetadata, metadata",
      metadata
    );
    const metadataUri = await args.theGraphStorage.storeMetadata(metadata);
    console.log(
      "[storeMetadataOnTheGraph]before return, metadataUri",
      metadataUri
    );
    return metadataUri;
  }

  return null;
}
