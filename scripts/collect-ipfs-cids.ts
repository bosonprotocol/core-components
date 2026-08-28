import fs from "fs";
import path from "path";

import { program } from "commander";
import { GraphQLClient } from "graphql-request";

// Imported from source, NOT from "@bosonprotocol/common" / "../packages/core-sdk/src":
// those resolve through the package `main` to `packages/common/dist`, which is a
// stale build whose subgraph URLs predate the goldsky migration.
import { getConfigFromConfigId } from "../packages/common/src/configs";
import { ConfigId } from "../packages/common/src/types/configs";
import {
  extractCid,
  parseSeedFile,
  readCidListFile,
  writeCidListFile
} from "./utils/ipfs";

/**
 * One subgraph root query field to sweep.
 *
 * `altRoots` covers graph-node's colliding-plural rename: an entity whose
 * pluralised name equals its singular name is exposed as `<name>_collection`.
 * Which spelling a deployment uses depends on its graph-node version, so both
 * are declared and introspection picks the one that exists.
 */
type Collector = {
  root: string;
  altRoots?: string[];
  selection: string[];
};

const COLLECTORS: Collector[] = [
  { root: "sellers", selection: ["metadataUri"] },
  { root: "disputeResolvers", selection: ["metadataUri"] },
  { root: "offers", selection: ["metadataUri"] },
  {
    root: "baseMetadataEntities",
    selection: ["image", "animationUrl", "externalUrl", "licenseUrl"]
  },
  {
    root: "productV1MetadataEntities",
    selection: ["image", "animationUrl", "externalUrl", "licenseUrl"]
  },
  {
    root: "bundleMetadataEntities",
    selection: ["image", "animationUrl", "externalUrl", "licenseUrl"]
  },
  { root: "itemMetadataInterfaces", selection: ["metadataUri"] },
  {
    root: "nftItemMetadataEntities",
    selection: [
      "metadataUri",
      "image",
      "animationUrl",
      "externalUrl",
      "youtubeUrl"
    ]
  },
  { root: "productV1ItemMetadataEntities", selection: ["metadataUri"] },
  {
    root: "productV1Products",
    selection: ["visuals_images { url }", "visuals_videos { url }"]
  },
  {
    root: "productV1ProductOverrides",
    altRoots: ["productV1ProductOverrides_collection"],
    selection: ["visuals_images { url }", "visuals_videos { url }"]
  },
  { root: "productV1Medias", selection: ["url"] },
  { root: "productV1Sellers", selection: ["externalUrl", "images { url }"] },
  { root: "productV1SellerContactLinks", selection: ["url"] },
  { root: "productV1ExchangePolicies", selection: ["template"] },
  {
    root: "sellerMetadata",
    altRoots: ["sellerMetadata_collection", "sellerMetadatas"],
    selection: ["website", "images { url }"]
  },
  { root: "sellerMetadataMedias", selection: ["url"] },
  { root: "sellerContactLinks", selection: ["url"] },
  { root: "sellerSocialLinks", selection: ["url"] },
  { root: "salesChannels", selection: ["link", "settingsUri"] },
  { root: "salesChannelDeployments", selection: ["link"] },
  {
    root: "nftContractMetadata",
    altRoots: ["nftContractMetadata_collection", "nftContractMetadatas"],
    selection: ["image", "externalLink"]
  },
  { root: "collectionContracts", selection: ["contractUri"] },
  { root: "productV1ShippingOptions", selection: ["redemptionPoint"] }
];

/** How many provenance entries to keep per CID in the JSON sidecar. */
const MAX_SOURCES_PER_CID = 5;

type Sidecar = {
  env: string;
  updatedAt: string;
  configIds: string[];
  cids: Record<string, { sources: string[] }>;
};

program
  .description(
    "Collect every IPFS CID referenced by a Boson subgraph and merge it into the environment's CID list."
  )
  .option("-c, --configId <CONFIG_ID>", "Config id", "testing-84532-0")
  .option(
    "-u, --subgraph-url <URL>",
    "Override the subgraph URL configured for this configId"
  )
  .option("-o, --out-dir <DIR>", "Output directory", "data/ipfs-cids")
  .option("--seed <FILE>", "File of CIDs to always include", "data/ipfs.txt")
  .option("--page-size <N>", "Subgraph page size", "1000")
  .option("--roots <CSV>", "Only sweep these root query fields")
  .option("--reset", "Overwrite the existing list instead of merging into it")
  .option("--dry-run", "Report what would be collected without writing files")
  .parse(process.argv);

