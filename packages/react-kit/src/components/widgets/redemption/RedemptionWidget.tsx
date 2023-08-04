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
import { ExtendedOmit } from "../../../types/helpers";
import { useExchanges } from "../../../hooks/useExchanges";
import ConvertionRateProvider, {
  ConvertionRateProviderProps
} from "../finance/convertion-rate/ConvertionRateProvider";
import RedeemModal, {
  RedeemModalProps
} from "../../modal/components/Redeem/RedeemModal";

type RedemptionProps = {
  buttonProps?: Omit<ButtonProps, "onClick">;
  trigger?: ComponentType<{ onClick: () => unknown }> | undefined;
  exchangeId?: string;
  fairExchangePolicyRules: string;
  defaultDisputeResolverId: string;
};

type WidgetProps = RedemptionProps &
  IpfsProviderProps &
  ConfigProviderProps &
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

function WithExchange(WrappedComponent: React.ComponentType<RedeemModalProps>) {
  const ComponentWithExchange = (
    props: Omit<RedeemModalProps, "exchange"> & { exchangeId?: string }
  ) => {
    const { data: exchanges } = useExchanges(
      {
        id: props.exchangeId
      },
      {
        enabled: !!props.exchangeId
      }
    );
    const exchange = exchanges?.[0];
    return <WrappedComponent {...props} exchange={exchange} />;
  };
  return ComponentWithExchange;
}

const RedeemModalWithExchange = WithExchange(RedeemModal);

export function RedemptionWidget(props: WidgetProps) {
  return (
    <EnvironmentProvider envName={props.envName}>
      {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment, prettier/prettier
        /* @ts-ignore */}
      <GlobalStyle />
      <ConfigProvider {...props}>
        <QueryClientProvider client={queryClient}>
          <WalletConnectionProvider
            envName={props.envName}
            walletConnectProjectId={props.walletConnectProjectId}
          >
            <ChatProvider>
              <IpfsProvider {...props}>
                <ConvertionRateProvider
                  defaultTokensList={props.defaultTokensList}
                >
                  <ModalProvider>
                    <RedeemModalWithExchange {...props} />
                  </ModalProvider>
                </ConvertionRateProvider>
              </IpfsProvider>
            </ChatProvider>
          </WalletConnectionProvider>
        </QueryClientProvider>
      </ConfigProvider>
    </EnvironmentProvider>
  );
}
