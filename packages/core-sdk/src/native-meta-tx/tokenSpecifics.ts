type TokenSpecifics = {
  ERC712_VERSION?: string;
};

/** Configuration items that are specific to some tokens on some chain */
export const tokenSpecifics: Record<number, Record<string, TokenSpecifics>> = {
  80001: {
    // MUMBAI
    "0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747": {
      // USDC Token
      ERC712_VERSION: "2" // On MUMBAI, ERC712_VERSION is different than on Polygon
    }
  }
};
