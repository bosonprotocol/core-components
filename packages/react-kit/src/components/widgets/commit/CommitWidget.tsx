import React, { ComponentType } from "react";
import { ButtonProps } from "../../buttons/Button";
import {
  EnvironmentProvider,
  EnvironmentProviderProps
} from "../../environment/EnvironmentProvider";
import { IpfsProvider, IpfsProviderProps } from "../../ipfs/IpfsProvider";
import ModalProvider from "../../modal/ModalProvider";
import GlobalStyle from "../../styles/GlobalStyle";
import WalletConnectionProvider, {
  WalletConnectionProviderProps
} from "../../wallet/WalletConnectionProvider";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  ConfigProvider,
  ConfigProviderProps
} from "../../config/ConfigProvider";
import ChatProvider from "../../chat/ChatProvider/ChatProvider";
import ConvertionRateProvider, {
  ConvertionRateProviderProps
} from "../finance/convertion-rate/ConvertionRateProvider";
import { CommitNonModalProps } from "../../modal/components/Commit/CommitNonModal";
import { CommitModalWithOffer } from "./CommitModalWithOffer";
import { MagicProvider } from "../../magicLink/MagicContext";
import { CONFIG } from "../../../lib/config/config";

type CommitProps = {
  buttonProps?: Omit<ButtonProps, "onClick">;
  trigger?: ComponentType<{ onClick: () => unknown }> | undefined;
} & Omit<CommitNonModalProps, "product" | "isLoading" | "hideModal"> & {
    closeWidgetClick?: () => void;
    offerId?: string;
    sellerId?: string;
    productUuid?: string;
    defaultSelectedOfferId?: string;
    disableVariationsSelects?: boolean;
  };

type WidgetProps = CommitProps &
  IpfsProviderProps &
  Omit<ConfigProviderProps, "magicLinkKey" | "infuraKey"> &
  EnvironmentProviderProps &
  ConvertionRateProviderProps &
  Omit<WalletConnectionProviderProps, "children" | "envName">;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
});

const { infuraKey, magicLinkKey } = CONFIG;

export function CommitWidget(props: WidgetProps) {
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
                    <ModalProvider>
                      <CommitModalWithOffer
                        {...props}
                        hideModal={props.closeWidgetClick}
                      />
                    </ModalProvider>
                  </ConvertionRateProvider>
                </IpfsProvider>
              </ChatProvider>
            </WalletConnectionProvider>
          </QueryClientProvider>
        </MagicProvider>
      </ConfigProvider>
    </EnvironmentProvider>
  );
}
