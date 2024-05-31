import React, { ReactNode } from "react";
import { CONFIG } from "../../../lib/config/config";
import ChatProvider from "../../chat/ChatProvider/ChatProvider";
import {
  ConfigProvider,
  ConfigProviderProps
} from "../../config/ConfigProvider";
import { IpfsProvider, IpfsProviderProps } from "../../ipfs/IpfsProvider";
import { MagicProvider } from "../../magicLink/MagicProvider";
import ModalProvider from "../../modal/ModalProvider";
import { SignerProvider } from "../../signer/SignerProvider";
import GlobalStyle from "../../styles/GlobalStyle";
import WalletConnectionProvider, {
  WalletConnectionProviderProps
} from "../../wallet/WalletConnectionProvider";
import { getParentWindowOrigin } from "../common";
import ConvertionRateProvider, {
  ConvertionRateProviderProps
} from "../finance/convertion-rate/ConvertionRateProvider";
import { CommonWidgetTypes } from "../types";
import { RedemptionContextProps } from "./provider/RedemptionContext";
import { RedemptionProvider } from "./provider/RedemptionProvider";
import { withQueryClientProvider } from "../../queryClient/withQueryClientProvider";
import { WithReduxProvider, WithReduxProviderProps } from "../ReduxProvider";

export type RedemptionWidgetProvidersProps = IpfsProviderProps &
  Omit<ConfigProviderProps, "magicLinkKey" | "infuraKey"> &
  Omit<RedemptionContextProps, "setWidgetAction"> &
  ConvertionRateProviderProps &
  CommonWidgetTypes &
  Omit<WalletConnectionProviderProps, "children" | "envName"> &
  WithReduxProviderProps & {
    signatures?: string[] | undefined | null; // signature1,signature2,signature3
  } & {
    children: ReactNode;
  };

const { infuraKey, magicLinkKey } = CONFIG;

export const RedemptionWidgetProviders: React.FC<RedemptionWidgetProvidersProps> =
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
          <GlobalStyle />
          <SignerProvider
            parentOrigin={parentOrigin}
            withExternalSigner={props.withExternalSigner}
          >
            <MagicProvider>
              <WalletConnectionProvider
                walletConnectProjectId={props.walletConnectProjectId}
              >
                <ChatProvider>
                  <IpfsProvider {...props}>
                    <ConvertionRateProvider>
                      <ModalProvider>
                        <RedemptionProvider {...props}>
                          {children}
                        </RedemptionProvider>
                      </ModalProvider>
                    </ConvertionRateProvider>
                  </IpfsProvider>
                </ChatProvider>
              </WalletConnectionProvider>
            </MagicProvider>
          </SignerProvider>
        </ConfigProvider>
      </WithReduxProvider>
    );
  });
