import React, { ReactNode } from "react";
import { CONFIG } from "../../../lib/config/config";
import ChatProvider from "../../chat/ChatProvider/ChatProvider";
import {
  ConfigProvider,
  ConfigProviderProps
} from "../../config/ConfigProvider";
import { IpfsProvider, IpfsProviderProps } from "../../ipfs/IpfsProvider";
import { ModalProvider } from "../../modal/ModalProvider";
import { withQueryClientProvider } from "../../queryClient/withQueryClientProvider";
import { SignerProvider } from "../../signer/SignerProvider";
import GlobalStyle from "../../styles/GlobalStyle";
import { WithReduxProvider, WithReduxProviderProps } from "../ReduxProvider";
import { getParentWindowOrigin } from "../common";
import ConvertionRateProvider, {
  ConvertionRateProviderProps
} from "../finance/convertion-rate/ConvertionRateProvider";
import { CommonWidgetTypes } from "../types";
import {
  RedemptionProvider,
  RedemptionProviderProps
} from "./provider/RedemptionProvider";
import {
  RedemptionWidgetProvider,
  RedemptionWidgetProviderProps
} from "./provider/RedemptionWidgetProvider";
import { BosonProvider, BosonProviderProps } from "../../boson/BosonProvider";
import { Web3Provider, Web3ProviderProps } from "../../wallet2/web3Provider";
import { BlockNumberProvider } from "../../../hooks/contracts/BlockNumberProvider";
import { RobloxProvider } from "../../../hooks/roblox/context/RobloxProvider";
import {
  BosonThemeProvider,
  BosonThemeProviderProps,
  useBosonTheme
} from "../BosonThemeProvider";
import { GlobalStyledThemed } from "../../styles/GlobalStyledThemed";

export type RedemptionWidgetProvidersProps = IpfsProviderProps &
  Omit<ConfigProviderProps, "magicLinkKey" | "infuraKey"> &
  RedemptionProviderProps &
  Partial<BosonThemeProviderProps> &
  Omit<RedemptionWidgetProviderProps, "setWidgetAction"> &
  ConvertionRateProviderProps &
  CommonWidgetTypes &
  Omit<Web3ProviderProps, "infuraKey"> &
  BosonProviderProps &
  WithReduxProviderProps & {
    signatures?: string[] | undefined | null;
  } & {
    children: ReactNode;
    withGlobalStyle?: boolean;
  };

const { infuraKey, magicLinkKey } = CONFIG;

export const RedemptionWidgetProviders: React.FC<RedemptionWidgetProvidersProps> =
  withQueryClientProvider(({ children, withGlobalStyle, ...props }) => {
    const parentOrigin = getParentWindowOrigin();
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
          withCustomReduxContext={props.withCustomReduxContext}
          withReduxProvider={props.withReduxProvider}
        >
          <Web3Provider {...props} infuraKey={infuraKey}>
            <ConfigProvider
              magicLinkKey={magicLinkKey}
              {...props}
              infuraKey={infuraKey}
            >
              <RobloxProvider>
                <BlockNumberProvider>
                  <BosonProvider {...props}>
                    <GlobalStyle />
                    <SignerProvider
                      parentOrigin={parentOrigin}
                      withExternalSigner={props.withExternalSigner}
                    >
                      <ChatProvider>
                        <IpfsProvider {...props}>
                          <ConvertionRateProvider>
                            <ModalProvider>
                              <RedemptionProvider {...props}>
                                <RedemptionWidgetProvider {...props}>
                                  {children}
                                </RedemptionWidgetProvider>
                              </RedemptionProvider>
                            </ModalProvider>
                          </ConvertionRateProvider>
                        </IpfsProvider>
                      </ChatProvider>
                    </SignerProvider>
                  </BosonProvider>
                </BlockNumberProvider>
              </RobloxProvider>
            </ConfigProvider>
          </Web3Provider>
        </WithReduxProvider>
      </BosonThemeProvider>
    );
  });
