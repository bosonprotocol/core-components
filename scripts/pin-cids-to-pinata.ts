import fs from "fs";
import path from "path";

import { program } from "commander";

import { EnvironmentType } from "../packages/common/src/types/configs";
import { isRawBlockCid, normalizeCid, readCidListFile } from "./utils/ipfs";
import {
  PinataClient,
  defaultGateways,
  downloadFromGateways,
  isTerminalFailureStatus
} from "./utils/pinata";

type Outcome =
  | "already"
  | "pinned"
  | "queued"
  | "uploaded"
  | "cid-mismatch"
  | "directory"
  | "unreachable"
  | "failed"
  | "dry-run";

type Result = {
  cid: string;
  outcome: Outcome;
  detail?: string;
  /** Why the CID-preserving pin-by-hash route did not settle it, if it didn't. */
  pinByCid?: string;
};

const ENVIRONMENTS: EnvironmentType[] = [
  "local",
  "testing",
  "staging",
  "production"
];

program
  .description(
    "Make Pinata pin every CID in an environment's list, preferring pinByHash so the CID is preserved."
  )
  .requiredOption("-e, --env <ENV_NAME>", "Target environment")
  .option(
    "-i, --input <FILE>",
    "CID list file (default data/ipfs-cids/<env>.txt)"
  )
  .option(
    "-p, --pinata <PINATA_JWT>",
    "Pinata JWT (defaults to the PINATA_JWT environment variable)"
  )
  .option(
    "-g, --gateway <URL>",
    "Read gateway to download from; repeatable, overrides the defaults",
    (value: string, previous: string[]) => [...previous, value],
    [] as string[]
  )
  .option(
    "--gateway-token <TOKEN>",
    "Pinata dedicated gateway token (defaults to PINATA_GATEWAY_TOKEN); without it *.mypinata.cloud answers 403"
  )
  .option("--concurrency <N>", "CIDs processed in parallel", "4")
  .option(
    "--pin-timeout <SEC>",
    "Seconds to wait for a pin job to settle",
    "180"
  )
  .option("--limit <N>", "Only process the first N CIDs")
  .option(
    "--no-upload-fallback",
    "Do not download and re-upload CIDs that pinByHash could not fetch"
  )
  .option("--report <FILE>", "JSON report path")
  .option("--dry-run", "List what would be pinned without calling Pinata")
  .parse(process.argv);

async function runWithConcurrency<T>(
  items: T[],
  limit: number,
  worker: (item: T, index: number) => Promise<void>
): Promise<void> {
  let cursor = 0;
  const runners = Array.from(
    { length: Math.max(1, Math.min(limit, items.length)) },
    async () => {
      for (;;) {
        const index = cursor++;
        if (index >= items.length) {
          return;
        }
        await worker(items[index], index);
      }
    }
  );
  await Promise.all(runners);
}

async function processCid(
  cid: string,
  client: PinataClient,
  options: {
    gateways: string[];
    gatewayToken?: string;
    pinTimeoutMs: number;
    uploadFallback: boolean;
  }
): Promise<Result> {
  if (await client.isPinned(cid)) {
    return { cid, outcome: "already" };
  }

  let pinJobStatus: string | undefined;
  try {
    const pinRequest = await client.pinByCid(cid);
    if (pinRequest.alreadyPinned) {
      return { cid, outcome: "already" };
    }
    if (pinRequest.unavailable) {
      // The account cannot pin by CID; go straight to re-uploading the bytes.
      pinJobStatus = `pin-by-CID unavailable: ${pinRequest.reason}`;
    } else {
      const waited = await client.waitUntilPinned(cid, {
        timeoutMs: options.pinTimeoutMs
      });
      if (waited.pinned) {
        return { cid, outcome: "pinned", detail: `via ${pinRequest.via}` };
      }
      pinJobStatus = waited.status;
    }
  } catch (error) {
    pinJobStatus = (error as Error).message.split("\n")[0];
  }

  if (!options.uploadFallback) {
    return {
      cid,
      outcome: isTerminalFailureStatus(pinJobStatus) ? "failed" : "queued",
      detail: pinJobStatus
    };
  }

  let bytes: Uint8Array;
  let gateway: string;
  try {
    const downloaded = await downloadFromGateways(cid, options.gateways, {
      gatewayToken: options.gatewayToken
    });
    if (downloaded.isDirectory) {
      // The gateway rendered an HTML index; the directory's own DAG is what
      // would have to be re-pinned, and only pin-by-CID can do that.
      return {
        cid,
        outcome: "directory",
        detail:
          "UnixFS directory - cannot be reconstructed from a gateway download; needs pin-by-CID",
        pinByCid: pinJobStatus
      };
    }
    bytes = downloaded.bytes;
    gateway = downloaded.gateway;
  } catch (error) {
    return {
      cid,
      outcome: "unreachable",
      detail: `pinByHash: ${pinJobStatus}; ${(error as Error).message}`
    };
  }

  // Match the original codec, or the re-upload mints a different address for
  // identical bytes and the original reference stays broken. The v3 /files
  // endpoint stores a small file as one raw block (`bafkrei...`); the legacy
  // endpoint with cidVersion 0 produces UnixFS dag-pb (`Qm...`).
  const uploadedCid = isRawBlockCid(cid)
    ? await client.uploadBytes(bytes)
    : await client.uploadBytesAsDagPb(bytes, cid);
  if (normalizeCid(uploadedCid) === normalizeCid(cid)) {
    return {
      cid,
      outcome: "uploaded",
      detail: `${bytes.length} bytes from ${gateway}`,
      pinByCid: pinJobStatus
    };
  }
  return {
    cid,
    outcome: "cid-mismatch",
    detail: `re-upload produced ${uploadedCid}; the original reference is still unresolvable`
  };
}

