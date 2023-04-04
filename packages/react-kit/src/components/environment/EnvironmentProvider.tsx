import { EnvironmentType } from "@bosonprotocol/core-sdk";
import React, { ReactNode } from "react";
import { Context } from "./EnvironmentContext";

export type EnvironmentProviderProps = {
  children: ReactNode;
  envName: EnvironmentType;
};
export function EnvironmentProvider({
  children,
  envName
}: EnvironmentProviderProps) {
  return <Context.Provider value={{ envName }}>{children}</Context.Provider>;
}
