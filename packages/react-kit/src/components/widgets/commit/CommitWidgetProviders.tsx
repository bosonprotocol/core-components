import React, { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { CONFIG } from "../../../lib/config/config";
import ChatProvider from "../../chat/ChatProvider/ChatProvider";
import {
  ConfigProvider,
  ConfigProviderProps
} from "../../config/ConfigProvider";
import {
  EnvironmentProvider,
  EnvironmentProviderProps
} from "../../environment/EnvironmentProvider";
import { IpfsProvider, IpfsProviderProps } from "../../ipfs/IpfsProvider";
import { MagicProvider } from "../../magicLink/MagicContext";
import ModalProvider from "../../modal/ModalProvider";
import GlobalStyle from "../../styles/GlobalStyle";
import WalletConnectionProvider, {
  WalletConnectionProviderProps
} from "../../wallet/WalletConnectionProvider";
import ConvertionRateProvider, {
  ConvertionRateProviderProps
} from "../finance/convertion-rate/ConvertionRateProvider";

export type CommitWidgetProvidersProps = IpfsProviderProps &
  Omit<ConfigProviderProps, "magicLinkKey" | "infuraKey"> &
  EnvironmentProviderProps &
  ConvertionRateProviderProps &
  Omit<WalletConnectionProviderProps, "children" | "envName"> & {
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

export const CommitWidgetProviders: React.FC<CommitWidgetProvidersProps> = ({
  children,
  ...props
}) => {
  return (
    <EnvironmentProvider
      envName={props.envName}
      configId={props.configId}
      metaTx={props.metaTx}
    >
      {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment, prettier/prettier
        /* @ts-ignore */
      }
      <GlobalStyle />
      <ConfigProvider
        magicLinkKey={magicLinkKey}
        infuraKey={infuraKey}
        {...props}
      >
        <MagicProvider>
          <QueryClientProvider client={queryClient}>
            <WalletConnectionProvider
              walletConnectProjectId={props.walletConnectProjectId}
            >
              <ChatProvider>
                <IpfsProvider {...props}>
                  <ConvertionRateProvider>
                    <ModalProvider>{children}</ModalProvider>
                  </ConvertionRateProvider>
                </IpfsProvider>
              </ChatProvider>
            </WalletConnectionProvider>
          </QueryClientProvider>
        </MagicProvider>
      </ConfigProvider>
    </EnvironmentProvider>
  );
};