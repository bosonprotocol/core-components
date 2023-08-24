import { BaseIpfsStorage } from "./../packages/ipfs-storage/src/ipfs/base";
import { EnvironmentType } from "@bosonprotocol/common/src/types/configs";
import { program } from "commander";
import { getEnvConfigById } from "../packages/core-sdk/src";
import fs from "fs";
import { buildInfuraHeaders } from "./utils/infura";

program
  .description("Upload to IPFS.")
  .argument("<FILEPATH>", "File to upload.")
  .option("-e, --env <ENV_NAME>", "Target environment", "testing")
  .option("-c, --configId <CONFIG_ID>", "Config id", "testing-80001-0")
  .option(
    "--infura <INFURA_PROJECT_ID>/<INFURA_PROJECT_SECRET>",
    "ProjectId and Secret required to address Infura IPFS gateway"
  )
  .parse(process.argv);

async function main() {
  const [filePath] = program.args;
  const { env: envName, infura, configId } = program.opts();
  const defaultConfig = getEnvConfigById(envName as EnvironmentType, configId);
  const storage = new BaseIpfsStorage({
    url: defaultConfig.ipfsMetadataUrl,
    headers: infura ? buildInfuraHeaders(infura) : undefined
  });
  const rawData = fs.readFileSync(filePath);
  console.log(`*********************`);
  console.log(`   Upload file`);
  console.log(`*********************`);
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
