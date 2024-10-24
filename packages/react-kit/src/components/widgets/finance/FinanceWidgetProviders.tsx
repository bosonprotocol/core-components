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
import { WithReduxProvider, WithReduxProviderProps } from "../ReduxProvider";
import { getParentWindowOrigin } from "../common";
import { CommonWidgetTypes } from "../types";
import ConvertionRateProvider, {
  ConvertionRateProviderProps
} from "./convertion-rate/ConvertionRateProvider";
import { BosonProvider, BosonProviderProps } from "../../boson/BosonProvider";
import { Web3Provider, Web3ProviderProps } from "../../wallet2/web3Provider";
import { BlockNumberProvider } from "../../../hooks/contracts/useBlockNumber";

export type FinanceWidgetProvidersProps = Omit<
  ConfigProviderProps,
  "magicLinkKey" | "infuraKey"
> &
  Omit<Web3ProviderProps, "infuraKey"> &
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
    );
  });
