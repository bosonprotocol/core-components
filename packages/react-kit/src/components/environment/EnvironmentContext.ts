import { EnvironmentType, ConfigId } from "@bosonprotocol/core-sdk";
import { createContext, useContext } from "react";

export const Context = createContext<{
  envName: EnvironmentType;
  configId: ConfigId;
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
