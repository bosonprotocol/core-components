import { Magic } from "magic-sdk";
import React, { ReactNode, useMemo } from "react";
import { UserProvider } from "./UserProvider";
import { CONFIG } from "../../lib/config/config";
import { useConfigContext } from "../config/ConfigContext";
import { getRpcUrls } from "../../lib/const/networks";
import { ethers } from "ethers";
import { MagicContext } from "./MagicContext";

export const MagicProvider = ({ children }: { children: ReactNode }) => {
  const { config, magicLinkKey } = useConfigContext();
  const chainId = config.chainId;
  return (
    <InnerMagicProvider
      chainId={chainId}
      magicLinkKey={magicLinkKey ?? ""}
      rpcUrls={CONFIG.rpcUrls}
    >
      {children}
    </InnerMagicProvider>
  );
};

export type InnerMagicProviderProps = {
  children: ReactNode;
  chainId: number;
  magicLinkKey: string;
  rpcUrls: ReturnType<typeof getRpcUrls>;
};
export const InnerMagicProvider = ({
  children,
  chainId,
  magicLinkKey,
  rpcUrls
}: InnerMagicProviderProps) => {
  const magic = useMemo(() => {
    if (!chainId || !rpcUrls[chainId as keyof typeof rpcUrls]?.[0]) {
      return null;
    }
    const magic = new Magic(magicLinkKey, {
      network: {
        rpcUrl: rpcUrls[chainId as keyof typeof rpcUrls][0],
        chainId: chainId
      }
    });
    magic.uuid = window.crypto.randomUUID();
    magic
      .preload()
      .then(() => console.info("magic link preloaded"))
      .catch(() => console.info("magic link could not be preloaded"));
    return {
      magic: magic as typeof magic & { uuid: string },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      magicProvider: new ethers.providers.Web3Provider(magic.rpcProvider as any)
    }; // return magic provider too
  }, [chainId, magicLinkKey, rpcUrls]);
  return (
    <MagicContext.Provider value={magic}>
      <UserProvider>{children}</UserProvider>
    </MagicContext.Provider>
  );
};
