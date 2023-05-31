/* eslint-disable @typescript-eslint/no-var-requires */
const { symlinkSync, existsSync, rmSync, mkdirSync } = require("fs");
const { resolve } = require("path");

const createLink = async (linkPath, target) => {
  while (existsSync(linkPath)) {
    // remove linkPath first
    rmSync(linkPath, { recursive: true });
    await new Promise((r) => setTimeout(r, 200));
  }
  const parentDir = resolve(linkPath, "..");
  console.log("parentDir", parentDir);
  if (!existsSync(parentDir)) {
    console.log(`Create parent dir ${parentDir}`);
    mkdirSync(parentDir);
  }
  console.log(`Create link ${linkPath} --> ${target}`);
  symlinkSync(target, linkPath, "junction");
};

const protocolContracts = {
  target: `${resolve(
    __dirname,
    "..",
    "node_modules",
    "@bosonprotocol/boson-protocol-contracts/contracts"
  )}`,
  linkPath: `${resolve(__dirname, "..", "protocol-contracts/contracts")}`
};

const protocolScripts = {
  target: `${resolve(
    __dirname,
    "..",
    "node_modules",
    "@bosonprotocol/boson-protocol-contracts/scripts"
  )}`,
  linkPath: `${resolve(__dirname, "..", "protocol-contracts/scripts")}`
};

const protocolTests = {
  target: `${resolve(
    __dirname,
    "..",
    "node_modules",
    "@bosonprotocol/boson-protocol-contracts/test"
  )}`,
  linkPath: `${resolve(__dirname, "..", "protocol-contracts/test")}`
};

const protocolAddresses = {
  target: `${resolve(
    __dirname,
    "..",
    "node_modules",
    "@bosonprotocol/boson-protocol-contracts/addresses"
  )}`,
  linkPath: `${resolve(__dirname, "..", "protocol-contracts/addresses")}`
};

const seaportContracts = {
  target: `${resolve(__dirname, "..", "node_modules", "seaport")}`,
  linkPath: `${resolve(
    __dirname,
    "..",
    "protocol-contracts/submodules/seaport"
  )}`
};

async function main() {
  for (const entry of [
    protocolContracts,
    seaportContracts,
    protocolScripts,
    protocolTests,
    protocolAddresses
  ]) {
    await createLink(entry.linkPath, entry.target);
  }
}

main()
  .then(() => console.log("success"))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
