import { EnvironmentType } from "@bosonprotocol/core-sdk";
import React, { ReactNode } from "react";
import { Context } from "./EnvironmentContext";
import { getDefaultTokens } from "../widgets/finance/exchange-tokens/tokens";

export type EnvironmentProviderProps = {
  children: ReactNode;
  envName: EnvironmentType;
  metaTx?: { apiKey: string; apiIds: string };
  tokensList: string;
};
export function EnvironmentProvider({
  children,
  envName,
  tokensList,
  metaTx
}: EnvironmentProviderProps) {
  const tokens = getDefaultTokens(tokensList);
  return (
    <Context.Provider value={{ envName, metaTx, tokens }}>
      {children}
    </Context.Provider>
  );
}
