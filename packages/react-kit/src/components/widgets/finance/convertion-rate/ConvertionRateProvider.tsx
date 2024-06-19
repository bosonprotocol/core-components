import React, { useCallback, useEffect, useMemo, useState } from "react";

import { useTokens } from "../exchange-tokens/useTokens";
import { saveItemInStorage } from "../../../../hooks/storage/useBosonLocalStorage";
import ConvertionRateContext, {
  ConvertionRateContextType,
  initalState,
  Store,
  Token
} from "./ConvertionRateContext";
import { useUniswapPools } from "./useUniswapPools";
import { handleRates } from "./utils";
import { useConfigContext } from "../../../config/ConfigContext";

export interface ConvertionRateProviderProps {
  children: React.ReactNode;
}
export default function ConvertionRateProvider({
  children
}: ConvertionRateProviderProps) {
  const { config } = useConfigContext();
  const defaultTokens = config?.defaultTokens;
  const [store, setStore] = useState(initalState.store);
  const { data: tokens, isLoading: isTokensLoading } = useTokens({
    enabled: !!defaultTokens && defaultTokens.length > 0
  });
  const appTokens = useMemo(
    () =>
      !!defaultTokens && defaultTokens.length > 0
        ? defaultTokens
        : ((tokens || []) as Token[]),
    [tokens, defaultTokens]
  );

  const { data, isSuccess } = useUniswapPools({
    tokens: !isTokensLoading && appTokens?.length > 0 ? appTokens : []
  });

  const updateProps = useCallback((store: Store) => {
    setStore({
      ...store
    });
  }, []);

  useEffect(() => {
    if (appTokens && store?.tokens === null) {
      updateProps({
        ...store,
        tokens: appTokens
      });
    }
  }, [isTokensLoading, store?.tokens]); //eslint-disable-line

  useEffect(() => {
    if (isSuccess && store?.isLoading === true) {
      const rates = handleRates(data, appTokens);
      saveItemInStorage("convertionRates", rates);
      updateProps({ ...store, rates, isLoading: false });
    }
  }, [data, isSuccess]); //eslint-disable-line

  const value: ConvertionRateContextType = {
    store,
    updateProps
  };

  return (
    <ConvertionRateContext.Provider value={value}>
      {children}
    </ConvertionRateContext.Provider>
  );
}