function walkStrings(
  node: unknown,
  currentPath: string,
  visit: (fieldPath: string, value: string) => void
): void {
  if (typeof node === "string") {
    visit(currentPath, node);
    return;
  }
  if (Array.isArray(node)) {
    node.forEach((item, index) =>
      walkStrings(item, `${currentPath}[${index}]`, visit)
    );
    return;
  }
  if (node && typeof node === "object") {
    for (const [key, value] of Object.entries(
      node as Record<string, unknown>
    )) {
      if (key === "id" || key === "__typename") {
        continue;
      }
      walkStrings(value, currentPath ? `${currentPath}.${key}` : key, visit);
    }
  }
}

function httpStatusOf(error: unknown): number | undefined {
  const status = (error as { response?: { status?: number } })?.response
    ?.status;
  return typeof status === "number" ? status : undefined;
}

/**
 * Retry transient subgraph failures. Hosted gateways (0xgraph in particular)
 * rate-limit aggressively, so 429 gets a much longer backoff than a plain 5xx.
 */
async function withRetry<T>(
  label: string,
  fn: () => Promise<T>,
  attempts = 5
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const status = httpStatusOf(error);
      // A missing or deleted subgraph will never recover - fail fast.
      if (status === 404) {
        throw error;
      }
      if (attempt < attempts - 1) {
        const waitMs =
          status === 429 ? 30_000 * (attempt + 1) : 2_000 * 2 ** attempt;
        console.warn(
          `  ${label} failed (${(error as Error).message.split("\n")[0]}), retrying in ${waitMs / 1000}s`
        );
        await new Promise((resolve) => setTimeout(resolve, waitMs));
      }
    }
  }
  throw lastError;
}

/**
 * Root query fields that return a *list*, identified by their `first` argument.
 *
 * Filtering on the argument rather than the name matters: for an entity whose
 * plural equals its singular, graph-node keeps the bare name for the
 * single-entity lookup (which requires an `id`) and exposes the list as
 * `<name>_collection`. Matching on names alone picks the singular field and
 * every page fails with "No value provided for required argument: `id`".
 */
async function getListRootFields(client: GraphQLClient): Promise<Set<string>> {
  const query = `query AvailableRootFields {
    __type(name: "Query") { fields { name args { name } } }
  }`;
  const result = await withRetry("introspection", () =>
    client.request<{
      __type: {
        fields: Array<{ name: string; args: Array<{ name: string }> }>;
      } | null;
    }>(query)
  );
  return new Set(
    (result.__type?.fields || [])
      .filter((field) => field.args.some((arg) => arg.name === "first"))
      .map((field) => field.name)
  );
}

function readSidecar(filePath: string, env: string): Sidecar {
  if (!fs.existsSync(filePath)) {
    return { env, updatedAt: "", configIds: [], cids: {} };
  }
  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, "utf-8")) as Sidecar;
    return {
      env,
      updatedAt: parsed.updatedAt || "",
      configIds: parsed.configIds || [],
      cids: parsed.cids || {}
    };
  } catch {
    console.warn(`Could not parse ${filePath}, starting a fresh sidecar`);
    return { env, updatedAt: "", configIds: [], cids: {} };
  }
}

