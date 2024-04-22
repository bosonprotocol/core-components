import { getEnvConfigs, EnvironmentType } from "@bosonprotocol/common";
import { config as dotenvConfig } from "dotenv";
import fs from "fs";
import { resolve } from "path";
import { parse } from "ts-command-line-args";
import { ZeroAddress } from "ethers-v6";

// if ./.env file exists, read it
const envFile = resolve(__dirname, "./../.env");
if (fs.existsSync(envFile)) {
  const res = dotenvConfig({
    debug: false,
    path: envFile
  });
  if (process.env.NODE_ENV === "development" && res.error) {
    throw res.error;
  }
}

function validParseInt(label: string, value: string) {
  if (value === undefined) return undefined;
  const parsed = +value;
  if (isNaN(parsed)) {
    throw new Error(`Invalid numeric value ${label}: '${value}'`);
  }
  return parsed;
}

interface ICLArguments {
  port: number;
  envName: string;
  privateKey: string;
  rpcNode: string;
}

const args = parse<ICLArguments>(
  {
    port: {
      alias: "p",
      type: Number,
      optional: true
    },
    envName: {
      alias: "e",
      type: String,
      optional: true
    },
    privateKey: {
      alias: "k",
      type: String,
      optional: true
    },
    rpcNode: {
      type: String,
      optional: true
    }
  },
  {
    partial: true
  }
);

export type Config = {
  PORT: number;
  CHAIN_ID: number;
  ENV_NAME: string;
  RPC_NODE: string;
  PROTOCOL: string;
  ERC20: string;
  FORWARDER: string;
  SEAPORT_ADDRESS: string;
  OPENSEA_FEE_RECIPIENT: string;
  OPENSEA_FEE_PERCENTAGE: number;
};

let config: Config;

export function getConfig(): Config {
  if (!config) {
    const envName = args.envName || process.env.ENV_NAME || "local";
    const defaultConfig = getEnvConfigs(envName as EnvironmentType)[0];
    config = {
      PORT: args.port || validParseInt("PORT", process.env.PORT) || 3334,
      CHAIN_ID: defaultConfig.chainId,
      ENV_NAME: envName,
      RPC_NODE:
        args.rpcNode || process.env.RPC_NODE || defaultConfig.jsonRpcUrl,
      PROTOCOL: defaultConfig.contracts.protocolDiamond,
      ERC20: defaultConfig.contracts.testErc20,
      FORWARDER: defaultConfig.contracts.forwarder,
      SEAPORT_ADDRESS:
        process.env.SEAPORT_ADDRESS || defaultConfig.contracts.seaport,
      OPENSEA_FEE_RECIPIENT: process.env.OPENSEA_FEE_RECIPIENT || ZeroAddress,
      OPENSEA_FEE_PERCENTAGE: Number(process.env.OPENSEA_FEE_PERCENTAGE) || 2.5
    };
  }
  return config;
}