async function main() {
  const opts = program.opts();
  const envName = opts.env as EnvironmentType;
  if (!ENVIRONMENTS.includes(envName)) {
    throw new Error(
      `Invalid --env "${opts.env}". Expected one of: ${ENVIRONMENTS.join(", ")}`
    );
  }

  const inputPath = path.resolve(opts.input || `data/ipfs-cids/${envName}.txt`);
  const reportPath = path.resolve(
    opts.report || `data/ipfs-cids/${envName}.pin-report.json`
  );
  const concurrency = parseInt(opts.concurrency, 10);
  if (isNaN(concurrency) || concurrency < 1) {
    throw new Error(`Invalid value provided to --concurrency option`);
  }
  const pinTimeoutSec = parseInt(opts.pinTimeout, 10);
  if (isNaN(pinTimeoutSec) || pinTimeoutSec < 1) {
    throw new Error(`Invalid value provided to --pin-timeout option`);
  }

  if (!fs.existsSync(inputPath)) {
    throw new Error(
      `CID list not found: ${inputPath}. Run "npm run collect-ipfs-cids -- -c <configId>" first.`
    );
  }
  let cids = readCidListFile(inputPath);
  if (opts.limit) {
    const limit = parseInt(opts.limit, 10);
    if (isNaN(limit) || limit < 1) {
      throw new Error(`Invalid value provided to --limit option`);
    }
    cids = cids.slice(0, limit);
  }

  const gatewayToken = opts.gatewayToken || process.env.PINATA_GATEWAY_TOKEN;
  // Without a token the environment's dedicated gateway answers 403 for every
  // CID, so leave it out rather than spend a round trip per CID on it.
  const gateways: string[] = opts.gateway?.length
    ? opts.gateway
    : defaultGateways(envName, { hasGatewayToken: !!gatewayToken });

  console.log(`environment: ${envName}`);
  console.log(`input:       ${inputPath}`);
  console.log(`CIDs:        ${cids.length}`);
  console.log(`gateways:    ${gateways.join(", ") || "(none)"}\n`);

  if (opts.dryRun) {
    cids.forEach((cid, index) =>
      console.log(`[${index + 1}/${cids.length}] ${cid} would be pinned`)
    );
    console.log(`\n--dry-run: ${cids.length} CIDs would be processed`);
    return 0;
  }

  const jwt = opts.pinata || process.env.PINATA_JWT;
  if (!jwt) {
    throw new Error(
      "No Pinata JWT provided. Pass --pinata <JWT> or set PINATA_JWT."
    );
  }
  if (!gatewayToken) {
    console.warn(
      "No --gateway-token / PINATA_GATEWAY_TOKEN set: reading through public gateways only."
    );
  }

  const client = new PinataClient({ jwt });
  const results: Result[] = [];

  await runWithConcurrency(cids, concurrency, async (cid, index) => {
    let result: Result;
    try {
      result = await processCid(cid, client, {
        gateways,
        gatewayToken,
        pinTimeoutMs: pinTimeoutSec * 1_000,
        uploadFallback: opts.uploadFallback !== false
      });
    } catch (error) {
      result = {
        cid,
        outcome: "failed",
        detail: (error as Error).message.split("\n")[0]
      };
    }
    results.push(result);
    const icon =
      result.outcome === "already"
        ? "📌"
        : result.outcome === "pinned" || result.outcome === "uploaded"
          ? "✅"
          : result.outcome === "queued"
            ? "⏳"
            : "❌";
    console.log(
      `[${index + 1}/${cids.length}] ${cid} ${icon} ${result.outcome}${
        result.detail ? ` - ${result.detail}` : ""
      }`
    );
  });

  const summary = results.reduce<Record<string, number>>((acc, result) => {
    acc[result.outcome] = (acc[result.outcome] || 0) + 1;
    return acc;
  }, {});

  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(
    reportPath,
    JSON.stringify(
      {
        env: envName,
        updatedAt: new Date().toISOString(),
        input: inputPath,
        total: results.length,
        summary,
        results: [...results].sort((a, b) => a.cid.localeCompare(b.cid))
      },
      null,
      2
    ) + "\n",
    "utf-8"
  );

  console.log(`\nReport: ${reportPath}`);
  console.log(
    Object.entries(summary)
      .map(([outcome, count]) => `${outcome}: ${count}`)
      .join(", ")
  );

  const problems = results.filter((result) =>
    ["cid-mismatch", "directory", "unreachable", "failed"].includes(
      result.outcome
    )
  );
  if (problems.length) {
    console.warn(
      `\nWARNING: ${problems.length} CID(s) are still not usable on Pinata. See the report.`
    );
    return 1;
  }

  return 0;
}

main()
  .then((exitCode) => {
    console.log("\ndone");
    process.exit(exitCode);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
