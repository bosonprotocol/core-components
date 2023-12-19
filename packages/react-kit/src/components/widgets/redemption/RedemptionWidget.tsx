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
import { RedemptionContextProps } from "./provider/RedemptionContext";
import { RedemptionProvider } from "./provider/RedemptionProvider";
import { RedeemNonModalProps } from "../../modal/components/Redeem/RedeemNonModal";
import { RedeemModalWithExchange } from "./RedeemModalWithExchange";
import { MagicProvider } from "../../magicLink/MagicContext";
import { CONFIG } from "../../../lib/config/config";
import { SignerProvider } from "../../signer/SignerContext";

type RedemptionProps = {
  buttonProps?: Omit<ButtonProps, "onClick">;
  trigger?: ComponentType<{ onClick: () => unknown }> | undefined;
} & Omit<RedeemNonModalProps, "exchange" | "hideModal"> & {
    exchangeId?: string;
    closeWidgetClick?: () => void;
    modalMargin?: string;
  };

type WidgetProps = RedemptionProps &
  IpfsProviderProps &
  Omit<ConfigProviderProps, "magicLinkKey" | "infuraKey"> &
  Omit<RedemptionContextProps, "setWidgetAction"> &
  EnvironmentProviderProps &
  ConvertionRateProviderProps &
  Omit<WalletConnectionProviderProps, "children" | "envName"> & {
    withExternalSigner?: boolean;
    signatures?: string[] | undefined | null; // signature1,signature2,signature3
  };
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
});

const { infuraKey, magicLinkKey } = CONFIG;

export function RedemptionWidget(props: WidgetProps) {
  const parentOrigin =
    window.location !== window.parent.location && document.referrer
      ? new URL(document.referrer).origin
      : null;
  const parentOriginToUse = props.withExternalSigner ? parentOrigin : null;
  const sellerIds = Array.isArray(props.sellerIds)
    ? props.sellerIds
    : undefined;
  const signatures = Array.isArray(props.signatures)
    ? props.signatures
    : undefined;
  return (
    <div style={{ margin: props.modalMargin || "0" }}>
      <EnvironmentProvider
        envName={props.envName}
        configId={props.configId}
        metaTx={props.metaTx}
      >
        {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment, prettier/prettier
          /* @ts-ignore */}
        <GlobalStyle />
        <ConfigProvider
          magicLinkKey={magicLinkKey}
          infuraKey={infuraKey}
          {...props}
        >
          <SignerProvider parentOrigin={parentOriginToUse}>
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
                            <RedeemModalWithExchange
                              {...props}
                              sellerIds={sellerIds}
                              signatures={signatures}
                              parentOrigin={parentOrigin}
                              hideModal={props.closeWidgetClick}
                            />
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
      </EnvironmentProvider>
    </div>
  );
}
