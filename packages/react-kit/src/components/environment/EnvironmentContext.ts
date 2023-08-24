import { EnvironmentType, ConfigId } from "@bosonprotocol/core-sdk";
import { createContext, useContext } from "react";
import { Token } from "../widgets/finance/convertion-rate/ConvertionRateContext";

export const Context = createContext<{
  envName: EnvironmentType;
  configId: ConfigId;
  tokens: Token[];
  metaTx?: { apiKey: string; apiIds: string };
} | null>(null);

export const useEnvContext = () => {
  const contextValue = useContext(Context);
  if (!contextValue) {
    throw new Error(
      "You need to use EnvironmentProvider before using useEnvContext"
    );
  }
  return contextValue;
};
