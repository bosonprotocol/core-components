import { EnvironmentType, ConfigId } from "@bosonprotocol/core-sdk";
import React, { ReactNode } from "react";
import { Context } from "./EnvironmentContext";
import { getDefaultTokens } from "../widgets/finance/exchange-tokens/tokens";

export type EnvironmentProviderProps = {
  children: ReactNode;
  envName: EnvironmentType;
  configId: ConfigId;
  metaTx?: { apiKey: string; apiIds: string };
  tokensList: string;
};
export function EnvironmentProvider({
  children,
  envName,
  configId,
  tokensList,
  metaTx
}: EnvironmentProviderProps) {
  const tokens = getDefaultTokens(tokensList);
  return (
    <Context.Provider value={{ envName, configId, metaTx, tokens }}>
      {children}
    </Context.Provider>
  );
}
