import fs from "fs";
import { EnvironmentType, ConfigId } from "@bosonprotocol/common";
import { getEnvConfigById } from "@bosonprotocol/core-sdk";
import { BaseIpfsStorage } from "@bosonprotocol/ipfs-storage";
import { Command } from "commander";
import { buildInfuraHeaders } from "../utils/infura";

export const uploadToIpfsCommand = new Command("upload-to-ipfs")
  .description("Upload a file to IPFS.")
  .argument(
    "<filePath>",
    "Path to the file to upload. Can also be set via FILE_PATH env var."
  )
  .option(
    "-e, --env <envName>",
    "Target environment (testing|staging|production). Overrides ENV_NAME env var.",
    "testing"
  )
  .option(
    "-c, --configId <configId>",
    "Config id. Overrides ENV_CONFIG_ID env var.",
    "testing-80002-0"
  )
  .option(
    "--infura <infuraCredentials>",
    "ProjectId and Secret required to address Infura IPFS gateway (format: <projectId>/<projectSecret>). " +
      "Overrides INFURA_CREDENTIALS env var."
  )
  .action(async (filePath: string, opts) => {
    const envName: string = opts.env || process.env.ENV_NAME || "testing";
    const configId: string =
      opts.configId || process.env.ENV_CONFIG_ID || "testing-80002-0";
    const resolvedFilePath: string = filePath || process.env.FILE_PATH || "";
    const infura = opts.infura || process.env.INFURA_CREDENTIALS;

    const defaultConfig = getEnvConfigById(
      envName as EnvironmentType,
      configId as ConfigId
    );
    const storage = new BaseIpfsStorage({
      url: defaultConfig.ipfsMetadataUrl,
      headers: infura ? buildInfuraHeaders(infura) : undefined
    });

    const rawData = fs.readFileSync(resolvedFilePath);

    console.log(`*********************`);
    console.log(`   Upload file`);
    console.log(`*********************`);
    const hash = await storage.add(rawData);
    console.log(`Hash: ${hash}`);
    console.log(`*********************`);
  });
