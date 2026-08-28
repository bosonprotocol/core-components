import fs from "fs";
import path from "path";

import * as dagPB from "@ipld/dag-pb";
import { UnixFS } from "ipfs-unixfs";
import { CID } from "multiformats/cid";
import { sha256 } from "multiformats/hashes/sha2";

/** Default UnixFS chunk size, above which a file becomes a multi-block DAG. */
const UNIXFS_CHUNK_SIZE = 262144;

/**
 * Parse a string as a CID and return its canonical string form.
 * Returns `undefined` when the string is not a valid CID.
 */
export function parseCid(value: string): string | undefined {
  try {
    return CID.parse(value).toString();
  } catch {
    return undefined;
  }
}

/**
 * Normalise a CID to its CIDv1 string form, so that CIDv0 (`Qm...`) and CIDv1
 * (`bafy...`) representations of the same content compare equal.
 */
export function normalizeCid(cid: string): string | undefined {
  try {
    return CID.parse(cid).toV1().toString();
  } catch {
    return undefined;
  }
}

function firstSegment(value: string): string {
  return value.split(/[/?#]/)[0];
}

/** Multicodec for a single raw block, as opposed to 0x70 dag-pb. */
const RAW_CODEC = 0x55;

/**
 * True when the CID addresses a bare raw block (`bafkrei...`) rather than a
 * UnixFS dag-pb node (`Qm...` / `bafybei...`).
 *
 * Re-uploading has to match the original codec or it mints a different address
 * for identical bytes, which defeats the point of re-pinning.
 */
export function isRawBlockCid(cid: string): boolean {
  try {
    return CID.parse(cid).code === RAW_CODEC;
  } catch {
    return false;
  }
}

/**
 * Compute the CIDv0 that `ipfs add` would produce for this content, using the
 * default UnixFS parameters (dag-pb, sha2-256, 256 KiB chunks, no raw leaves).
 *
 * Only single-block content is supported - everything larger would need the
 * balanced-DAG layout, and throwing is better than returning a wrong CID.
 * Use this to check a local file against a recorded CID, and to verify that an
 * upload came back with the CID the content actually hashes to.
 */
export async function computeUnixFsCidV0(content: Uint8Array): Promise<string> {
  if (content.length > UNIXFS_CHUNK_SIZE) {
    throw new Error(
      `Cannot compute CID for ${content.length} bytes: content larger than ` +
        `${UNIXFS_CHUNK_SIZE} bytes spans multiple blocks, which needs a full UnixFS importer`
    );
  }
  const unixfs = new UnixFS({ type: "file", data: content });
  const encoded = dagPB.encode(
    dagPB.prepare({ Data: unixfs.marshal(), Links: [] })
  );
  const digest = await sha256.digest(encoded);
  return CID.createV0(digest).toString();
}

/**
 * Extract the IPFS CID referenced by an arbitrary metadata value.
 *
 * Handles every form found in the Boson subgraph:
 * - `ipfs://<cid>` and `ipfs://<cid>/path/file.png`
 * - `ipfs://ipfs/<cid>`
 * - path gateways: `https://<host>/ipfs/<cid>[/path][?query]`
 * - subdomain gateways: `https://<cidv1>.ipfs.<host>/...`
 * - bare CIDs, with or without a trailing path
 *
 * Returns `undefined` for anything that is not an IPFS reference (plain http
 * links, `mailto:`, empty strings, ...), so non-IPFS fields can be scanned
 * without special-casing them.
 */
export function extractCid(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const raw = value.trim();
  if (!raw) {
    return undefined;
  }

  if (raw.toLowerCase().startsWith("ipfs://")) {
    let rest = raw.slice("ipfs://".length);
    if (rest.toLowerCase().startsWith("ipfs/")) {
      rest = rest.slice("ipfs/".length);
    }
    return parseCid(firstSegment(rest));
  }

  // No protocol at all: a bare CID, possibly followed by a path.
  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(raw)) {
    return parseCid(firstSegment(raw));
  }

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return undefined;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return undefined;
  }

  // Path gateway: https://<host>/ipfs/<cid>/...
  const pathMatch = url.pathname.match(/\/ipfs\/([^/?#]+)/i);
  if (pathMatch) {
    const cid = parseCid(pathMatch[1]);
    if (cid) {
      return cid;
    }
  }

  // Subdomain gateway: https://<cid>.ipfs.<host>/...
  const subdomainMatch = url.hostname.match(/^([^.]+)\.ipfs\./i);
  if (subdomainMatch) {
    const cid = parseCid(subdomainMatch[1]);
    if (cid) {
      return cid;
    }
  }

  // Legacy gateway URLs that put the CID in the last path segment.
  const lastSegment = url.pathname.split("/").filter(Boolean).pop();
  if (lastSegment) {
    const cid = parseCid(lastSegment);
    if (cid) {
      return cid;
    }
  }

  return undefined;
}

/**
 * Read a CID list file (one CID per line). Blank lines and `#` comments are
 * ignored. Missing files yield an empty list.
 */
export function readCidListFile(filePath: string): string[] {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  return fs
    .readFileSync(filePath, "utf-8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));
}

/**
 * Write a CID list file: sorted, one CID per line, trailing newline. Sorting
 * makes repeated runs byte-identical and keeps diffs readable.
 */
export function writeCidListFile(
  filePath: string,
  cids: Iterable<string>
): string[] {
  const sorted = [...new Set(cids)].sort();
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, sorted.join("\n") + "\n", "utf-8");
  return sorted;
}

/**
 * Parse `data/ipfs.txt`, whose payload lines are `<filename> <cid>`. Header
 * lines and anything whose last token is not a CID are ignored.
 */
export function parseSeedFile(
  filePath: string
): Array<{ cid: string; label: string }> {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const seeds: Array<{ cid: string; label: string }> = [];
  for (const line of fs.readFileSync(filePath, "utf-8").split(/\r?\n/)) {
    const tokens = line.trim().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) {
      continue;
    }
    const cid = parseCid(tokens[tokens.length - 1]);
    if (cid) {
      seeds.push({ cid, label: tokens.length > 1 ? tokens[0] : cid });
    }
  }
  return seeds;
}
