import { create, IPFSHTTPClient, Options } from "ipfs-http-client";
import fetch from "cross-fetch";
import { concat, toString } from "uint8arrays";
import { CID } from "multiformats/cid";
import { DEFAULT_THE_GRAPH_IPFS_URL } from "../constants";

export class BaseIpfsStorage {
  public ipfsClient: IPFSHTTPClient;

  constructor(opts: Options) {
    this.ipfsClient = create(opts);
  }

  static fromTheGraphIpfsUrl(theGraphIpfsUrl?: string) {
    return new BaseIpfsStorage({
      url: theGraphIpfsUrl || DEFAULT_THE_GRAPH_IPFS_URL
    });
  }

  public async add(value: Parameters<IPFSHTTPClient["add"]>[0]) {
    const addResult = await this.ipfsClient.add(value, {
      pin: true
    });
    const cid = addResult.cid.toString();
    return cid;
  }

  public async get<T>(uriOrHash: string, asJson = true): Promise<T | string> {
    let cid: CID = null;
    try {
      cid = CID.parse(
        uriOrHash.startsWith("ipfs://")
          ? uriOrHash.split("ipfs://")[1]
          : uriOrHash
      );
    } catch (error) {
      // if parsing fails, we assume it is a url
    }

    const value = await (cid
      ? this.getByCID<T>(cid.toString(), asJson)
      : this.getByURL<T>(uriOrHash, asJson));
    return value;
  }

  public async getByCID<T>(cid: string, asJson = true): Promise<T | string> {
    const chunks = [];
    for await (const chunk of this.ipfsClient.cat(cid)) {
      chunks.push(chunk);
    }
    const data = concat(chunks);
    const dataStr = toString(data);
    if (!asJson) {
      return dataStr;
    }
    return JSON.parse(dataStr);
  }

  public async getByURL<T>(url: string, asJson = true): Promise<T | string> {
    const response = await fetch(url);

    if (!asJson) {
      return response.text();
    }
    return response.json();
  }
}
