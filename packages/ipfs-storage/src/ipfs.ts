import { Metadata, MetadataStorage } from "@bosonprotocol/common";
import { create, IPFSHTTPClient, Options } from "ipfs-http-client";
import fetch from "cross-fetch";
import { concat, toString } from "uint8arrays";
import { CID } from "multiformats/cid";

export class IpfsMetadata implements MetadataStorage {
  private _ipfsClient: IPFSHTTPClient;

  constructor(opts: Options) {
    this._ipfsClient = create(opts);
  }

  public async storeMetadata(metadata: Metadata): Promise<string> {
    // TODO: order keys of metadata?
    const addResult = await this._ipfsClient.add(JSON.stringify(metadata), {
      pin: true
    });
    const cid = addResult.cid.toString();
    return cid;
  }

  public async getMetadata(metadataUri: string): Promise<Metadata> {
    if (CID.isCID(metadataUri)) {
      return this.getMetadataByCID(metadataUri);
    }

    return this.getMetadataByUrl(metadataUri);
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
