import { Magic } from "magic-sdk";
import React, { createContext, ReactNode, useMemo } from "react";
import { UserProvider } from "./UserContext";
import { CONFIG } from "../../lib/config/config";
import { useConfigContext } from "../config/ConfigContext";
import type { getRpcUrls } from "../../lib/const/networks";

export const MagicContext = createContext<
  | (Magic & {
      uuid: string;
    })
  | null
>(null);

export const MagicProvider = ({ children }: { children: ReactNode }) => {
  const { config, magicLinkKey } = useConfigContext();
  const chainId = config.chainId;
  return (
    <InnerMagicProvider
      chainId={chainId}
      magicLinkKey={magicLinkKey}
      rpcUrls={CONFIG.rpcUrls}
    >
      {children}
    </InnerMagicProvider>
  );
};

type InnerMagicProviderProps = {
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
    return magic as typeof magic & { uuid: string };
  }, [chainId, magicLinkKey, rpcUrls]);
  return (
    <MagicContext.Provider value={magic}>
      <UserProvider>{children}</UserProvider>
    </MagicContext.Provider>
  );
};
