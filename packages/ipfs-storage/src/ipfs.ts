import { utils, MetadataStorage, AnyMetadata } from "@bosonprotocol/common";
import { create, IPFSHTTPClient, Options } from "ipfs-http-client";
import fetch from "cross-fetch";
import { concat, toString } from "uint8arrays";
import { CID } from "multiformats/cid";
import { validateMetadata } from "./validation";
import { DEFAULT_THE_GRAPH_IPFS_URL } from "./constants";
import {
  convertFromERC721Metadata,
  convertToERC721Metadata,
  ERC721Metadata
} from "./utils";

export class IpfsMetadata implements MetadataStorage {
  public ipfsClient: IPFSHTTPClient;

  constructor(opts: Options) {
    this.ipfsClient = create(opts);
  }

  static fromTheGraphIpfsUrl(theGraphIpfsUrl?: string) {
    return new IpfsMetadata({
      url: theGraphIpfsUrl || DEFAULT_THE_GRAPH_IPFS_URL
    });
  }

  public async storeMetadata(metadata: AnyMetadata): Promise<string> {
    validateMetadata(metadata);
    const metadataConformingToERC721 = convertToERC721Metadata(metadata);
    const metadataWithSortedKeys = utils.metadata.sortObjKeys(
      metadataConformingToERC721
    );
    const cid = await this.add(metadataWithSortedKeys);
    return cid;
  }

  public async getMetadata(metadataUriOrHash: string): Promise<AnyMetadata> {
    const metadataConformingToERC721 = await this.get<ERC721Metadata>(
      metadataUriOrHash
    );
    const metadata = convertFromERC721Metadata(metadataConformingToERC721);
    validateMetadata(metadata);

    return metadata;
  }

  public async add(value: Record<string, unknown>) {
    const addResult = await this.ipfsClient.add(JSON.stringify(value), {
      pin: true
    });
    const cid = addResult.cid.toString();
    return cid;
  }

  public async get<T>(uriOrHash: string): Promise<T> {
    let cid: CID = null;
    try {
      cid = CID.parse(uriOrHash);
    } catch (error) {
      // if parsing fails, we assume it is a url
    }

    const value = await (cid
      ? this.getByCID<T>(cid.toString())
      : this.getByURL<T>(uriOrHash));
    return value;
  }

  public async getByCID<T>(cid: string): Promise<T> {
    const chunks = [];
    for await (const chunk of this.ipfsClient.cat(cid)) {
      chunks.push(chunk);
    }
    const data = concat(chunks);
    const parsed = JSON.parse(toString(data));
    return parsed;
  }

  public async getByURL<T>(url: string): Promise<T> {
    const response = await fetch(url);

    const parsed = await response.json();
    return parsed;
  }
}
