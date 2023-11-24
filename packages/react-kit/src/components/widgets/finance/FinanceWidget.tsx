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
import ConnectButton from "../../wallet/ConnectButton";
import Grid from "../../ui/Grid";
import { useCurrentSellers } from "../../../hooks/useCurrentSellers";
import { useAccount } from "../../../hooks/connection/connection";
dayjs.extend(isBetween);

const Wrapper = styled.div`
  text-align: center;
`;

function WithSellerData(WrappedComponent: React.ComponentType<Props>) {
  const ComponentWithSellerData = (props: Partial<Pick<Props, "sellerId">>) => {
    const sellerId = props.sellerId;
    const { address } = useAccount();
    const { sellerIds } = useCurrentSellers({
      address,
      sellerId: sellerId,
      enabled: !sellerId
    });
    const sellerIdToUse = sellerId || sellerIds?.[0] || "";
    const sellerRoles = useSellerRoles(sellerIdToUse);
    const {
      store: { tokens }
    } = useConvertionRate();

    const exchangesTokens = useExchangeTokens(
      {
        sellerId: sellerIdToUse
      },
      {
        enabled: !!sellerIdToUse
      }
    );
    const sellerDeposit = useSellerDeposit(
      {
        sellerId: sellerIdToUse
      },
      { enabled: !!sellerIdToUse }
    );
    const funds = useFunds(sellerIdToUse, tokens);
    const newProps = useMemo(
      () => ({
        sellerId: sellerIdToUse,
        exchangesTokens,
        sellerDeposit,
        funds,
        sellerRoles
      }),
      [sellerIdToUse, exchangesTokens, sellerDeposit, funds, sellerRoles]
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
} & Omit<ConfigProviderProps, "magicLinkKey" | "infuraKey"> &
  EnvironmentProviderProps &
  ConvertionRateProviderProps &
  (
    | { parentOrigin: `http${string}`; sellerId: undefined }
    | { parentOrigin: undefined | null; sellerId: string }
  );

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
        <SignerProvider parentOrigin={parentOrigin}>
          <MagicProvider>
            <WalletConnectionProvider
              walletConnectProjectId={walletConnectProjectId}
            >
              <QueryClientProvider client={queryClient}>
                <ConvertionRateProvider>
                  <ModalProvider>
                    {!parentOrigin && (
                      <Grid justifyContent="flex-end">
                        <ConnectButton showChangeWallet />
                      </Grid>
                    )}
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
