import fs from "fs";
import path from "path";

import { program } from "commander";

import { computeUnixFsCidV0, normalizeCid, parseCid } from "./utils/ipfs";
import { PinataClient } from "./utils/pinata";

/**
 * The template files whose CIDs `data/ipfs.txt` records. `label` is the name
 * the file is listed under in `data/ipfs.txt`.
 */
const DATA_FILES = [
  {
    label: "contractualAgreement.template.md",
    filePath: "data/contractualAgreement.template.md"
  },
  {
    label: "rNFTLicense.template.md",
    filePath: "data/rNFTLicense.template.md"
  },
  {
    label: "exchangePolicyRules.template.json",
    filePath: "data/exchangePolicies/exchangePolicyRules.template.json"
  }
];

const IPFS_TXT_HEADER = [
  "HERE AFTER THE IPFS HASH OF THE UPLOADED FILES (FOR RECORDING AND TRACEABILITY)",
  "===============================================================================",
  ""
];

program
  .description(
    "Pin the data/ template files on Pinata and record their real CIDs in data/ipfs.txt."
  )
  .option(
    "-p, --pinata <PINATA_JWT>",
    "Pinata JWT (defaults to the PINATA_JWT environment variable)"
  )
  .option("--record <FILE>", "CID record file", "data/ipfs.txt")
  .option(
    "--check",
    "Only compare the recorded CIDs against the source files; no upload, no writes"
  )
  .option(
    "--record-only",
    "Correct the record from the computed CIDs without uploading; the CIDs are re-verified on the next real run"
  )
  .parse(process.argv);

/** Parse `data/ipfs.txt` into `label -> cid`. */
function readRecord(filePath: string): Map<string, string> {
  const record = new Map<string, string>();
  if (!fs.existsSync(filePath)) {
    return record;
  }
  for (const line of fs.readFileSync(filePath, "utf-8").split(/\r?\n/)) {
    const tokens = line.trim().split(/\s+/).filter(Boolean);
    if (tokens.length < 2) {
      continue;
    }
    const cid = parseCid(tokens[tokens.length - 1]);
    if (cid) {
      record.set(tokens.slice(0, -1).join(" "), cid);
    }
  }
  return record;
}

function writeRecord(filePath: string, record: Map<string, string>): void {
  const lines = [
    ...IPFS_TXT_HEADER,
    ...[...record.entries()].map(([label, cid]) => `${label} ${cid}`)
  ];
  fs.writeFileSync(filePath, lines.join("\n") + "\n", "utf-8");
}

async function main() {
  const opts = program.opts();
  const recordPath = path.resolve(opts.record);
  const record = readRecord(recordPath);

  type Entry = {
    label: string;
    filePath: string;
    bytes: Uint8Array;
    computed: string;
    recorded?: string;
  };

  const entries: Entry[] = [];
  console.log("1. Computing CIDs of the source files...\n");
  for (const { label, filePath } of DATA_FILES) {
    const resolved = path.resolve(filePath);
    if (!fs.existsSync(resolved)) {
      throw new Error(`Source file not found: ${filePath}`);
    }
    const bytes = new Uint8Array(fs.readFileSync(resolved));
    const computed = await computeUnixFsCidV0(bytes);
    const recorded = record.get(label);
    entries.push({ label, filePath, bytes, computed, recorded });

    const state = !recorded
      ? "not recorded yet"
      : recorded === computed
        ? "matches the record"
        : `MISMATCH - record says ${recorded}`;
    console.log(`   ${label}`);
    console.log(`     ${bytes.length} bytes -> ${computed}  (${state})`);
  }

  const mismatched = entries.filter(
    (entry) => entry.recorded && entry.recorded !== entry.computed
  );

  if (opts.check) {
    console.log(
      `\n--check: ${mismatched.length} of ${entries.length} recorded CIDs do not match their source file`
    );
    // A stale record is what --check exists to catch, so a CI step can gate on
    // its exit code.
    return mismatched.length ? 1 : 0;
  }

  if (opts.recordOnly) {
    for (const entry of entries) {
      record.set(entry.label, entry.computed);
    }
    writeRecord(recordPath, record);
    console.log(`\n--record-only: wrote ${recordPath}`);
    for (const entry of mismatched) {
      console.log(
        `   updated ${entry.label}: ${entry.recorded} -> ${entry.computed}`
      );
    }
    console.log("   nothing was uploaded - run without --record-only to pin");
    return 0;
  }

  const jwt = opts.pinata || process.env.PINATA_JWT;
  if (!jwt) {
    throw new Error(
      "No Pinata JWT provided. Pass --pinata <JWT> or set PINATA_JWT (or use --check to compare only)."
    );
  }

  console.log("\n2. Uploading to Pinata...\n");
  const client = new PinataClient({
    jwt,
    log: (message) => console.log(message)
  });
  const problems: string[] = [];

  for (const entry of entries) {
    // dag-pb, not the v3 /files endpoint: these files are referenced as
    // `ipfs://Qm...` across the subgraph and react-kit, and only a CIDv0 upload
    // reproduces that address.
    const returned = await client.uploadBytesAsDagPb(entry.bytes, entry.label);
    const sameContent = normalizeCid(returned) === normalizeCid(entry.computed);
    if (sameContent) {
      // Keep the CIDv0 form so data/ipfs.txt stays internally consistent.
      record.set(entry.label, entry.computed);
      console.log(`   ${entry.label} ✅ ${entry.computed}`);
    } else {
      // Pinata chunked or encoded the content differently, so the CID the
      // content hashes to is NOT what Pinata now serves. Record what resolves.
      record.set(entry.label, returned);
      problems.push(
        `${entry.label}: expected ${entry.computed}, Pinata returned ${returned}`
      );
      console.log(
        `   ${entry.label} ⚠️  Pinata returned ${returned}, not ${entry.computed}`
      );
    }
  }

  console.log("\n3. Verifying the pins...\n");
  for (const [label, cid] of record) {
    if (!entries.some((entry) => entry.label === label)) {
      continue;
    }
    const pinned = await client.isPinned(cid);
    console.log(`   ${label} ${pinned ? "📌 pinned" : "❌ NOT pinned"} ${cid}`);
    if (!pinned) {
      problems.push(`${label}: ${cid} is not reported as pinned`);
    }
  }

  writeRecord(recordPath, record);
  console.log(`\n4. Wrote ${recordPath}`);
  for (const entry of mismatched) {
    console.log(
      `   updated ${entry.label}: ${entry.recorded} -> ${record.get(entry.label)}`
    );
  }

  if (problems.length) {
    console.warn("\nWARNING:");
    problems.forEach((problem) => console.warn(`  ${problem}`));
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
