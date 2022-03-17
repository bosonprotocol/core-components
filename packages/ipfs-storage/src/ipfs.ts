import { utils, Metadata, MetadataStorage } from "@bosonprotocol/common";
import { create, IPFSHTTPClient, Options } from "ipfs-http-client";
import fetch from "cross-fetch";
import { concat, toString } from "uint8arrays";
import { CID } from "multiformats/cid";
import { DEFAULT_THE_GRAPH_IPFS_URL } from "./constants";

export class IpfsMetadata implements MetadataStorage {
  private _ipfsClient: IPFSHTTPClient;

  constructor(opts: Options) {
    this._ipfsClient = create(opts);
  }

  static fromTheGraphIpfsUrl(theGraphIpfsUrl?: string) {
    return new IpfsMetadata({
      url: theGraphIpfsUrl || DEFAULT_THE_GRAPH_IPFS_URL
    });
  }

  public async storeMetadata(metadata: Metadata): Promise<string> {
    // TODO: validate metadata
    const metadataWithSortedKeys = utils.metadata.sortObjKeys(metadata);
    const addResult = await this._ipfsClient.add(
      JSON.stringify(metadataWithSortedKeys),
      { pin: true }
    );
    const cid = addResult.cid.toString();
    return cid;
  }

  public async getMetadata(metadataUriOrHash: string): Promise<Metadata> {
    let cid: CID = null;
    try {
      cid = CID.parse(metadataUriOrHash);
    } catch (error) {
      // if parsing fails, we assume it is a url
    }

    if (cid) {
      return this.getMetadataByCID(cid.toString());
    }
    return this.getMetadataByUrl(metadataUriOrHash);
  }

  public async getMetadataByCID(cid: string): Promise<Metadata> {
    const chunks = [];
    for await (const chunk of this._ipfsClient.cat(cid)) {
      chunks.push(chunk);
    }
    const data = concat(chunks);
    const metadata = JSON.parse(toString(data));

    // TODO: validate metadata
    return metadata;
  }

  public async getMetadataByUrl(metadataUrl: string): Promise<Metadata> {
    const response = await fetch(metadataUrl);

    const metadata = await response.json();

    // TODO: validate metadata
    return metadata;
  }
}
