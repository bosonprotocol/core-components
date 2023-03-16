import { EnvironmentType } from "@bosonprotocol/core-sdk";
import React, { ReactNode } from "react";
import { Context } from "./EnvironmentContext";

type Props = {
  children: ReactNode;
  envName: EnvironmentType;
};
export function EnvironmentProvider({ children, envName }: Props) {
  return <Context.Provider value={{ envName }}>{children}</Context.Provider>;
}
