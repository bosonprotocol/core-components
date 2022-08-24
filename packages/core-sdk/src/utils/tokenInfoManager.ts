import { Web3LibAdapter } from "@bosonprotocol/common";
import { AddressZero } from "@ethersproject/constants";
import { getDecimals, getName, getSymbol } from "../erc20/handler";

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
  private _tokenInfos = new Map<string, ITokenInfo>();
  private _web3Lib: Web3LibAdapter;

  public constructor(chainId: number, web3Lib: Web3LibAdapter) {
    if (!NATIVE_TOKENS[chainId]) {
      throw new Error(`Unexpected chainId value '${chainId}'`);
    }
    this._tokenInfos.set(AddressZero, NATIVE_TOKENS[chainId]);
    this._web3Lib = web3Lib;
  }

  public async getExchangeTokenInfo(tokenAddress: string): Promise<ITokenInfo> {
    if (!this._tokenInfos.has(tokenAddress.toLowerCase())) {
      const args = {
        web3Lib: this._web3Lib,
        contractAddress: tokenAddress
      };
      const [decimals, name, symbol] = await Promise.all([
        getDecimals(args),
        getName(args),
        getSymbol(args)
      ]);
      this._tokenInfos.set(tokenAddress.toLowerCase(), {
        decimals,
        name,
        symbol
      });
    }
    return this._tokenInfos.get(tokenAddress.toLowerCase());
  }
}
