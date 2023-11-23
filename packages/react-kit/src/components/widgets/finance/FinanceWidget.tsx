import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Web3LibAdapter } from "@bosonprotocol/common";
import useOffersBacked from "./useOffersBacked";
import Loading from "../../ui/loading/Loading";
import Finance, { Props } from "./Finance";
import { useSellerRoles } from "./useSellerRoles";
import { useConvertionRate } from "./convertion-rate/useConvertionRate";
import { useExchangeTokens } from "./exchange-tokens/useExchangeTokens";
import { useSellerDeposit } from "./useSellerDeposit";
import useFunds from "./useFunds";
import WalletConnectionProvider from "../../wallet/WalletConnectionProvider";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  EnvironmentProvider,
  EnvironmentProviderProps
} from "../../environment/EnvironmentProvider";
import ModalProvider from "../../modal/ModalProvider";
import ConvertionRateProvider, {
  ConvertionRateProviderProps
} from "./convertion-rate/ConvertionRateProvider";
import GlobalStyle from "../../styles/GlobalStyle";
import {
  ConfigProvider,
  ConfigProviderProps
} from "../../config/ConfigProvider";
import { CONFIG } from "../../../lib/config/config";
import { MagicProvider } from "../../magicLink/MagicContext";
import { SignerProvider } from "../../signer/SignerContext";
import { getExternalSignerListener } from "../../../lib/signer/externalSigner";
dayjs.extend(isBetween);

const Wrapper = styled.div`
  text-align: center;
`;

function WithSellerData(WrappedComponent: React.ComponentType<Props>) {
  const ComponentWithSellerData = (props: Pick<Props, "sellerId">) => {
    const sellerId = props.sellerId;
    const sellerRoles = useSellerRoles(sellerId || "");
    const {
      store: { tokens }
    } = useConvertionRate();

    const exchangesTokens = useExchangeTokens(
      {
        sellerId: sellerId || ""
      },
      {
        enabled: !!sellerId
      }
    );
    const sellerDeposit = useSellerDeposit(
      {
        sellerId: sellerId || ""
      },
      { enabled: !!sellerId }
    );
    const funds = useFunds(sellerId || "", tokens);
    const newProps = useMemo(
      () => ({
        sellerId,
        exchangesTokens,
        sellerDeposit,
        funds,
        sellerRoles
      }),
      [sellerId, exchangesTokens, sellerDeposit, funds, sellerRoles]
    );

    const offersBacked = useOffersBacked({ ...newProps });

    if (exchangesTokens.isLoading || sellerDeposit.isLoading) {
      return (
        <Wrapper>
          <Loading />
        </Wrapper>
      );
    }
    return (
      <WrappedComponent {...props} {...newProps} offersBacked={offersBacked} />
    );
  };
  return ComponentWithSellerData;
}

const Component = WithSellerData(Finance);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
});

type FinanceWidgetProps = {
  walletConnectProjectId: string;
  parentOrigin: `http${string}`;
} & Omit<ConfigProviderProps, "magicLinkKey" | "infuraKey"> &
  EnvironmentProviderProps &
  ConvertionRateProviderProps &
  Parameters<typeof Component>[0];

const { infuraKey, magicLinkKey } = CONFIG;

export function FinanceWidget({
  envName,
  configId,
  walletConnectProjectId,
  sellerId,
  metaTx,
  parentOrigin,
  ...rest
}: FinanceWidgetProps) {
  const externalSignerListener = useMemo(
    () => getExternalSignerListener({ parentOrigin }),
    [parentOrigin]
  );
  const [externalSigner, setExternalSigner] = useState<
    Web3LibAdapter | undefined
  >();
  useEffect(() => {
    function onMessageReceived(event: MessageEvent) {
      if (event.origin === parentOrigin) {
        if ([true, false].includes(event.data.hasSigner)) {
          if (event.data.hasSigner) {
            setExternalSigner(externalSignerListener);
          } else {
            setExternalSigner(undefined);
          }
        }
      }
    }
    window.addEventListener("message", onMessageReceived);
    return () => {
      window.removeEventListener("message", onMessageReceived);
    };
  }, [externalSigner, externalSignerListener, parentOrigin]);
  return (
    <EnvironmentProvider envName={envName} configId={configId} metaTx={metaTx}>
      {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment, prettier/prettier
        /* @ts-ignore */}
      <GlobalStyle />
      <ConfigProvider
        magicLinkKey={magicLinkKey}
        infuraKey={infuraKey}
        {...rest}
      >
        <SignerProvider externalSigner={externalSigner}>
          <MagicProvider>
            <WalletConnectionProvider
              walletConnectProjectId={walletConnectProjectId}
            >
              <QueryClientProvider client={queryClient}>
                <ConvertionRateProvider>
                  <ModalProvider>
                    <Component sellerId={sellerId} />
                  </ModalProvider>
                </ConvertionRateProvider>
              </QueryClientProvider>
            </WalletConnectionProvider>
          </MagicProvider>
        </SignerProvider>
      </ConfigProvider>
    </EnvironmentProvider>
  );
}

export default FinanceWidget;
