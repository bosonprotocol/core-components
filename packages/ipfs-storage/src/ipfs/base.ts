import { create, IPFSHTTPClient, Options } from "ipfs-http-client";
import fetch from "cross-fetch";
import FormData from "form-data";
import { concat, toString } from "uint8arrays";
import { CID } from "multiformats/cid";

/**
 * Read gateway used when the configured `url` is a Pinata upload endpoint and
 * no `gatewayUrl` was supplied. Callers with a dedicated gateway should pass
 * their own.
 */
const DEFAULT_READ_GATEWAY = "https://ipfs.io/ipfs/";

/** Payload shapes the Pinata upload path knows how to turn into a file part. */
type PinataUploadPayload = string | Uint8Array | ArrayBuffer | Blob;

function isPinataUploadPayload(value: unknown): value is PinataUploadPayload {
  return (
    typeof value === "string" ||
    value instanceof Uint8Array ||
    value instanceof ArrayBuffer ||
    (typeof Blob !== "undefined" && value instanceof Blob)
  );
}

async function toBytes(value: PinataUploadPayload): Promise<Uint8Array> {
  if (typeof value === "string") {
    return new TextEncoder().encode(value);
  }
  if (value instanceof Uint8Array) {
    return value;
  }
  if (value instanceof ArrayBuffer) {
    return new Uint8Array(value);
  }
  return new Uint8Array(await value.arrayBuffer());
}

/**
 * Which API the configured `url` speaks. `"pinata"` is Pinata's v3 `/files`
 * upload API and `"pinata-legacy"` its `pinFileToIPFS` route - they disagree
 * about the `network` field on upload and about how a pin is removed - while
 * `"ipfs-api"` is an IPFS HTTP API.
 */
export type IpfsStorageProvider = "ipfs-api" | "pinata" | "pinata-legacy";

/** Pinata's legacy pinning route, the one that takes no `network` field. */
const PINATA_LEGACY_PIN_FILE = "api.pinata.cloud/pinning/pinFileToIPFS";

/** Pinata's v3 upload route. */
const PINATA_V3_UPLOAD = "uploads.pinata.cloud/v3/files";

/**
 * Where Pinata serves everything that is not an upload. Uploads go to
 * `uploads.pinata.cloud`, the CID lookup and the unpin to `api.pinata.cloud`.
 */
const PINATA_API_ORIGIN = "https://api.pinata.cloud";

/** The provider a `url` implies when the caller declared none. */
function sniffProvider(url: string): IpfsStorageProvider {
  if (url.includes(PINATA_LEGACY_PIN_FILE)) {
    return "pinata-legacy";
  }
  return url.includes(PINATA_V3_UPLOAD) ? "pinata" : "ipfs-api";
}

/** Dedicated Pinata gateways are the only ones that take a gateway token. */
function isDedicatedPinataGateway(url: string): boolean {
  try {
    return /\.mypinata\.cloud$/i.test(new URL(url).hostname);
  } catch {
    return false;
  }
}

/** The same CID in two encodings still addresses the same block. */
function isSameCid(a: string, b: string): boolean {
  try {
    return CID.parse(a).toV1().toString() === CID.parse(b).toV1().toString();
  } catch {
    return false;
  }
}

/**
 * Whether a gateway answered with its generated directory index instead of a
 * file's bytes. `ipfsClient.cat()` throws for a directory CID, but a gateway
 * answers 200 with HTML, so without this the index would be handed back as if
 * it were the content.
 *
 * The ETag is the one signal that survives both gateway styles: a file response
 * carries `W/"<cid>"` naming the block served, a generated index carries no CID
 * ETag at all. A trailing slash only means something off a subdomain gateway,
 * which redirects every CID - files included - onto `https://<cid>.ipfs.<host>/`.
 */
