import React, {
  Fragment,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";
import { isTruthy } from "../../types/helpers";
import {
  ConfigContext,
  ConfigContextProps,
  useConfigContext
} from "./ConfigContext";
import { useEnvContext } from "../environment/EnvironmentContext";
import {
  ProtocolConfig,
  getEnvConfigById,
  getEnvConfigs
} from "@bosonprotocol/core-sdk";
import {
  EnvironmentProvider,
  EnvironmentProviderProps
} from "../environment/EnvironmentProvider";
import { useChainId } from "../../hooks/connection/connection";
import { getEnvConfigsFilteredByEnv } from "../../lib/config/getConfigsByChainId";
import { MagicProvider } from "../magicLink/MagicProvider";
import WalletConnectionProvider, {
  WalletConnectionProviderProps
} from "../wallet/WalletConnectionProvider";
import { withQueryClientProvider } from "../queryClient/withQueryClientProvider";
import { InnerWeb3Provider } from "../wallet2/web3Provider/InnerWeb3Provider";

export type ConfigProviderProps = Omit<
  ConfigContextProps,
  | "config"
  | "defaultCurrency"
  | "sellerCurationList"
  | "offerCurationList"
  | "supportedChains"
> & {
  children: ReactNode;
  defaultCurrencyTicker: string;
  defaultCurrencySymbol: string;
  sellerCurationListBetweenCommas?: string;
  offerCurationListBetweenCommas?: string;
  withWeb3React: boolean;
  withCustomReduxContext: boolean;
} & EnvironmentProviderProps &
  WalletConnectionProviderProps;
export function ConfigProvider({
  children,
  walletConnectProjectId,
  ...rest
}: ConfigProviderProps) {
  const Web3ProviderComponent = useMemo(() => {
    return rest.withWeb3React ? InnerWeb3Provider : Fragment;
  }, [rest.withWeb3React]);
  return (
    <EnvironmentProvider
      envName={rest.envName}
      configId={rest.configId}
      metaTx={rest.metaTx}
    >
      <InnerConfigProvider {...rest}>
        <Web3ProviderComponent>
          <MagicProvider>
            <WalletConnectionProvider
              walletConnectProjectId={walletConnectProjectId}
            >
              <SyncCurrentConfigId>{children}</SyncCurrentConfigId>
            </WalletConnectionProvider>
          </MagicProvider>
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
  const sellerCurationList = useMemo(
    () =>
      rest.sellerCurationListBetweenCommas
        ?.split(",")
        .map((item) => item.trim())
        .filter(isTruthy),
    [rest.sellerCurationListBetweenCommas]
  );
  const offerCurationList = useMemo(
    () =>
      rest.offerCurationListBetweenCommas
        ?.split(",")
        .map((item) => item.trim())
        .filter(isTruthy),
    [rest.offerCurationListBetweenCommas]
  );
  const supportedChains = getEnvConfigs(envName).map(
    (config) => config.chainId as number
  );
  return (
    <ConfigContext.Provider
      value={{
        ...rest,
        setEnvConfig,
        config: envConfig,
        sellerCurationList,
        offerCurationList,
        defaultCurrency: {
          ticker: rest.defaultCurrencyTicker,
          symbol: rest.defaultCurrencySymbol
        },
        fairExchangePolicyRules: rest.fairExchangePolicyRules,
        dateFormat: rest.dateFormat || "YYYY/MM/DD",
        shortDateFormat: rest.shortDateFormat || "MMM DD, YYYY",
        minimumDisputePeriodInDays: rest.minimumDisputePeriodInDays || 30,
        minimumDisputeResolutionPeriodDays:
          rest.minimumDisputeResolutionPeriodDays || 15,
        buyerSellerAgreementTemplate:
          rest.buyerSellerAgreementTemplate ||
          "ipfs://QmXxRznUVMkQMb6hLiojbiv9uDw22RcEpVk6Gr3YywihcJ",
        licenseTemplate:
          rest.licenseTemplate ||
          "ipfs://QmeYsxxy4aDvC5ocMEDrBj5xjSKobnRNw9VDN8DBzqqdmj",
        supportedChains
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}
