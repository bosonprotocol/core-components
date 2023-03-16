import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

import React, { useMemo } from "react";
import styled from "styled-components";

import useOffersBacked from "./useOffersBacked";
import Loading from "../../ui/Loading";
import Finance, { Props } from "./Finance";
import { useSellerRoles } from "./useSellerRoles";
import { useConvertionRate } from "./convertion-rate/useConvertionRate";
import { useExchangeTokens } from "./exchange-tokens/useExchangeTokens";
import { useSellerDeposit } from "./useSellerDeposit";
import useFunds from "./useFunds";
import WalletConnectionProvider from "../../wallet/WalletConnectionProvider";
import { QueryClient, QueryClientProvider } from "react-query";
import { EnvironmentType } from "@bosonprotocol/core-sdk";
import { EnvironmentProvider } from "../../environment/EnvironmentProvider";
import ModalProvider from "../../modal/ModalProvider";
import ConvertionRateProvider from "./convertion-rate/ConvertionRateProvider";
import GlobalStyle from "../../styles/GlobalStyle";
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
  envName: EnvironmentType;
  sellerId: string;
  defaultTokensList: string;
};
export function FinanceWidget({
  envName,
  sellerId,
  defaultTokensList
}: FinanceWidgetProps) {
  return (
    <EnvironmentProvider envName={envName}>
      {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment, prettier/prettier
        /* @ts-ignore */}
      <GlobalStyle />
      <WalletConnectionProvider envName={envName}>
        <QueryClientProvider client={queryClient}>
          <ConvertionRateProvider defaultTokensList={defaultTokensList}>
            <ModalProvider>
              <Component sellerId={sellerId} />
            </ModalProvider>
          </ConvertionRateProvider>
        </QueryClientProvider>
      </WalletConnectionProvider>
    </EnvironmentProvider>
  );
}

export default FinanceWidget;
