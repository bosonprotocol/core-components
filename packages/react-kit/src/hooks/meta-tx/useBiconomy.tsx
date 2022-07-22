import { useEffect, useState } from "react";
import { providers } from "ethers";
// @ts-expect-error: v1 mexa sdk doesn't support typescript
import { Biconomy } from "@biconomy/mexa";
import { getDefaultConfig } from "@bosonprotocol/core-sdk";

export type BiconomyConfig = {
  chainId: number;
  metaTransactionsApiKey?: string;
  jsonRpcUrl?: string;
};

/**
 * Hook that initializes an instance of `Biconomy`.
 * This instance is used to enable Biconomy meta transactions.
 * @param config - Configuration arguments of `Biconomy` instance.
 * @returns Initialized `Biconomy` instance.
 */
export function useBiconomy(config: BiconomyConfig) {
  const defaultConfig = getDefaultConfig({ chainId: config.chainId });
  const [biconomyState, setBiconomyState] = useState<
    | { status: "idle" }
    | { status: "initializing" }
    | {
        status: "initialized";
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        biconomy: any;
        biconomyProvider: providers.JsonRpcProvider;
      }
    | { status: "error"; error: Error }
  >({ status: "idle" });

  useEffect(() => {
    if (config.metaTransactionsApiKey) {
      setBiconomyState({ status: "initializing" });

      const biconomy = new Biconomy(
        new providers.JsonRpcProvider(
          config.jsonRpcUrl || defaultConfig.jsonRpcUrl
        ),
        {
          apiKey: config.metaTransactionsApiKey,
          debug: true
        }
      );

      biconomy
        .onEvent(biconomy.READY, async () => {
          const biconomyProvider = new providers.Web3Provider(biconomy);

          setBiconomyState({
            status: "initialized",
            biconomy,
            biconomyProvider
          });
        })
        .onEvent(biconomy.ERROR, (error: Error) => {
          setBiconomyState({
            status: "error",
            error
          });
        });
    }
  }, [
    config.jsonRpcUrl,
    config.metaTransactionsApiKey,
    defaultConfig.jsonRpcUrl
  ]);

  return biconomyState;
}
