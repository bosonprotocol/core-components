import { useEnvContext } from "../../../components/environment/EnvironmentContext";
import { RobloxContext } from "./RobloxContext";
import React from "react";

export type RobloxProviderProps = {
  children: React.ReactNode;
};
export const RobloxProvider: React.FC<RobloxProviderProps> = ({ children }) => {
  const { configId } = useEnvContext();
  // TODO: change this to the actual backend origin from @bosonprotocol/roblox-sdk
  const backendOrigin =
    configId === "production-1-0"
      ? "http://localhost:3336"
      : "http://localhost:3336";
  return (
    <RobloxContext.Provider value={{ backendOrigin }}>
      {children}
    </RobloxContext.Provider>
  );
};
