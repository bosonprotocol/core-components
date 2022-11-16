import { Web3LibAdapter } from "@bosonprotocol/common";
import { AddressZero } from "@ethersproject/constants";
import { getDecimals, getName, getSymbol } from "../erc20/handler";
import { getExchangeTokens } from "../erc20/subgraph";

export interface ITokenInfo {
  name: string;
  decimals: number;
  symbol: string;
}

export interface ITokenInfoManager {
  getExchangeTokenInfo: (tokenAddress: string) => Promise<ITokenInfo>;
}

export const NATIVE_TOKENS: { [key: number]: ITokenInfo } = {
  1: {
    // Ethereum Mainnet
    name: "Ether",
    decimals: 18,
    symbol: "ETH"
  },
  3: {
    // Ethereum Ropsten
    name: "Ether",
    decimals: 18,
    symbol: "ETH"
  },
  4: {
    // Ethereum Rinkeby
    name: "Ether",
    decimals: 18,
    symbol: "ETH"
  },
  5: {
    // Ethereum Goerli
    name: "Ether",
    decimals: 18,
    symbol: "ETH"
  },
  137: {
    // Polygon Mainnet
    name: "MATIC",
    decimals: 18,
    symbol: "MATIC"
  },
  80001: {
    // Polygon Mumbai
    name: "MATIC",
    decimals: 18,
    symbol: "MATIC"
  },
  1234: {
    // Private Node
    name: "Ether",
    decimals: 18,
    symbol: "ETH"
  },
  31337: {
    // Local Hardhat
    name: "Ether",
    decimals: 18,
    symbol: "ETH"
  }
};

export class TokenInfoManager implements ITokenInfoManager {
  private static TokenInfos = new Map<number, Map<string, ITokenInfo>>();
  private static mapInitialized = new Map<number, boolean>();
  private _web3Lib: Web3LibAdapter;
  private _subgraphUrl: string;
  private _chainId: number;
  private static InvalidAddresses = new Map<number, Set<string>>();

  public constructor(
    chainId: number,
    web3Lib: Web3LibAdapter,
    subgraphUrl: string
  ) {
    if (!NATIVE_TOKENS[chainId]) {
      throw new Error(`Unexpected chainId value '${chainId}'`);
    }

    if (!TokenInfoManager.TokenInfos.has(chainId)) {
      const tokenInfos = new Map<string, ITokenInfo>();
      tokenInfos.set(AddressZero, NATIVE_TOKENS[chainId]);
      TokenInfoManager.TokenInfos.set(chainId, tokenInfos);
    }

    if (!TokenInfoManager.mapInitialized.has(chainId)) {
      TokenInfoManager.mapInitialized.set(chainId, false);
    }

    if (!TokenInfoManager.InvalidAddresses.has(chainId)) {
      TokenInfoManager.InvalidAddresses.set(chainId, new Set<string>());
    }
    this._web3Lib = web3Lib;
    this._subgraphUrl = subgraphUrl;
    this._chainId = chainId;
  }

  public async getExchangeTokenInfo(
    tokenAddress: string
  ): Promise<ITokenInfo | undefined> {
    await this.ensureInitialized();
    const tokenInfos = TokenInfoManager.TokenInfos.get(this._chainId);
    const invalidAddressesSet = TokenInfoManager.InvalidAddresses.get(
      this._chainId
    );
    const key = tokenAddress.toLowerCase();

    if (!tokenInfos.has(key) && !invalidAddressesSet.has(key)) {
      const args = {
        web3Lib: this._web3Lib,
        contractAddress: tokenAddress
      };
      try {
        const [decimals, name, symbol] = await Promise.all([
          getDecimals(args),
          getName(args),
          getSymbol(args)
        ]);
        tokenInfos.set(key, {
          decimals,
          name,
          symbol
        });
      } catch (error) {
        invalidAddressesSet.add(key);
      }
    }
    return tokenInfos.get(key);
  }

  private async ensureInitialized() {
    const isInitialized = TokenInfoManager.mapInitialized.get(this._chainId);
    if (!isInitialized) {
      // Be sure we are initializing the map only one time per chainId
      TokenInfoManager.mapInitialized.set(this._chainId, true);
      const tokenInfos = TokenInfoManager.TokenInfos.get(this._chainId);
      // Get all tokens from subgraph
      const tokens = await getExchangeTokens(this._subgraphUrl);
      for (const token of tokens) {
        tokenInfos.set(token.address.toLowerCase(), {
          decimals: parseInt(token.decimals),
          name: token.name,
          symbol: token.symbol
        });
      }
    }
  }
}
