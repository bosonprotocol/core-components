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
import GlobalStyle from "../../styles/GlobalStyle";
import { WalletConnectionProviderProps } from "../../wallet/WalletConnectionProvider";
import { WithReduxProvider, WithReduxProviderProps } from "../ReduxProvider";
import { getParentWindowOrigin } from "../common";
import { CommonWidgetTypes } from "../types";
import ConvertionRateProvider, {
  ConvertionRateProviderProps
} from "./convertion-rate/ConvertionRateProvider";
import { BosonProvider, BosonProviderProps } from "../../boson/BosonProvider";

export type FinanceWidgetProvidersProps = Omit<
  WalletConnectionProviderProps,
  "children" | "envName"
> &
  Omit<ConfigProviderProps, "magicLinkKey" | "infuraKey"> &
  CommonWidgetTypes &
  ConvertionRateProviderProps &
  BosonProviderProps &
  WithReduxProviderProps & {
    children: ReactNode;
  };

const { infuraKey, magicLinkKey } = CONFIG;

export const FinanceWidgetProviders: React.FC<FinanceWidgetProvidersProps> =
  withQueryClientProvider(({ children, ...props }) => {
    const parentOrigin = getParentWindowOrigin();
    return (
      <WithReduxProvider
        withCustomReduxContext={props.withCustomReduxContext}
        withReduxProvider={props.withReduxProvider}
      >
        <ConfigProvider
          magicLinkKey={magicLinkKey}
          infuraKey={infuraKey}
          {...props}
        >
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
        </ConfigProvider>
      </WithReduxProvider>
    );
  });
