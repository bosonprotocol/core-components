import React, { ReactNode } from "react";
import { Omit } from "utility-types";
import { CONFIG } from "../../../lib/config/config";
import {
  ConfigProvider,
  ConfigProviderProps
} from "../../config/ConfigProvider";
import { ModalProvider } from "../../modal/ModalProvider";
import { withQueryClientProvider } from "../../queryClient/withQueryClientProvider";
import { SignerProvider } from "../../signer/SignerProvider";
import { WithReduxProvider, WithReduxProviderProps } from "../ReduxProvider";
import { getParentWindowOrigin } from "../common";
import { CommonWidgetTypes } from "../types";
import ConvertionRateProvider, {
  ConvertionRateProviderProps
} from "./convertion-rate/ConvertionRateProvider";
import { BosonProvider, BosonProviderProps } from "../../boson/BosonProvider";
import { Web3Provider, Web3ProviderProps } from "../../wallet2/web3Provider";
import { BlockNumberProvider } from "../../../hooks/contracts/BlockNumberProvider";
import {
  BosonThemeProvider,
  BosonThemeProviderProps,
  useBosonTheme
} from "../BosonThemeProvider";
import { GlobalStyledThemed } from "../../styles/GlobalStyledThemed";

export type FinanceWidgetProvidersProps = Omit<
  ConfigProviderProps,
  "magicLinkKey" | "infuraKey"
> &
  Omit<Web3ProviderProps, "infuraKey"> &
  Partial<BosonThemeProviderProps> &
  CommonWidgetTypes &
  ConvertionRateProviderProps &
  BosonProviderProps &
  WithReduxProviderProps & {
    children: ReactNode;
    withGlobalStyle?: boolean;
  };

const { infuraKey, magicLinkKey } = CONFIG;

export const FinanceWidgetProviders: React.FC<FinanceWidgetProvidersProps> =
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
              infuraKey={infuraKey}
              {...props}
            >
              <BlockNumberProvider>
                <BosonProvider {...props}>
                  <GlobalStyle />
                  <SignerProvider
                    parentOrigin={parentOrigin}
                    withExternalSigner={props.withExternalSigner}
                  >
                    <ConvertionRateProvider>
                      <ModalProvider>{children}</ModalProvider>
                    </ConvertionRateProvider>
                  </SignerProvider>
                </BosonProvider>
              </BlockNumberProvider>
            </ConfigProvider>
          </Web3Provider>
        </WithReduxProvider>
      </BosonThemeProvider>
    );
  });
