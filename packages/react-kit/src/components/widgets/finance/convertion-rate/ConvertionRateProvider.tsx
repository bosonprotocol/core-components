import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getDefaultTokens } from "../exchange-tokens/tokens";

import { useTokens } from "../exchange-tokens/useTokens";
import { saveItemInStorage } from "../storage/useLocalStorage";
import ConvertionRateContext, {
  ConvertionRateContextType,
  initalState,
  Store,
  Token
} from "./ConvertionRateContext";
import { useUniswapPools } from "./useUniswapPools";
import { handleRates } from "./utils";

export interface ConvertionRateProviderProps {
  children: React.ReactNode;
  tokensList: string;
}
export default function ConvertionRateProvider({
  children,
  tokensList
}: ConvertionRateProviderProps) {
  const defaultTokens = getDefaultTokens(tokensList);
  const [store, setStore] = useState(initalState.store);
  const { data: tokens, isLoading: isTokensLoading } = useTokens({
    enabled: defaultTokens.length > 0
  });
  const appTokens = useMemo(
    () =>
      defaultTokens.length > 0 ? defaultTokens : ((tokens || []) as Token[]),
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
