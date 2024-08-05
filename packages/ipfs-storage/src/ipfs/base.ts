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

  public async get<T>(
    uriOrHash: string,
    asJson = true,
    asBlob = false
  ): Promise<T | string | Blob | Uint8Array> {
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
      ? this.getByCID<T>(cid.toString(), asJson, asBlob)
      : this.getByURL<T>(uriOrHash, asJson, asBlob));
    return value;
  }
  public async getByCID<T>(
    cid: string,
    asJson: true,
    asBlob: false
  ): Promise<T>;
  public async getByCID(
    cid: string,
    asJson: false,
    asBlob: true
  ): Promise<Blob>;
  public async getByCID(
    cid: string,
    asJson: false,
    asBlob: false
  ): Promise<Uint8Array>;
  public async getByCID<T>(
    cid: string,
    asJson: boolean,
    asBlob: boolean
  ): Promise<Uint8Array | Blob | T>;
  public async getByCID<T>(
    cid: string,
    asJson = true,
    asBlob = false
  ): Promise<Uint8Array | Blob | T> {
    const chunks = [];
    for await (const chunk of this.ipfsClient.cat(cid)) {
      chunks.push(chunk);
    }
    const data = concat(chunks);
    if (!asJson && asBlob) {
      return new Blob([data]);
    } else if (!asJson) {
      return data;
    }
    const dataStr = toString(data);
    return JSON.parse(dataStr) as T;
  }
  public async getByURL<T>(
    url: string,
    asJson: true,
    asBlob: false
  ): Promise<T>;
  public async getByURL(
    url: string,
    asJson: false,
    asBlob: true
  ): Promise<Blob>;
  public async getByURL(
    url: string,
    asJson: false,
    asBlob: false
  ): Promise<string>;
  public async getByURL<T>(
    url: string,
    asJson: boolean,
    asBlob: boolean
  ): Promise<string | Blob | T>;
  public async getByURL<T>(
    url: string,
    asJson = true,
    asBlob = false
  ): Promise<string | Blob | T> {
    const response = await fetch(url);
    if (!asJson && asBlob) {
      return response.blob();
    } else if (!asJson) {
      return response.text();
    }
    return response.json() as T;
  }
}
