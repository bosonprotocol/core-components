const magicLinkKey = process.env.REACT_APP_MAGIC_API_KEY;
if (!magicLinkKey) {
  throw new Error("REACT_APP_MAGIC_API_KEY is not defined");
}
const infuraKey = process.env.REACT_APP_INFURA_KEY;
if (!infuraKey) {
  throw new Error("REACT_APP_INFURA_KEY is not defined");
}

export const CONFIG = {
  magicLinkKey,
  infuraKey
} as const;
