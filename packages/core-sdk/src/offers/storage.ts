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
  if (args.metadataStorage && args.theGraphStorage) {
    const metadata = await args.metadataStorage.getMetadata(
      args.metadataUriOrHash
    );

    const metadataUri = await args.theGraphStorage.storeMetadata(metadata);
    return metadataUri;
  }

  return null;
}
