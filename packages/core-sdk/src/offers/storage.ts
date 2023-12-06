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
  return args.metadataUriOrHash;
}