async function main() {
  const opts = program.opts();
  const configId = (opts.configId || "testing-84532-0") as ConfigId;
  const pageSize = parseInt(opts.pageSize, 10);
  if (isNaN(pageSize) || pageSize < 1) {
    throw new Error(`Invalid value provided to --page-size option`);
  }
  const onlyRoots: Set<string> | undefined = opts.roots
    ? new Set(
        String(opts.roots)
          .split(",")
          .map((value: string) => value.trim())
          .filter(Boolean)
      )
    : undefined;

  const config = getConfigFromConfigId(configId);
  const envName = config.envName;
  const subgraphUrl = opts.subgraphUrl || config.subgraphUrl;
  if (!subgraphUrl) {
    throw new Error(`No subgraph URL configured for configId ${configId}`);
  }

  console.log(`configId:    ${configId}`);
  console.log(`environment: ${envName}`);
  console.log(
    `subgraph:    ${subgraphUrl}${opts.subgraphUrl ? " (--subgraph-url override)" : ""}\n`
  );

  const client = new GraphQLClient(subgraphUrl);

  console.log("1. Introspecting the subgraph schema...");
  const availableRoots = await getListRootFields(client);
  console.log(`   ${availableRoots.size} list root query fields available`);

  const resolved: Array<{ collector: Collector; root: string }> = [];
  const unavailable: string[] = [];
  for (const collector of COLLECTORS) {
    const candidates = [collector.root, ...(collector.altRoots || [])];
    const root = candidates.find((candidate) => availableRoots.has(candidate));
    if (!root) {
      unavailable.push(collector.root);
      continue;
    }
    if (onlyRoots && !onlyRoots.has(root) && !onlyRoots.has(collector.root)) {
      continue;
    }
    if (root !== collector.root) {
      console.log(`   ${collector.root} -> ${root} (renamed by graph-node)`);
    }
    resolved.push({ collector, root });
  }
  if (unavailable.length) {
    console.log(`   not present on this subgraph: ${unavailable.join(", ")}`);
  }

  console.log(`\n2. Sweeping ${resolved.length} root fields...`);
  // cid -> set of "<root>.<fieldPath> #<entityId>"
  const found = new Map<string, Set<string>>();
  const failedRoots: string[] = [];

  for (const { collector, root } of resolved) {
    const query = `
      query CollectCids($first: Int!, $lastId: ID!) {
        rows: ${root}(
          first: $first
          orderBy: id
          orderDirection: asc
          where: { id_gt: $lastId }
        ) {
          id
          ${collector.selection.join("\n          ")}
        }
      }
    `;

    let lastId = "";
    let rowCount = 0;
    let cidCount = 0;
    let page = 0;

    try {
      for (;;) {
        const result = await withRetry(`${root} page ${page}`, () =>
          client.request<{ rows: Array<Record<string, unknown>> }>(query, {
            first: pageSize,
            lastId
          })
        );
        const rows = result.rows || [];
        for (const row of rows) {
          rowCount++;
          const entityId = String(row.id ?? "");
          walkStrings(row, "", (fieldPath, value) => {
            const cid = extractCid(value);
            if (!cid) {
              return;
            }
            cidCount++;
            const sources = found.get(cid) || new Set<string>();
            sources.add(`${configId} ${root}.${fieldPath} #${entityId}`);
            found.set(cid, sources);
          });
        }
        if (rows.length < pageSize) {
          break;
        }
        lastId = String(rows[rows.length - 1].id ?? "");
        page++;
        if (page % 10 === 0) {
          console.log(`   ${root}: ${rowCount} rows so far...`);
        }
      }
      console.log(`   ${root}: ${rowCount} rows, ${cidCount} IPFS references`);
    } catch (error) {
      failedRoots.push(root);
      console.warn(
        `   ${root}: FAILED after ${rowCount} rows - ${(error as Error).message.split("\n")[0]}`
      );
    }
  }

  console.log(`\n3. Seeding from ${opts.seed}...`);
  const seeds = parseSeedFile(path.resolve(opts.seed));
  for (const seed of seeds) {
    const sources = found.get(seed.cid) || new Set<string>();
    sources.add(`${opts.seed} ${seed.label}`);
    found.set(seed.cid, sources);
  }
  console.log(`   ${seeds.length} seed CIDs`);

  const outDir = path.resolve(opts.outDir);
  const listPath = path.join(outDir, `${envName}.txt`);
  const sidecarPath = path.join(outDir, `${envName}.json`);

  const existingCids = opts.reset ? [] : readCidListFile(listPath);
  const sidecar = opts.reset
    ? ({ env: envName, updatedAt: "", configIds: [], cids: {} } as Sidecar)
    : readSidecar(sidecarPath, envName);

  const newCids = [...found.keys()].filter(
    (cid) => !existingCids.includes(cid)
  );

  for (const [cid, sources] of found) {
    const merged = new Set([...(sidecar.cids[cid]?.sources || []), ...sources]);
    sidecar.cids[cid] = {
      sources: [...merged].sort().slice(0, MAX_SOURCES_PER_CID)
    };
  }
  sidecar.configIds = [...new Set([...sidecar.configIds, configId])].sort();
  sidecar.updatedAt = new Date().toISOString();

  const allCids = [...new Set([...existingCids, ...found.keys()])].sort();

  console.log(`\n4. Writing ${envName} list...`);
  if (opts.dryRun) {
    console.log("   --dry-run: nothing written");
  } else {
    writeCidListFile(listPath, allCids);
    fs.writeFileSync(
      sidecarPath,
      JSON.stringify(sidecar, null, 2) + "\n",
      "utf-8"
    );
    console.log(`   ${listPath}`);
    console.log(`   ${sidecarPath}`);
  }

  console.log(
    `\nFound ${found.size} distinct CIDs (${newCids.length} new), ${allCids.length} total in ${envName}`
  );
  if (failedRoots.length) {
    console.warn(
      `WARNING: ${failedRoots.length} root field(s) failed and were skipped: ${failedRoots.join(", ")}`
    );
  }
}

main()
  .then(() => {
    console.log("\ndone");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
