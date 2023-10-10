import { EnvironmentType, ConfigId } from "@bosonprotocol/core-sdk";
import React, { ReactNode } from "react";
import { Context } from "./EnvironmentContext";

export type EnvironmentProviderProps = {
  children: ReactNode;
  envName: EnvironmentType;
  configId: ConfigId;
  metaTx?: { apiKey: string; apiIds: string };
};
export function EnvironmentProvider({
  children,
  envName,
  configId,
  metaTx
}: EnvironmentProviderProps) {
  return (
    <Context.Provider value={{ envName, configId, metaTx }}>
      {children}
    </Context.Provider>
  );
}
