import FormData from "form-data";

import { BaseIpfsStorage } from "../../packages/ipfs-storage/src/ipfs/base";

export const PINATA_API_URL = "https://api.pinata.cloud";
export const PINATA_V3_API_URL = "https://api.pinata.cloud/v3";
export const PINATA_UPLOAD_URL = "https://uploads.pinata.cloud/v3/files";

/**
 * Dedicated Pinata gateways, per environment. Carried over from the removed
 * `scripts/pin-to-pinata.ts`.
 */
export const PINATA_GATEWAYS_BY_ENV: Record<string, string[]> = {
  local: [],
  testing: ["https://test-permanent-fly-490.mypinata.cloud/ipfs/"],
  staging: ["https://test-permanent-fly-490.mypinata.cloud/ipfs/"],
  production: ["https://gray-permanent-fly-490.mypinata.cloud/ipfs/"]
};

export const PUBLIC_IPFS_GATEWAYS = [
  "https://ipfs.io/ipfs/",
  "https://dweb.link/ipfs/",
  "https://w3s.link/ipfs/"
];

/**
 * Default read gateway chain: the environment's dedicated Pinata gateway first
 * (already-pinned CIDs resolve immediately), then public gateways.
 *
 * The dedicated gateway is only worth trying with a gateway token - without one
 * it answers 403 for every CID - so pass `hasGatewayToken: false` to leave it
 * out and start from the public gateways.
 */
export function defaultGateways(
  envName: string,
  { hasGatewayToken = true }: { hasGatewayToken?: boolean } = {}
): string[] {
  const dedicated = hasGatewayToken
    ? PINATA_GATEWAYS_BY_ENV[envName] || []
    : [];
  return [...dedicated, ...PUBLIC_IPFS_GATEWAYS];
}

/**
 * Pin-job statuses that will never become `pinned` on their own, so polling can
 * stop early. Anything else (`prechecking`, `searching`, `retrieving`, ...) is
 * treated as still in progress.
 */
const TERMINAL_FAILURE_STATUSES = new Set([
  "expired",
  "over_free_limit",
  "over_max_size",
  "invalid_object",
  "bad_host_node",
  "failed"
]);

