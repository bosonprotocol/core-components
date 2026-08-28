import { BaseIpfsStorage } from "./../packages/ipfs-storage/src/ipfs/base";
import { EnvironmentType } from "@bosonprotocol/common/src/types/configs";
import { program } from "commander";
import { getEnvConfigById } from "../packages/core-sdk/src";
import fs from "fs";

program
  .description("Upload to IPFS.")
  .argument("<FILEPATH>", "File to upload.")
  .option("-e, --env <ENV_NAME>", "Target environment", "testing")
  .option("-c, --configId <CONFIG_ID>", "Config id", "testing-11155111-0")
  .option(
    "--pinata <PINATA_JWT>",
    "JWT required to address Pinata IPFS gateway"
  )
  .parse(process.argv);

async function main() {
  const [filePath] = program.args;
  const { env: envName, configId, pinata } = program.opts();
  const defaultConfig = getEnvConfigById(envName as EnvironmentType, configId);

  console.log(`*********************`);
  console.log(`   Upload file`);
  console.log(`*********************`);

  const storage = new BaseIpfsStorage({
    url: defaultConfig.ipfsMetadataUrl,
    headers: pinata ? { Authorization: `Bearer ${pinata}` } : undefined
  });
  const rawData = fs.readFileSync(filePath);
  const hash = await storage.add(rawData);

  console.log(`Hash: ${hash}`);
  console.log(`*********************`);
}

main()
  .then(() => {
    console.log("success");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
