import {
  EnvironmentType,
  ProtocolConfig,
  getEnvConfigs
} from "@bosonprotocol/core-sdk";

export const getConfigsByChainId = (
  chainId: number | undefined | null,
  envName: EnvironmentType
): ProtocolConfig[] | null => {
  if (!chainId) {
    return null;
  }
  return getEnvConfigsFilteredByEnv(envName).filter(
    (config) => config.chainId === chainId
  );
};

export const getEnvConfigsFilteredByEnv = (
  envName: EnvironmentType
): ProtocolConfig[] => {
  return getEnvConfigs(envName);
};