function looksLikeDirectoryResponse(response: Response, cid: string): boolean {
  const etag = response.headers.get("etag");
  const taggedCid = etag ? etag.replace(/^W\//i, "").replace(/^"|"$/g, "") : "";
  if (taggedCid && isSameCid(taggedCid, cid)) {
    return false;
  }

  let onSubdomainGateway = false;
  try {
    onSubdomainGateway = /\.ipfs\./i.test(new URL(response.url).hostname);
  } catch {
    // an unparseable (or empty) url keeps the path-gateway reading below
  }

  if (onSubdomainGateway) {
    // A genuine HTML *file* is caught by the ETag above, so HTML the gateway
    // declined to tag with a CID is what a generated index looks like.
    return /^text\/html\b/i.test(response.headers.get("content-type") || "");
  }

  try {
    if (new URL(response.url).pathname.endsWith("/")) {
      return true;
    }
  } catch {
    // fall through to the header check
  }
  return (response.headers.get("x-ipfs-path") || "").endsWith("/");
}

/** Turn a failed Pinata response into an error carrying its body. */
async function pinataError(action: string, response: Response): Promise<Error> {
  const body = await response.text().catch(() => "");
  return new Error(
    `Pinata ${action} failed (${response.status} ${response.statusText}): ${body}`
  );
}

export type BaseIpfsStorageOptions = Options & {
  /**
   * Which kind of endpoint `url` addresses. The two `"pinata"` providers upload
   * over Pinata's HTTP upload API and read back through `gatewayUrl`;
   * `"ipfs-api"` speaks the IPFS HTTP API. Defaults to the matching provider for
   * the two known Pinata upload endpoints and to `"ipfs-api"` otherwise, so any
   * other Pinata route (a proxy in front of it, a future API version) has to be
   * declared here - including which of the two routes it fronts, since nothing
   * about the URL says.
   */
  provider?: IpfsStorageProvider;
  /**
   * Base URL of the Pinata API serving everything that is not an upload: the
   * CID-to-file-id lookup and the unpin itself. Defaults to
   * `https://api.pinata.cloud` for Pinata's own hosts - uploads go to
   * `uploads.pinata.cloud`, the rest does not - and to `url`'s origin otherwise,
   * which is where a proxy fronting Pinata would serve them. Ignored by the
   * `"ipfs-api"` provider.
   */
  apiUrl?: string;
  /**
   * Base URL of an IPFS HTTP gateway to read through, e.g.
   * `https://my-gateway.mypinata.cloud/ipfs/`. A URL with no path gets `/ipfs`
   * appended. Only consulted when `url` is an upload-only endpoint rather than
   * an IPFS HTTP API; wherever `url` can serve reads itself,
   * `ipfsClient.cat()` is preferred.
   */
  gatewayUrl?: string;
  /**
   * Token for a dedicated Pinata gateway (`*.mypinata.cloud`), sent as
   * `x-pinata-gateway-token`. Those gateways reject unauthenticated reads with
   * 403, and they do NOT accept the API JWT. Ignored for any other gateway
   * host, so it is safe to set alongside a public fallback.
   */
  gatewayToken?: string;
};

/**
 * Base IPFS storage. Wraps an `IPFSHTTPClient` for a real IPFS HTTP API, and
 * Pinata's upload API plus a read gateway when `provider` says so.
 */
export class BaseIpfsStorage {
  private readonly clientOpts: Options;
  private readonly url: string;
  private readonly headers?: Headers | Record<string, string>;
  private readonly provider: IpfsStorageProvider;
  private readonly apiUrl?: string;
  private readonly gatewayUrl?: string;
  private readonly gatewayToken?: string;
  private client: IPFSHTTPClient | undefined;

  constructor(opts: BaseIpfsStorageOptions) {
    const { provider, apiUrl, gatewayUrl, gatewayToken, ...clientOpts } = opts;
    this.clientOpts = clientOpts;
    this.url = String(opts.url || "");
    this.headers = opts.headers as Headers | Record<string, string> | undefined;
    this.provider = provider ?? sniffProvider(this.url);
    this.apiUrl = apiUrl;
    this.gatewayUrl = gatewayUrl;
    this.gatewayToken = gatewayToken;
  }

  /**
   * The IPFS HTTP API client, built on first use. On the Pinata path every
   * method routes around it, so a `url` that is not an IPFS API never has to be
   * handed to `create()` at all.
   */
  public get ipfsClient(): IPFSHTTPClient {
    if (!this.client) {
      this.client = create(this.clientOpts);
    }
    return this.client;
  }

  /**
   * Base gateway URL to read through, or `undefined` when `ipfsClient.cat()`
   * can be used directly.
   *
   * `cat()` speaks the IPFS HTTP API, which a Pinata upload endpoint is not, so
   * reads there have to go through a gateway or they fail outright. Everywhere
   * else `cat()` wins even when a `gatewayUrl` was supplied: a self-hosted node
   * serves content no gateway has seen, and callers pass a single gateway value
   * that also has to work for image URLs.
   */
  private getReadGatewayUrl(): string | undefined {
    if (!this.isPinataUpload()) {
      return undefined;
    }
    const gateway = (this.gatewayUrl || DEFAULT_READ_GATEWAY).replace(
      /\/+$/,
      ""
    );
    // A gateway origin on its own serves nothing: the path prefix carries the
    // addressing scheme. Supply the usual one rather than 404 on every read.
    try {
      const parsed = new URL(gateway);
      if (parsed.pathname === "/" || parsed.pathname === "") {
        return `${gateway}/ipfs/`;
      }
    } catch {
      // Not parseable as an absolute URL - leave it exactly as given.
    }
    return `${gateway}/`;
  }

  /** Headers a read through `gatewayUrl` needs, if any. */
  private getGatewayHeaders(gatewayUrl: string): Record<string, string> {
    return this.gatewayToken && isDedicatedPinataGateway(gatewayUrl)
      ? { "x-pinata-gateway-token": this.gatewayToken }
      : {};
  }

  public async add(value: Parameters<IPFSHTTPClient["add"]>[0]) {
    if (this.isPinataUpload()) {
      return this.addToPinata(value);
    }

    const addResult = await this.ipfsClient.add(value, {
      pin: true
    });
    const cid = addResult.cid.toString();
    return cid;
  }

  /**
   * Remove a pin, over whichever API `provider` names. Unpinning a CID the
   * account no longer holds succeeds rather than throwing, so a half-finished
   * removal can be retried.
   */
  public async unpin(cid: string): Promise<void> {
    if (!this.isPinataUpload()) {
      await this.ipfsClient.pin.rm(cid);
      return;
    }
    if (this.provider === "pinata-legacy") {
      await this.unpinFromPinataLegacy(cid);
      return;
    }
    await this.unpinFromPinataV3(cid);
  }

  /** The legacy route unpins by CID directly. */
  private async unpinFromPinataLegacy(cid: string): Promise<void> {
    const response = await fetch(
      `${this.getPinataApiUrl()}/pinning/unpin/${encodeURIComponent(cid)}`,
      { method: "DELETE", headers: this.getPinataAuthHeaders() }
    );
    if (!response.ok && response.status !== 404) {
      throw await pinataError(`unpin of ${cid}`, response);
    }
  }

  /**
   * The v3 API deletes by file id rather than by CID, so the id has to be
   * looked up first. One CID can back several file records - the same bytes
   * uploaded twice - and leaving any of them behind leaves the content pinned.
   */
  private async unpinFromPinataV3(cid: string): Promise<void> {
    const apiUrl = this.getPinataApiUrl();
    const headers = this.getPinataAuthHeaders();
    const listResponse = await fetch(
      `${apiUrl}/v3/files/public?cid=${encodeURIComponent(cid)}`,
      { headers }
    );
    if (!listResponse.ok) {
      throw await pinataError(`file lookup for ${cid}`, listResponse);
    }

    const payload = (await listResponse.json()) as {
      data?: { files?: { id?: string }[] };
    };
    const ids = (payload?.data?.files || [])
      .map((file) => file?.id)
      .filter((id): id is string => !!id);

    for (const id of ids) {
      const response = await fetch(
        `${apiUrl}/v3/files/public/${encodeURIComponent(id)}`,
        { method: "DELETE", headers }
      );
      if (!response.ok && response.status !== 404) {
        throw await pinataError(`unpin of ${cid} (file ${id})`, response);
      }
    }
  }

  /** Where the Pinata routes that are not uploads live. See `apiUrl`. */
  private getPinataApiUrl(): string {
    if (this.apiUrl) {
      return this.apiUrl.replace(/\/+$/, "");
    }
    try {
      const { origin, hostname } = new URL(this.url);
      return /(^|\.)pinata\.cloud$/i.test(hostname)
        ? PINATA_API_ORIGIN
        : origin;
    } catch {
      return PINATA_API_ORIGIN;
    }
  }

  /** The credentials `url` was configured with, as request headers. */
  private getPinataAuthHeaders(): Record<string, string> {
    const auth = this.getAuthHeaderValue();
    return auth ? { Authorization: auth } : {};
  }

  private isPinataUpload() {
    return this.provider === "pinata" || this.provider === "pinata-legacy";
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
    if (!isPinataUploadPayload(value)) {
      throw new Error(
        "Unsupported Pinata upload payload for BaseIpfsStorage.add(). Use string, Uint8Array, ArrayBuffer, Blob or File"
      );
    }

    const isBlob = typeof Blob !== "undefined" && value instanceof Blob;
    const filename =
      (typeof File !== "undefined" && value instanceof File && value.name) ||
      "file";
    const contentType = (isBlob && (value as Blob).type) || undefined;

    const formData = new FormData();
    // `form-data` declares `"browser": "./lib/browser"` in its package.json, so
    // bundlers hand us the native `FormData` instead. That one has no
    // `getHeaders()` and takes the filename as a plain string, so branch on the
    // capability rather than on the environment.
    const isNodeFormData =
      typeof (formData as unknown as { getHeaders?: unknown }).getHeaders ===
      "function";

    if (isNodeFormData) {
      formData.append("file", Buffer.from(await toBytes(value)), {
        filename,
        contentType
      });
    } else {
      const blob = isBlob
        ? (value as Blob)
        : new Blob(
            [await toBytes(value)],
            contentType ? { type: contentType } : {}
          );
      formData.append("file", blob, filename);
    }

    // The legacy pinning route takes no `network`; the v3 `/files` one requires
    // it. Which of the two a proxy fronts is what `provider` declares.
    if (this.provider === "pinata") {
      formData.append("network", "public");
    }

    const response = await fetch(this.url, {
      method: "POST",
      headers: {
        // Only the node implementation can name its own boundary. The browser
        // must be left to set `content-type` itself, or the boundary in the
        // header will not match the one in the body.
        ...(isNodeFormData
          ? (
              formData as unknown as {
                getHeaders(): Record<string, string>;
              }
            ).getHeaders()
          : {}),
        ...this.getPinataAuthHeaders()
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
  /**
   * Fetch a CID's bytes, through the IPFS HTTP API when one is configured and
   * through a gateway otherwise.
   */
  private async readByCID(cid: string): Promise<Uint8Array> {
    const gatewayUrl = this.getReadGatewayUrl();
    if (gatewayUrl) {
      const response = await fetch(`${gatewayUrl}${cid}`, {
        headers: this.getGatewayHeaders(gatewayUrl)
      });
      if (!response.ok) {
        throw new Error(
          `Failed to fetch ${cid} from ${gatewayUrl} (${response.status} ${response.statusText})`
        );
      }
      if (looksLikeDirectoryResponse(response, cid)) {
        throw new Error(
          `Failed to fetch ${cid} from ${gatewayUrl}: it resolves to a directory, and the gateway served its index instead of the file content`
        );
      }
      return new Uint8Array(await response.arrayBuffer());
    }

    const chunks: Uint8Array[] = [];
    for await (const chunk of this.ipfsClient.cat(cid)) {
      chunks.push(chunk as Uint8Array);
    }
    return concat(chunks);
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
    const data = await this.readByCID(cid);
    if (!asJson && asBlob) {
      // Copy into an ArrayBuffer-backed view. Blob does not accept a possibly
      // SharedArrayBuffer-backed one, and going through Buffer instead would
      // make this Node-only.
      const bytes = new Uint8Array(data.byteLength);
      bytes.set(data);
      return new Blob([bytes]);
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
