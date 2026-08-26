import { create, IPFSHTTPClient, Options } from "ipfs-http-client";
import fetch from "cross-fetch";
import FormData from "form-data";
import { concat, toString } from "uint8arrays";
import { CID } from "multiformats/cid";

/**
 * Base IPFS storage class that wraps an instance of `IPFSHTTPClient`.
 */
export class BaseIpfsStorage {
  public ipfsClient: IPFSHTTPClient;
  private readonly url: string;
  private readonly headers?: Headers | Record<string, string>;

  constructor(opts: Options) {
    this.ipfsClient = create(opts);
    this.url = String(opts.url || "");
    this.headers = opts.headers as Headers | Record<string, string> | undefined;
  }

  public async add(value: Parameters<IPFSHTTPClient["add"]>[0]) {
    if (this.isPinataUploadEndpoint()) {
      return this.addToPinata(value);
    }

    const addResult = await this.ipfsClient.add(value, {
      pin: true
    });
    const cid = addResult.cid.toString();
    return cid;
  }

  private isPinataUploadEndpoint() {
    return (
      this.url.includes("uploads.pinata.cloud/v3/files") ||
      this.url.includes("api.pinata.cloud/pinning/pinFileToIPFS")
    );
  }

  private getAuthHeaderValue() {
    const headers = this.headers;
    if (!headers) {
      return undefined;
    }

    if (typeof (headers as Headers).get === "function") {
      const auth = (headers as Headers).get("authorization");
      return auth || undefined;
    }

    const normalized = Object.entries(headers).reduce<Record<string, string>>(
      (acc, [key, value]) => {
        acc[key.toLowerCase()] = value;
        return acc;
      },
      {}
    );
    return normalized.authorization;
  }

  private async addToPinata(value: Parameters<IPFSHTTPClient["add"]>[0]) {
    if (!(typeof value === "string" || value instanceof Uint8Array)) {
      throw new Error(
        "Unsupported Pinata upload payload for BaseIpfsStorage.add(). Use string or Uint8Array"
      );
    }

    const formData = new FormData();
    const content =
      typeof value === "string" ? Buffer.from(value) : Buffer.from(value);
    formData.append("file", content, {
      filename: "file"
    });

    if (this.url.includes("uploads.pinata.cloud/v3/files")) {
      formData.append("network", "public");
    }

    const auth = this.getAuthHeaderValue();
    const response = await fetch(this.url, {
      method: "POST",
      headers: {
        ...formData.getHeaders(),
        ...(auth ? { Authorization: auth } : {})
      },
      body: formData as unknown as BodyInit
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Pinata upload failed (${response.status} ${response.statusText}): ${errorBody}`
      );
    }

    const payload = (await response.json()) as {
      data?: { cid?: string };
      cid?: string;
      IpfsHash?: string;
    };
    const cid = payload?.data?.cid || payload?.cid || payload?.IpfsHash;
    if (!cid) {
      throw new Error(
        "Pinata upload succeeded but response did not include a CID"
      );
    }

    return cid;
  }

  public async get<T>(
    uriOrHash: string,
    asJson = true,
    asBlob = false
  ): Promise<T | string | Blob | Uint8Array> {
    if (!uriOrHash || typeof uriOrHash !== "string") {
      throw new Error("Invalid input: uriOrHash must be a non-empty string");
    }

    let cid: CID | null = null;
    const isIpfsUri = uriOrHash.startsWith("ipfs://");
    const hasProtocol = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(uriOrHash);

    // Extract CID from ipfs:// URI or raw CID with path
    let cidString: string;
    if (isIpfsUri) {
      cidString = uriOrHash.split("ipfs://")[1].split("/")[0]; // Get just the CID part before any path
    } else if (!hasProtocol) {
      // For inputs without protocol, try to extract CID from potential path like "QmHash/path/to/file"
      cidString = uriOrHash.split("/")[0];
    } else {
      cidString = uriOrHash; // URLs with protocols are parsed as-is (will fail CID parsing as expected)
    }

    try {
      cid = CID.parse(cidString);
    } catch (error) {
      if (isIpfsUri) {
        // If it's an ipfs:// URI but CID parsing fails, throw error
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        throw new Error(
          `Invalid IPFS URI: ${uriOrHash}. CID parsing failed: ${errorMessage}`
        );
      } else if (!hasProtocol) {
        // If it has no protocol and is not a valid CID, throw error
        // This prevents invalid hashes from being treated as URLs
        throw new Error(
          `Invalid input: ${uriOrHash} is neither a valid CID nor a valid URL`
        );
      }
      // If it's an HTTP URI and CID parsing fails, that's expected - fall through to getByURL
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
    const chunks: Uint8Array[] = [];
    for await (const chunk of this.ipfsClient.cat(cid)) {
      chunks.push(chunk as Uint8Array);
    }
    const data = concat(chunks);
    if (!asJson && asBlob) {
      return new Blob([Buffer.from(data)]);
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
