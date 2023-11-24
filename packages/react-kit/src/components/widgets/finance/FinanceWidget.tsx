import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

import React, { useMemo } from "react";
import styled from "styled-components";
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
import { useDisconnect } from "../../../hooks/connection/useDisconnect";
import { ethers } from "ethers";
dayjs.extend(isBetween);

const StyledConnectButton = styled(ConnectButton)`
  padding: 10px;
`;

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
    const { sellerRoles, seller } = useSellerRoles(sellerIdToUse);
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
    const disconnect = useDisconnect();

    if (exchangesTokens.isLoading || sellerDeposit.isLoading) {
      return (
        <Wrapper>
          <Loading />
        </Wrapper>
      );
    }
    if (address && !sellerIdToUse) {
      return (
        <p style={{ textAlign: "center" }}>
          Connect a wallet that has a seller account
        </p>
      );
    }
    const forcedAccount =
      sellerId && !sellerRoles.isAssistant ? seller?.assistant : "";
    if (
      forcedAccount &&
      address &&
      forcedAccount.toLowerCase() !== address.toLowerCase()
    ) {
      // force disconnection as the current connected wallet is not the forced one
      disconnect();
    }

    if (forcedAccount) {
      return (
        <p style={{ textAlign: "center" }}>
          Please connect this wallet account{" "}
          <strong>{ethers.utils.getAddress(forcedAccount)}</strong> (which is
          linked to the <strong>assistant</strong> role of the seller id{" "}
          <strong>{sellerId}</strong>)
        </p>
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
  ConvertionRateProviderProps & {
    parentOrigin: `http${string}` | undefined | null;
    sellerId: string | null | undefined;
  };

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
                        <StyledConnectButton showChangeWallet />
                      </Grid>
                    )}
                    <Component sellerId={sellerId ?? undefined} />
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
