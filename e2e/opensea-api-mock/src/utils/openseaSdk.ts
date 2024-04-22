import { OpenSeaSDK } from "opensea-js";
import { getProvider } from "./web3";
import { getConfig } from "../config";

let openseaSdk: OpenSeaSDK = undefined;

export async function getOpenseaSdk() {
  if (!openseaSdk) {
    const config = getConfig();
    const provider = await getProvider(config.RPC_NODE);
    openseaSdk = new OpenSeaSDK(provider);
  }
  return openseaSdk;
}
