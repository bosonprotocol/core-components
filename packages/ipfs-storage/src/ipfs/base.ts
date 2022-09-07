import { create, IPFSHTTPClient, Options } from "ipfs-http-client";
import fetch from "cross-fetch";
import { concat, toString } from "uint8arrays";
import { CID } from "multiformats/cid";

/**
 * Base IPFS storage class that wraps an instance of `IPFSHTTPClient`.
 */
export class BaseIpfsStorage {
  public ipfsClient: IPFSHTTPClient;

  constructor(opts: Options) {
    this.ipfsClient = create(opts);
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
    if (!asJson) {
      return data as unknown as T;
    }
    const dataStr = toString(data);
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
