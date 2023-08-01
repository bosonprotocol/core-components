import React, { ComponentType, useCallback } from "react";
import { ButtonProps, Button } from "../../buttons/Button";
import {
  EnvironmentProvider,
  EnvironmentProviderProps
} from "../../environment/EnvironmentProvider";
import { IpfsProvider, IpfsProviderProps } from "../../ipfs/IpfsProvider";
import ModalProvider from "../../modal/ModalProvider";
import { useModal } from "../../modal/useModal";
import { GenericModalProps } from "../../modal/ModalContext";
import GlobalStyle from "../../styles/GlobalStyle";
import Grid from "../../ui/Grid";
import Typography from "../../ui/Typography";
import ConnectButton from "../../wallet/ConnectButton";
import WalletConnectionProvider, {
  WalletConnectionProviderProps
} from "../../wallet/WalletConnectionProvider";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  ConfigProvider,
  ConfigProviderProps
} from "../../config/ConfigProvider";
import ChatProvider from "../../chat/ChatProvider/ChatProvider";
import { BosonFooter } from "../../modal/components/Redeem/BosonFooter";
import { ExtendedOmit } from "../../../types/helpers";
import { useExchanges } from "../../../hooks/useExchanges";
import ConvertionRateProvider, {
  ConvertionRateProviderProps
} from "../finance/convertion-rate/ConvertionRateProvider";

type RedemptionProps = {
  buttonProps?: Omit<ButtonProps, "onClick">;
  trigger?: ComponentType<{ onClick: () => unknown }> | undefined;
  modalProps?: NonNullable<
    ExtendedOmit<
      GenericModalProps<"REDEEM">,
      "headerComponent" | "footerComponent" | "title"
    >
  >;
  exchangeId?: string;
  fairExchangePolicyRules: string;
  defaultDisputeResolverId: string;
};
function Redemption({
  trigger: Trigger,
  modalProps,
  buttonProps,
  exchangeId,
  fairExchangePolicyRules,
  defaultDisputeResolverId
}: RedemptionProps) {
  const { showModal } = useModal();
  const { data: exchanges } = useExchanges(
    {
      id: exchangeId
    },
    {
      enabled: !!exchangeId
    }
  );
  const exchange = exchanges?.[0];
  const onClick = useCallback(() => {
    if (!exchangeId || !!exchange) {
      showModal("REDEEM", {
        ...modalProps,
        exchange,
        fairExchangePolicyRules,
        defaultDisputeResolverId,
        headerComponent: (
          <Grid>
            <Typography tag="h3">Redeem your item</Typography>
            <ConnectButton showChangeWallet />
          </Grid>
        ),
        footerComponent: <BosonFooter />
      });
    }
  }, [
    exchangeId,
    exchange,
    showModal,
    modalProps,
    fairExchangePolicyRules,
    defaultDisputeResolverId
  ]);
  if (Trigger) {
    return <Trigger onClick={onClick} />;
  }
  return (
    <Button {...buttonProps} onClick={onClick}>
      Redeem
    </Button>
  );
}

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
                    <Redemption {...props} />
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