export function isTerminalFailureStatus(status: string | undefined): boolean {
  return !!status && TERMINAL_FAILURE_STATUSES.has(status.toLowerCase());
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function backoffMs(attempt: number): number {
  const base = Math.min(60_000, 1_000 * 2 ** attempt);
  return base + Math.floor(Math.random() * 250);
}

function safeJsonParse(text: string): any {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

export type PinataResponse = {
  status: number;
  ok: boolean;
  text: string;
  json: any;
};

export type PinByCidResult = {
  via: "v3" | "legacy" | "none";
  id?: string;
  status?: string;
  alreadyPinned?: boolean;
  /** Pinning by CID is not available to this account at all - see `reason`. */
  unavailable?: boolean;
  reason?: string;
};

/**
 * Pinning an existing CID ("pin by hash") is a paid-plan feature. A free
 * account gets 403 `PAID_FEATURE_ONLY` from the legacy endpoint and 403
 * "This feature is not supported by the current plan type" from v3.
 */
function isPlanRestriction(response: PinataResponse): boolean {
  return (
    response.status === 403 &&
    /paid_feature_only|current plan type|upgrade/i.test(response.text)
  );
}

export type PinataClientOptions = {
  jwt: string;
  maxRetries?: number;
  requestTimeoutMs?: number;
  log?: (message: string) => void;
};

/**
 * Every Pinata HTTP call lives here, so endpoint shapes can be corrected in a
 * single place. Retries 429 and 5xx with exponential backoff, honouring
 * `Retry-After`, and falls back from the v3 API to the legacy API when a v3
 * endpoint is unavailable for the account.
 */
export class PinataClient {
  private readonly jwt: string;
  private readonly maxRetries: number;
  private readonly requestTimeoutMs: number;
  private readonly log: (message: string) => void;

  private v3PinByCidAvailable: boolean | undefined;
  private v3FilesAvailable: boolean | undefined;
  /** Set false once the account is shown to lack the pin-by-CID feature. */
  private pinByCidSupported: boolean | undefined;
  private pinByCidUnsupportedReason: string | undefined;

  constructor(options: PinataClientOptions) {
    this.jwt = options.jwt;
    this.maxRetries = options.maxRetries ?? 4;
    this.requestTimeoutMs = options.requestTimeoutMs ?? 60_000;
    this.log = options.log ?? (() => undefined);
  }

  private async request(
    url: string,
    init: RequestInit = {}
  ): Promise<PinataResponse> {
    let attempt = 0;
    for (;;) {
      let response: Response;
      try {
        response = await fetch(url, {
          ...init,
          headers: {
            Authorization: `Bearer ${this.jwt}`,
            ...((init.headers as Record<string, string>) || {})
          },
          signal: AbortSignal.timeout(this.requestTimeoutMs)
        });
      } catch (error) {
        if (attempt >= this.maxRetries) {
          throw error;
        }
        const waitMs = backoffMs(attempt);
        this.log(
          `  network error (${(error as Error).message}), retrying in ${Math.round(waitMs / 1000)}s`
        );
        attempt++;
        await sleep(waitMs);
        continue;
      }

      if (
        (response.status === 429 || response.status >= 500) &&
        attempt < this.maxRetries
      ) {
        const retryAfter = Number(response.headers.get("retry-after"));
        const waitMs =
          Number.isFinite(retryAfter) && retryAfter > 0
            ? retryAfter * 1_000
            : backoffMs(attempt);
        this.log(
          `  HTTP ${response.status}, retrying in ${Math.round(waitMs / 1000)}s`
        );
        attempt++;
        await sleep(waitMs);
        continue;
      }

      const text = await response.text();
      return {
        status: response.status,
        ok: response.ok,
        text,
        json: safeJsonParse(text)
      };
    }
  }

  /** True when Pinata already holds a pin for this exact CID. */
  public async isPinned(cid: string): Promise<boolean> {
    if (this.v3FilesAvailable !== false) {
      const response = await this.request(
        `${PINATA_V3_API_URL}/files/public?cid=${encodeURIComponent(cid)}&limit=1`
      );
      if (response.ok) {
        this.v3FilesAvailable = true;
        const files = response.json?.data?.files;
        // Only a hit is conclusive. `uploadBytesAsDagPb` pins through the
        // legacy endpoint, and those pins do not always show up in the v3
        // files listing - so an empty page has to fall through to pinList
        // rather than report a successful pin as missing.
        if (Array.isArray(files) && files.length > 0) {
          return true;
        }
      } else if ([400, 401, 403, 404, 405].includes(response.status)) {
        this.v3FilesAvailable = false;
      } else {
        throw new Error(
          `Pinata files lookup failed (${response.status}): ${response.text}`
        );
      }
    }

    const legacy = await this.request(
      `${PINATA_API_URL}/data/pinList?status=pinned&pageLimit=10&hashContains=${encodeURIComponent(cid)}`
    );
    if (!legacy.ok) {
      throw new Error(
        `Pinata pinList lookup failed (${legacy.status}): ${legacy.text}`
      );
    }
    const rows = legacy.json?.rows;
    // `hashContains` is a substring match, so require an exact hit.
    return (
      Array.isArray(rows) && rows.some((row) => row?.ipfs_pin_hash === cid)
    );
  }

  /**
   * Ask Pinata to fetch and pin an existing CID from the IPFS network. The CID
   * is preserved by construction - nothing is re-uploaded.
   */
  public async pinByCid(cid: string, name?: string): Promise<PinByCidResult> {
    // Once the account is known to lack the feature, stop asking - otherwise
    // every CID in the list costs two guaranteed-403 round trips.
    if (this.pinByCidSupported === false) {
      return {
        via: "none",
        unavailable: true,
        reason: this.pinByCidUnsupportedReason
      };
    }

    if (this.v3PinByCidAvailable !== false) {
      const response = await this.request(
        `${PINATA_V3_API_URL}/files/public/pin_by_cid`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ cid, name: name || cid })
        }
      );
      if (response.ok) {
        this.v3PinByCidAvailable = true;
        return {
          via: "v3",
          id: response.json?.data?.id,
          status: response.json?.data?.status
        };
      }
      if (/already/i.test(response.text)) {
        this.v3PinByCidAvailable = true;
        return { via: "v3", alreadyPinned: true, status: "pinned" };
      }
      if (isPlanRestriction(response)) {
        this.v3PinByCidAvailable = false;
        this.log(
          "  v3 pin_by_cid refused by plan, trying the legacy endpoint once"
        );
      } else if ([404, 405, 501].includes(response.status)) {
        this.v3PinByCidAvailable = false;
        this.log("  v3 pin_by_cid unavailable, falling back to legacy API");
      } else {
        throw new Error(
          `Pinata v3 pin_by_cid failed (${response.status}): ${response.text}`
        );
      }
    }

    const legacy = await this.request(`${PINATA_API_URL}/pinning/pinByHash`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        hashToPin: cid,
        pinataMetadata: { name: name || cid }
      })
    });
    if (legacy.ok) {
      this.pinByCidSupported = true;
      return {
        via: "legacy",
        id: legacy.json?.id,
        status: legacy.json?.status
      };
    }
    if (/already/i.test(legacy.text)) {
      this.pinByCidSupported = true;
      return { via: "legacy", alreadyPinned: true, status: "pinned" };
    }
    if (isPlanRestriction(legacy)) {
      // Both routes refused: this account cannot pin by CID at all. Say so
      // once, then let every caller fall straight through to re-uploading.
      this.pinByCidSupported = false;
      this.pinByCidUnsupportedReason =
        legacy.json?.error?.details ||
        legacy.json?.error?.reason ||
        "pin by CID is a paid-plan feature";
      this.log(
        `  pin by CID unavailable on this Pinata plan (${this.pinByCidUnsupportedReason}).\n` +
          "  Falling back to download-and-re-upload for every CID."
      );
      return {
        via: "none",
        unavailable: true,
        reason: this.pinByCidUnsupportedReason
      };
    }
    throw new Error(
      `Pinata pinByHash failed (${legacy.status}): ${legacy.text}`
    );
  }

  /** Current pin-job status for a CID, or `undefined` when no job is queued. */
  public async getPinJobStatus(cid: string): Promise<string | undefined> {
    if (this.v3PinByCidAvailable !== false) {
      const response = await this.request(
        `${PINATA_V3_API_URL}/files/public/pin_by_cid?cid=${encodeURIComponent(cid)}&limit=1`
      );
      if (response.ok) {
        const jobs = response.json?.data?.jobs || response.json?.data?.rows;
        if (Array.isArray(jobs)) {
          return jobs[0]?.status;
        }
      }
    }

    const legacy = await this.request(
      `${PINATA_API_URL}/pinning/pinJobs?ipfs_pin_hash=${encodeURIComponent(cid)}&limit=1`
    );
    if (legacy.ok) {
      const rows = legacy.json?.rows;
      if (Array.isArray(rows)) {
        return rows[0]?.status;
      }
    }
    return undefined;
  }

  /**
   * Poll until the CID shows up as pinned, the pin job fails terminally, or the
   * timeout elapses. "Is it pinned?" is the ground truth, so this works the same
   * against the v3 and legacy APIs.
   */
  public async waitUntilPinned(
    cid: string,
    options: { timeoutMs: number; pollIntervalMs?: number }
  ): Promise<{ pinned: boolean; status?: string }> {
    const deadline = Date.now() + options.timeoutMs;
    const pollIntervalMs = options.pollIntervalMs ?? 3_000;
    let lastStatus: string | undefined;

    for (;;) {
      if (await this.isPinned(cid)) {
        return { pinned: true, status: "pinned" };
      }
      lastStatus = await this.getPinJobStatus(cid);
      if (isTerminalFailureStatus(lastStatus)) {
        return { pinned: false, status: lastStatus };
      }
      if (Date.now() >= deadline) {
        return { pinned: false, status: lastStatus || "timeout" };
      }
      await sleep(pollIntervalMs);
    }
  }

  /**
   * Upload raw bytes to Pinata. Delegates to `BaseIpfsStorage.add()`, which
   * already handles the v3 multipart shape (`file` + `network=public`) and
   * forwards the `Authorization` header.
   */
  public async uploadBytes(bytes: Uint8Array): Promise<string> {
    const storage = new BaseIpfsStorage({
      url: PINATA_UPLOAD_URL,
      headers: { Authorization: `Bearer ${this.jwt}` }
    });
    return storage.add(bytes);
  }

  /**
   * Upload raw bytes as UnixFS dag-pb, yielding the same CIDv0 (`Qm...`) that
   * `ipfs add` produces.
   *
   * This is the CID-preserving upload, and the one to use when re-pinning
   * content that existing references already point at. The v3 `/files`
   * endpoint used by `uploadBytes` stores small files as a single raw block and
   * answers with a CIDv1 raw CID (`bafkrei...`), which is a different address
   * for identical bytes - so every `ipfs://Qm...` link in the subgraph and in
   * react-kit would still fail to resolve. Only the legacy endpoint exposes
   * `cidVersion`.
   */
  public async uploadBytesAsDagPb(
    bytes: Uint8Array,
    name: string
  ): Promise<string> {
    const formData = new FormData();
    formData.append("file", Buffer.from(bytes), { filename: name });
    formData.append("pinataOptions", JSON.stringify({ cidVersion: 0 }));
    formData.append("pinataMetadata", JSON.stringify({ name }));

    const response = await this.request(
      `${PINATA_API_URL}/pinning/pinFileToIPFS`,
      {
        method: "POST",
        headers: formData.getHeaders(),
        // getBuffer() materialises the whole multipart body, which native fetch
        // accepts; a form-data stream does not survive undici.
        body: formData.getBuffer()
      }
    );
    if (!response.ok) {
      throw new Error(
        `Pinata pinFileToIPFS failed (${response.status}): ${response.text}`
      );
    }
    const cid = response.json?.IpfsHash;
    if (!cid) {
      throw new Error(
        `Pinata pinFileToIPFS succeeded but returned no IpfsHash: ${response.text}`
      );
    }
    return cid;
  }
}

