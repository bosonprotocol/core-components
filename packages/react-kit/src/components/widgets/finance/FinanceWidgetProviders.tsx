import React, { ReactNode } from "react";
import { CONFIG } from "../../../lib/config/config";
import { withQueryClientProvider } from "../../queryClient/withQueryClientProvider";
import { Omit } from "utility-types";
import { CommonWidgetTypes } from "../types";
import { SignerProvider } from "../../signer/SignerProvider";
import GlobalStyle from "../../styles/GlobalStyle";
import {
  ConfigProvider,
  ConfigProviderProps
} from "../../config/ConfigProvider";
import ConvertionRateProvider, {
  ConvertionRateProviderProps
} from "./convertion-rate/ConvertionRateProvider";
import WalletConnectionProvider, {
  WalletConnectionProviderProps
} from "../../wallet/WalletConnectionProvider";
import ModalProvider from "../../modal/ModalProvider";
import { MagicProvider } from "../../magicLink/MagicProvider";
import { getParentWindowOrigin } from "../common";

export type FinanceWidgetProvidersProps = Omit<
  WalletConnectionProviderProps,
  "children" | "envName"
> &
  Omit<ConfigProviderProps, "magicLinkKey" | "infuraKey"> &
  CommonWidgetTypes &
  ConvertionRateProviderProps & {
    children: ReactNode;
  };

const { infuraKey, magicLinkKey } = CONFIG;

export const FinanceWidgetProviders: React.FC<FinanceWidgetProvidersProps> =
  withQueryClientProvider(({ children, ...props }) => {
    const parentOrigin = getParentWindowOrigin();
    return (
      <ConfigProvider
        magicLinkKey={magicLinkKey}
        infuraKey={infuraKey}
        {...props}
      >
        <GlobalStyle />
        <SignerProvider
          parentOrigin={parentOrigin}
          withExternalSigner={props.withExternalSigner}
        >
          <MagicProvider>
            <WalletConnectionProvider
              walletConnectProjectId={props.walletConnectProjectId}
            >
              <ConvertionRateProvider>
                <ModalProvider>{children}</ModalProvider>
              </ConvertionRateProvider>
            </WalletConnectionProvider>
          </MagicProvider>
        </SignerProvider>
      </ConfigProvider>
    );
  });