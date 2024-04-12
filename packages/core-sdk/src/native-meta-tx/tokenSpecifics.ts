type TokenSpecifics = {
  ERC712_VERSION?: string;
};

/** Configuration items that are specific to some tokens on some chain */
const _tokenSpecifics: Record<number, Record<string, TokenSpecifics>> = {
  80001: {
    // MUMBAI
    "0xe6b8a5cf854791412c1f6efc7caf629f5df1c747": {
      // LOWER CASE
      // USDC Token
      ERC712_VERSION: "2" // On MUMBAI, ERC712_VERSION is different than on Polygon
    }
  }
  // TODO: check on Amoy
};

/** Returns the configuration items that are specific to some tokens on some chain */
export const tokenSpecifics = (chainId: number, tokenAddress: string) => {
  return _tokenSpecifics[chainId]?.[tokenAddress.toLowerCase()];
};
