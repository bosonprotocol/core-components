/* eslint-disable @typescript-eslint/no-var-requires */
const { symlinkSync, existsSync, rmSync, mkdirSync } = require("fs");
const { readFile, writeFile } = require("fs").promises;
const { resolve } = require("path");

const protocolVersion = process.argv
  .find(arg => arg.startsWith('--protocolVersion='))
  ?.split('=')[1];

const PROTOCOL_PACKAGE_FILE = `${resolve(
    __dirname,
    "..",
    "node_modules",
    "@bosonprotocol/boson-protocol-contracts",
    "package.json"
  )}`;

const createLink = async (linkPath, target) => {
  while (existsSync(linkPath)) {
    // remove linkPath first
    rmSync(linkPath, { recursive: true });
    await new Promise((r) => setTimeout(r, 200));
  }
  const parentDir = resolve(linkPath, "..");
  if (!existsSync(parentDir)) {
    console.log(`Create parent dir ${parentDir}`);
    mkdirSync(parentDir);
  }
  console.log(`Create link ${linkPath} --> ${target}`);
  symlinkSync(target, linkPath, "junction");
};

const protocol = {
  target: `${resolve(
    __dirname,
    "..",
    "node_modules",
    "@bosonprotocol/boson-protocol-contracts"
  )}`,
  linkPath: `${resolve(__dirname, "..", "protocol-contracts")}`
};

const seaport = {
  target: `${resolve(__dirname, "..", "node_modules", "seaport")}`,
  linkPath: `${resolve(
    __dirname,
    "..",
    "protocol-contracts/submodules/seaport"
  )}`
};

const royaltyRegistry = {
  target: `${resolve(
    __dirname,
    "..",
    "node_modules",
    "@manifoldxyz/royalty-registry-solidity"
  )}`,
  linkPath: `${resolve(
    __dirname,
    "..",
    "protocol-contracts/submodules/royalty-registry-solidity"
  )}`
};

async function patchProtocolVersion() {
  try {
    const packageJson = JSON.parse(await readFile(PROTOCOL_PACKAGE_FILE, 'utf8'));
    packageJson.version = protocolVersion;
    await writeFile(PROTOCOL_PACKAGE_FILE, JSON.stringify(packageJson, null, 2));
    console.log(`Updated protocol version to ${protocolVersion}`);
  } catch (error) {
    console.error('Error updating protocol version:', error);
    throw error;
  }
}

async function main() {
  if (protocolVersion) {
    await patchProtocolVersion();
  }
  for (const entry of [protocol, seaport, royaltyRegistry]) {
    await createLink(entry.linkPath, entry.target);
  }
}

main()
  .then(() => console.log("success"))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
