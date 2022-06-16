import { useState } from "react";
import { subgraph } from "@bosonprotocol/core-sdk";
import { useAsyncEffect } from "use-async-effect";

import { useCoreSDK } from "../../lib/useCoreSDK";
import { useReloadCounter } from "../../lib/useReloadCounter";

export function useManageExchangeData(exchangeId: string) {
  const coreSDK = useCoreSDK();
  const { reload, reloadCounter } = useReloadCounter();
  const [exchange, setExchange] = useState<
    | {
        status: "loaded";
        exchange: subgraph.ExchangeFieldsFragment;
      }
    | { status: "loading" }
    | { status: "error"; error: Error }
  >({ status: "loading" });

  useAsyncEffect(
    (isActive) => {
      coreSDK
        .getExchangeById(exchangeId)
        .then((exchange) => {
          if (!isActive()) return;
          setExchange({ status: "loaded", exchange });
        })
        .catch((e) => {
          if (!isActive()) return;
          setExchange({ status: "error", error: e });
        });
    },
    [exchangeId, reloadCounter]
  );

  return { exchangeData: exchange, reloadExchangeData: reload };
}
