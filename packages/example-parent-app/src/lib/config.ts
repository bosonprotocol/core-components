import { getDefaultConfig } from "@bosonprotocol/core-sdk";

const chainId = parseInt(process.env.REACT_APP_CHAIN_ID || "3");

export const CONFIG = getDefaultConfig({
  chainId
});
