import { getRpcUrls } from "../const/networks";

const magicLinkKey =
  process.env.STORYBOOK_REACT_APP_MAGIC_API_KEY ||
  process.env.REACT_APP_MAGIC_API_KEY ||
  // @ts-expect-error import.meta.env only exists in vite environments
  import.meta?.env.STORYBOOK_REACT_APP_MAGIC_API_KEY ||
  // @ts-expect-error import.meta.env only exists in vite environments
  import.meta?.env.REACT_APP_MAGIC_API_KEY;
const infuraKey =
  process.env.STORYBOOK_REACT_APP_INFURA_KEY ||
  process.env.REACT_APP_INFURA_KEY ||
  // @ts-expect-error import.meta.env only exists in vite environments
  import.meta?.env.STORYBOOK_REACT_APP_INFURA_KEY ||
  // @ts-expect-error import.meta.env only exists in vite environments
  import.meta?.env.REACT_APP_INFURA_KEY;
if (!infuraKey) {
  throw new Error(
    "STORYBOOK_REACT_APP_INFURA_KEY/REACT_APP_INFURA_KEY is not defined"
  );
}

export const CONFIG = {
  magicLinkKey,
  infuraKey,
  rpcUrls: getRpcUrls(infuraKey),
  defaultDisputeResolutionPeriodDays: 15,
  minimumDisputePeriodInDays: 30,
  roblox: {
    getItemDetailsWebsite: ({ itemId }: { itemId: string }) =>
      `https://www.roblox.com/catalog/${itemId}/`
  }
} as const;
