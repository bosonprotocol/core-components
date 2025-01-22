import { useEnvContext } from "../../../components/environment/EnvironmentContext";
import { RobloxContext } from "./RobloxContext";
import { envConfigs } from "@bosonprotocol/roblox-sdk";
import React from "react";

export type RobloxProviderProps = {
  children: React.ReactNode;
};
export const RobloxProvider: React.FC<RobloxProviderProps> = ({ children }) => {
  const { configId, envName } = useEnvContext();
  const backendOrigin =
    // @ts-expect-error import.meta.env only exists in vite environments
    import.meta?.env?.STORYBOOK_ROBLOX_BACKEND_ORIGIN ||
    process?.env?.STORYBOOK_ROBLOX_BACKEND_ORIGIN ||
    envConfigs[envName].find((conf) => conf.configId === configId)
      ?.backendOrigin ||
    "";
  return (
    <RobloxContext.Provider value={{ backendOrigin }}>
      {children}
    </RobloxContext.Provider>
  );
};
