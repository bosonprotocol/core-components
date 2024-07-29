import { ethers } from "ethers";
import { ethers as ethersV6 } from "ethers-v6";
import { Magic } from "magic-sdk";
import { createContext } from "react";

export const MagicContext = createContext<{
  magic: Magic & {
    uuid: string;
  };
  magicProvider: ethers.providers.Web3Provider;
  magicProviderV6: ethersV6.BrowserProvider;
} | null>(null);
