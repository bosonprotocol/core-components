import React, { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { CONFIG } from "../../../lib/config/config";
import ChatProvider from "../../chat/ChatProvider/ChatProvider";
import {
  ConfigProvider,
  ConfigProviderProps
} from "../../config/ConfigProvider";
import { IpfsProvider, IpfsProviderProps } from "../../ipfs/IpfsProvider";
import { MagicProvider } from "../../magicLink/MagicContext";
import ModalProvider from "../../modal/ModalProvider";
import { SignerProvider } from "../../signer/SignerContext";
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

export type RedemptionWidgetProvidersProps = IpfsProviderProps &
  Omit<ConfigProviderProps, "magicLinkKey" | "infuraKey"> &
  Omit<RedemptionContextProps, "setWidgetAction"> &
  ConvertionRateProviderProps &
  CommonWidgetTypes &
  Omit<WalletConnectionProviderProps, "children" | "envName"> & {
    signatures?: string[] | undefined | null; // signature1,signature2,signature3
  } & {
    children: ReactNode;
  };

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
});
const { infuraKey, magicLinkKey } = CONFIG;

export const RedemptionWidgetProviders: React.FC<
  RedemptionWidgetProvidersProps
> = ({ children, ...props }) => {
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
          <QueryClientProvider client={queryClient}>
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
          </QueryClientProvider>
        </MagicProvider>
      </SignerProvider>
    </ConfigProvider>
  );
};
