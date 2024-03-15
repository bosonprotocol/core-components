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

async function main() {
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
