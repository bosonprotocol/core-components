import { ConfigId, EnvironmentType } from "@bosonprotocol/core-sdk";
import { useEnvContext } from "../../../components/environment/EnvironmentContext";
import { RobloxContext } from "./RobloxContext";
import { envConfigs } from "@bosonprotocol/roblox-sdk";
import React, { useMemo } from "react";

const getBackendOrigin = ({
  envName,
  configId
}: {
  envName: EnvironmentType;
  configId: ConfigId;
}) => {
  return (
    // @ts-expect-error import.meta.env only exists in vite environments
    import.meta.env?.STORYBOOK_ROBLOX_BACKEND_ORIGIN ||
    (typeof process !== "undefined" &&
      process.env?.STORYBOOK_ROBLOX_BACKEND_ORIGIN) ||
    envConfigs[envName].find((conf) => conf.configId === configId)
      ?.backendOrigin ||
    ""
  );
};

export type RobloxProviderProps = {
  children: React.ReactNode;
};
export const RobloxProvider: React.FC<RobloxProviderProps> = ({ children }) => {
  const { configId, envName } = useEnvContext();
  const backendOrigin = useMemo(
    () => getBackendOrigin({ envName, configId }),
    [envName, configId]
  );
  return (
    <RobloxContext.Provider value={{ backendOrigin }}>
      {children}
    </RobloxContext.Provider>
  );
};
