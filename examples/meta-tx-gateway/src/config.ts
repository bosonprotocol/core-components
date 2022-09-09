import { config as dotenvConfig } from "dotenv";
import fs from "fs";
import { resolve } from 'path';
import { parse } from 'ts-command-line-args';

// if ./.env file exists, read it
const envFile = resolve(__dirname, './../.env');
if (fs.existsSync(envFile)) {
  const res = dotenvConfig({
    debug: false,
    path: envFile,
  });
  if (process.env.NODE_ENV === "development" && res.error) {
    throw res.error;
  }
}

function validParseInt(label: string, value: string) {
  if (value === undefined) return undefined;
  const parsed = +value;
  if (isNaN(parsed)) { throw new Error(`Invalid numeric value ${label}: '${value}'`) }
  return parsed;
}

interface ICLArguments {
  port: number;
  chainId: number;
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
  },
  {
    partial: true,
  }
);

export type Config = {
  PORT: number;
  CHAIN_ID: number;
}

let config: Config;

export function getConfig(): Config {
  if (!config) {
    config = { 
      PORT: args.port || validParseInt("PORT", process.env.PORT) || 8888,
      CHAIN_ID: args.chainId || validParseInt("CHAIN_ID", process.env.CHAIN_ID) || 1234
    };
  } 
  return config;
}
