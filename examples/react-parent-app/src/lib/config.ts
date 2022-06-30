import { getDefaultConfig } from "@bosonprotocol/core-sdk";

const envName = process.env.REACT_APP_ENV_NAME;
const chainId = parseInt(process.env.REACT_APP_CHAIN_ID || "3");

export const CONFIG = {
  ...getDefaultConfig({
    envName,
    chainId
  }),
  metaTransactionsApiKey: process.env.REACT_APP_META_TX_API_KEY
};
