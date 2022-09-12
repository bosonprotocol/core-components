import { Wallet } from "ethers";
import { getDefaultConfig } from "@bosonprotocol/common";
import { config as dotenvConfig } from "dotenv";
import fs from "fs";
import { resolve } from "path";
import { parse } from "ts-command-line-args";

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
  chainId: number;
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
    chainId: {
      alias: "c",
      type: Number,
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
  RPC_NODE: string;
  PROTOCOL: string;
  PRIVATE_KEY: string;
  ACCOUNT: string;
};

let config: Config;

export function getConfig(): Config {
  if (!config) {
    const chainId =
      args.chainId || validParseInt("CHAIN_ID", process.env.CHAIN_ID) || 1234;
    const defaultConfig = getDefaultConfig({ chainId });
    const privateKey = args.privateKey || process.env.PRIVATE_KEY;
    if (!privateKey) {
      throw new Error(
        "A Private Key must be specified, either in .env file, or as a command line argument"
      );
    }
    let wallet;
    try {
      wallet = new Wallet(privateKey);
    } catch (e) {
      throw new Error("Invalid Private Key. Unable to create the wallet");
    }
    config = {
      PORT: args.port || validParseInt("PORT", process.env.PORT) || 8888,
      CHAIN_ID: chainId,
      RPC_NODE: args.rpcNode || process.env.RPC_NODE || defaultConfig.jsonRpcUrl,
      PROTOCOL: defaultConfig.contracts.protocolDiamond,
      PRIVATE_KEY: wallet.privateKey,
      ACCOUNT: wallet.address
    };
  }
  return config;
}
