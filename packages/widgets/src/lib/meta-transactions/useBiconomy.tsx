import { useEffect, useState } from "react";
import { providers } from "ethers";
// @ts-expect-error: v1 mexa sdk doesn't support typescript
import { Biconomy } from "@biconomy/mexa";
import { getConfig } from "../config";

export function useBiconomy() {
  const config = getConfig();
  const [biconomyState, setBiconomyState] = useState<
    | { status: "idle" }
    | { status: "initializing" }
    | {
        status: "initialized";
        biconomy: any;
        biconomyProvider: providers.JsonRpcProvider;
      }
    | { status: "error"; error: Error }
  >({ status: "idle" });

  useEffect(() => {
    if (config.metaTransactionsApiKey) {
      setBiconomyState({ status: "initializing" });

      const biconomy = new Biconomy(
        new providers.JsonRpcProvider(config.jsonRpcUrl),
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
  }, [config.jsonRpcUrl, config.metaTransactionsApiKey]);

  return biconomyState;
}