export type DownloadResult = {
  bytes: Uint8Array;
  gateway: string;
  /**
   * The CID addresses a UnixFS directory, so `bytes` is the gateway's generated
   * HTML index and NOT the addressed content. Re-uploading it would mint an
   * unrelated CID; a directory can only be re-pinned by preserving its DAG.
   */
  isDirectory: boolean;
};

/**
 * A gateway answers a directory CID by redirecting to a trailing-slash URL and
 * rendering an HTML index. That redirect is the reliable signal - the HTML body
 * itself is not distinguishable from a genuine HTML file.
 */
function looksLikeDirectoryResponse(response: Response): boolean {
  try {
    if (new URL(response.url).pathname.endsWith("/")) {
      return true;
    }
  } catch {
    // fall through to the header check
  }
  return (response.headers.get("x-ipfs-path") || "").endsWith("/");
}

/**
 * Download a CID's content, trying each gateway in order.
 *
 * Dedicated Pinata gateways (`*.mypinata.cloud`) are access-controlled and do
 * NOT accept the API JWT - they want a gateway token, sent as
 * `x-pinata-gateway-token`. Without one they answer 403, which is why the
 * removed `scripts/pin-to-pinata.ts` logged "Failed to check <cid>" for every
 * CID it looked at. A dedicated gateway also only serves content the account
 * has already pinned, so it is a fast hit for existing pins rather than a
 * source for new ones.
 */
