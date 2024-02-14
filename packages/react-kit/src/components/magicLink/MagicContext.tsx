import { ethers } from "ethers";
import { Magic } from "magic-sdk";
import { createContext } from "react";

export const MagicContext = createContext<{
  magic: Magic & {
    uuid: string;
  };
  magicProvider: ethers.providers.Web3Provider;
} | null>(null);
