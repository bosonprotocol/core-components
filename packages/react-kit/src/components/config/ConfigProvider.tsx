import {
  ProtocolConfig,
  getEnvConfigById,
  getEnvConfigs
} from "@bosonprotocol/core-sdk";
import React, {
  Fragment,
  ReactNode,
  useEffect,
  useMemo,
  useState
} from "react";
import { useChainId } from "../../hooks/connection/connection";
import { getEnvConfigsFilteredByEnv } from "../../lib/config/getConfigsByChainId";
import { useEnvContext } from "../environment/EnvironmentContext";
import {
  EnvironmentProvider,
  EnvironmentProviderProps
} from "../environment/EnvironmentProvider";
import { MagicProvider } from "../magicLink/MagicProvider";
import { withQueryClientProvider } from "../queryClient/withQueryClientProvider";
import { InnerWeb3Provider } from "../wallet2/web3Provider/InnerWeb3Provider";
import {
  ConfigContext,
  ConfigContextProps,
  useConfigContext
} from "./ConfigContext";

type OptionalConfigProps = "dateFormat" | "shortDateFormat";
export type ConfigProviderProps = Omit<
  ConfigContextProps,
  "config" | "defaultCurrency" | "supportedChains" | OptionalConfigProps
> &
  Partial<Pick<ConfigContextProps, OptionalConfigProps>> & {
    children: ReactNode;
    defaultCurrencyTicker?: string;
    defaultCurrencySymbol?: string;
    withWeb3React: boolean;
    withCustomReduxContext: boolean;
  } & EnvironmentProviderProps;

export function ConfigProvider({ children, ...rest }: ConfigProviderProps) {
  const Web3ProviderComponent = useMemo(() => {
    return rest.withWeb3React ? InnerWeb3Provider : Fragment;
  }, [rest.withWeb3React]);
  const MagicLinkProvider = useMemo(() => {
    return rest.withMagicLink ? MagicProvider : Fragment;
  }, [rest.withMagicLink]);
  return (
    <EnvironmentProvider
      envName={rest.envName}
      configId={rest.configId}
      metaTx={rest.metaTx}
    >
      <InnerConfigProvider {...rest}>
        <Web3ProviderComponent>
          <MagicLinkProvider>
            <SyncCurrentConfigId>{children}</SyncCurrentConfigId>
          </MagicLinkProvider>
        </Web3ProviderComponent>
      </InnerConfigProvider>
    </EnvironmentProvider>
  );
}

const SyncCurrentConfigId = withQueryClientProvider(function ({
  children
}: Pick<ConfigProviderProps, "children">) {
  const chainId = useChainId();
  const { setEnvConfig, config } = useConfigContext();
  useEffect(() => {
    const newEnvConfig = getEnvConfigsFilteredByEnv(config.envName).find(
      (envConfig) => envConfig.chainId === chainId
    );
    if (newEnvConfig) {
      setEnvConfig(newEnvConfig);
    }
  }, [chainId, config.envName, setEnvConfig]);
  return <>{children}</>;
});

function InnerConfigProvider({
  children,
  ...rest
}: Omit<ConfigProviderProps, "walletConnectProjectId">) {
  const { envName, configId } = useEnvContext();
  const defaultEnvConfig = useMemo(
    () => getEnvConfigById(envName, configId),
    [envName, configId]
  );
  const [envConfig, setEnvConfig] = useState<ProtocolConfig>(defaultEnvConfig);

  const supportedChains = getEnvConfigs(envName).map(
    (config) => config.chainId as number
  );
  return (
    <ConfigContext.Provider
      value={{
        ...rest,
        setEnvConfig,
        config: envConfig,
        defaultCurrency: {
          ticker: rest.defaultCurrencyTicker || "USD",
          symbol: rest.defaultCurrencySymbol || "$"
        },
        dateFormat: rest.dateFormat || "YYYY/MM/DD",
        shortDateFormat: rest.shortDateFormat || "MMM DD, YYYY",
        supportedChains
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}