export async function downloadFromGateways(
  cid: string,
  gateways: string[],
  options: { timeoutMs?: number; gatewayToken?: string } = {}
): Promise<DownloadResult> {
  const timeoutMs = options.timeoutMs ?? 60_000;
  const errors: string[] = [];

  for (const gateway of gateways) {
    const url = `${gateway.replace(/\/+$/, "")}/${cid}`;
    try {
      const headers: Record<string, string> = {};
      if (
        options.gatewayToken &&
        /\.mypinata\.cloud$/i.test(new URL(url).hostname)
      ) {
        headers["x-pinata-gateway-token"] = options.gatewayToken;
      }
      const response = await fetch(url, {
        headers,
        signal: AbortSignal.timeout(timeoutMs)
      });
      if (!response.ok) {
        errors.push(`${gateway} -> HTTP ${response.status}`);
        continue;
      }
      const bytes = new Uint8Array(await response.arrayBuffer());
      if (bytes.length === 0) {
        errors.push(`${gateway} -> empty response`);
        continue;
      }
      return {
        bytes,
        gateway,
        isDirectory: looksLikeDirectoryResponse(response)
      };
    } catch (error) {
      errors.push(`${gateway} -> ${(error as Error).message}`);
    }
  }

  throw new Error(`Could not download ${cid}: ${errors.join("; ")}`);
}
