import { getRpcUrls } from "../const/networks";
import { getEnvVar } from "../env/getEnvVar";

const magicLinkKey =
  getEnvVar("STORYBOOK_REACT_APP_MAGIC_API_KEY") ||
  getEnvVar("REACT_APP_MAGIC_API_KEY");
if (!magicLinkKey) {
  throw new Error(
    "STORYBOOK_REACT_APP_MAGIC_API_KEY/REACT_APP_MAGIC_API_KEY is not defined"
  );
}
const infuraKey =
  getEnvVar("STORYBOOK_REACT_APP_INFURA_KEY") ||
  getEnvVar("REACT_APP_INFURA_KEY");
if (!infuraKey) {
  throw new Error(
    "STORYBOOK_REACT_APP_INFURA_KEY/REACT_APP_INFURA_KEY is not defined"
  );
}

export const CONFIG = {
  magicLinkKey,
  infuraKey,
  rpcUrls: getRpcUrls(infuraKey)
} as const;
