import { getRpcUrls } from "../const/networks";

const magicLinkKey =
  process.env.REACT_APP_MAGIC_API_KEY || "REACT_APP_MAGIC_API_KEY";
if (!magicLinkKey) {
  throw new Error("REACT_APP_MAGIC_API_KEY is not defined");
}
const infuraKey = process.env.INFURA_PROJECT_SECRET || "INFURA_PROJECT_SECRET";
if (!infuraKey) {
  throw new Error("INFURA_PROJECT_SECRET is not defined");
}

export const CONFIG = {
  magicLinkKey,
  infuraKey,
  rpcUrls: getRpcUrls(infuraKey)
} as const;
