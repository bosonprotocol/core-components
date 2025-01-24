import React, { ReactNode, useCallback } from "react";
import { useProvider } from "../../../hooks/connection/connection";
import { CONFIG } from "../../../lib/config/config";
import { Updaters } from "../../../state/updaters";
import { BosonProvider, BosonProviderProps } from "../../boson/BosonProvider";
import ChatProvider from "../../chat/ChatProvider/ChatProvider";
import {
  ConfigProvider,
  ConfigProviderProps
} from "../../config/ConfigProvider";
import { IpfsProvider, IpfsProviderProps } from "../../ipfs/IpfsProvider";
import { ModalProvider } from "../../modal/ModalProvider";
import { withQueryClientProvider } from "../../queryClient/withQueryClientProvider";
import {
  ReduxProvider,
  WithReduxProvider,
  WithReduxProviderProps
} from "../ReduxProvider";
import ConvertionRateProvider, {
  ConvertionRateProviderProps
} from "../finance/convertion-rate/ConvertionRateProvider";
import { Web3Provider, Web3ProviderProps } from "../../wallet2/web3Provider";
import { BlockNumberProvider } from "../../../hooks/contracts/useBlockNumber";
import {
  RedemptionProvider,
  RedemptionProviderProps
} from "../redemption/provider/RedemptionProvider";
import {
  BosonThemeProvider,
  BosonThemeProviderProps,
  useBosonTheme
} from "../BosonThemeProvider";
import { GlobalStyledThemed } from "../../styles/GlobalStyledThemed";
import { RobloxProvider } from "../../../hooks/roblox/context/RobloxProvider";

export type CommitWidgetProvidersProps = IpfsProviderProps &
  Omit<ConfigProviderProps, "magicLinkKey" | "infuraKey"> &
  Partial<BosonThemeProviderProps> &
  RedemptionProviderProps &
  ConvertionRateProviderProps &
  Omit<Web3ProviderProps, "infuraKey"> &
  BosonProviderProps &
  WithReduxProviderProps & {
    children: ReactNode;
    withGlobalStyle?: boolean;
  };

const { infuraKey, magicLinkKey } = CONFIG;

export const CommitWidgetReduxUpdaters = Updaters;
export const CommitWidgetReduxProvider = ReduxProvider;

export const CommitWidgetProviders: React.FC<CommitWidgetProvidersProps> =
  withQueryClientProvider(
    ({
      children,
      withReduxProvider,
      withCustomReduxContext,
      withGlobalStyle,
      ...props
    }) => {
      const WithUpdaters = useCallback(
        ({ children: updatersChildren }: { children: ReactNode }) => {
          return withReduxProvider ? (
            <UpdatersWrapper withWeb3React={props.withWeb3React}>
              {updatersChildren}
            </UpdatersWrapper>
          ) : (
            <>{updatersChildren}</>
          );
        },
        [withReduxProvider, props.withWeb3React]
      );
      const { themeKey: storyBookThemeKey } =
        useBosonTheme({
          throwOnError: false
        }) || {};

      return (
        <BosonThemeProvider
          theme={props.theme || storyBookThemeKey || "light"}
          roundness={props.roundness || "min"}
        >
          {withGlobalStyle && <GlobalStyledThemed />}
          <WithReduxProvider
            withCustomReduxContext={withCustomReduxContext}
            withReduxProvider={withReduxProvider}
          >
            <Web3Provider {...props} infuraKey={infuraKey}>
              <ConfigProvider
                magicLinkKey={magicLinkKey}
                infuraKey={infuraKey}
                withCustomReduxContext={withCustomReduxContext}
                {...props}
              >
                <RobloxProvider>
                  <BlockNumberProvider>
                    <BosonProvider {...props}>
                      <WithUpdaters>
                        <ChatProvider>
                          <IpfsProvider {...props}>
                            <ConvertionRateProvider>
                              <RedemptionProvider {...props}>
                                <ModalProvider>{children}</ModalProvider>
                              </RedemptionProvider>
                            </ConvertionRateProvider>
                          </IpfsProvider>
                        </ChatProvider>
                      </WithUpdaters>
                    </BosonProvider>
                  </BlockNumberProvider>
                </RobloxProvider>
              </ConfigProvider>
            </Web3Provider>
          </WithReduxProvider>
        </BosonThemeProvider>
      );
    }
  );

function UpdatersWrapper({
  children,
  withWeb3React
}: {
  children: ReactNode;
  withWeb3React: boolean;
}) {
  const provider = useProvider();
  return (
    <Updaters provider={provider} withWeb3React={withWeb3React}>
      {children}
    </Updaters>
  );
}
