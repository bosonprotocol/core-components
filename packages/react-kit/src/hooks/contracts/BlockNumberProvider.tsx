import React from "react";
import { ChainId } from "@uniswap/sdk-core";
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";
import { useIsWindowVisible } from "../uniswap/useIsWindowVisible";
import { RPC_PROVIDERS } from "../../lib/const/providers";
import { useChainId, useProvider } from "../connection/connection";

export const MISSING_PROVIDER = Symbol();
export const BlockNumberContext = createContext<
  | {
      fastForward(block: number): void;
      block?: number;
      mainnetBlock?: number;
    }
  | typeof MISSING_PROVIDER
>(MISSING_PROVIDER);

export function BlockNumberProvider({ children }: { children: ReactNode }) {
  const activeChainId = useChainId();
  const provider = useProvider();

  const [{ chainId, block, mainnetBlock }, setChainBlock] = useState<{
    chainId?: number;
    block?: number;
    mainnetBlock?: number;
  }>({
    chainId: activeChainId
  });

  const onChainBlock = useCallback((chainId: number, block: number) => {
    setChainBlock((chainBlock) => {
      if (chainBlock.chainId === chainId) {
        if (!chainBlock.block || chainBlock.block < block) {
          return {
            chainId,
            block,
            mainnetBlock:
              chainId === ChainId.MAINNET ? block : chainBlock.mainnetBlock
          };
        }
      } else if (chainId === ChainId.MAINNET) {
        if (!chainBlock.mainnetBlock || chainBlock.mainnetBlock < block) {
          return { ...chainBlock, mainnetBlock: block };
        }
      }
      return chainBlock;
    });
  }, []);

  const windowVisible = useIsWindowVisible();
  useEffect(() => {
    let stale = false;

    if (provider && activeChainId && windowVisible) {
      // If chainId hasn't changed, don't clear the block. This prevents re-fetching still valid data.
      setChainBlock((chainBlock) =>
        chainBlock.chainId === activeChainId
          ? chainBlock
          : { chainId: activeChainId, mainnetBlock: chainBlock.mainnetBlock }
      );

      provider
        .getBlockNumber()
        .then((block) => {
          if (!stale) onChainBlock(activeChainId, block);
        })
        .catch((error) => {
          console.error(
            `Failed to get block number for chainId ${activeChainId}`,
            error
          );
        });

      const onBlock = (block: number) => onChainBlock(activeChainId, block);
      provider.on("block", onBlock);
      return () => {
        stale = true;
        provider.removeListener("block", onBlock);
      };
    }

    return void 0;
  }, [activeChainId, provider, windowVisible, onChainBlock]);

  useEffect(() => {
    if (mainnetBlock === undefined) {
      RPC_PROVIDERS[ChainId.MAINNET]
        .getBlockNumber()
        .then((block) => {
          onChainBlock(ChainId.MAINNET, block);
        })
        // swallow errors - it's ok if this fails, as we'll try again if we activate mainnet
        .catch(() => undefined);
    }
  }, [mainnetBlock, onChainBlock]);

  const value = useMemo(
    () => ({
      fastForward: (update: number) => {
        if (block && update > block) {
          setChainBlock({
            chainId: activeChainId,
            block: update,
            mainnetBlock:
              activeChainId === ChainId.MAINNET ? update : mainnetBlock
          });
        }
      },
      block: chainId === activeChainId ? block : undefined,
      mainnetBlock
    }),
    [activeChainId, block, chainId, mainnetBlock]
  );
  return (
    <BlockNumberContext.Provider value={value}>
      {children}
    </BlockNumberContext.Provider>
  );
}
