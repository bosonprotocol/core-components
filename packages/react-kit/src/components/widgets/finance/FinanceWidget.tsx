import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

import { ethers } from "ethers";
import React, { useEffect, useMemo, useRef } from "react";
import styled from "styled-components";
import { useAccount } from "../../../hooks/connection/connection";
import { useDisconnect } from "../../../hooks/connection/useDisconnect";
import { useCurrentSellers } from "../../../hooks/useCurrentSellers";
import { Grid } from "../../ui/Grid";
import Loading from "../../ui/loading/Loading";
import ConnectButton from "../../wallet/ConnectButton";
import Finance, { Props } from "./Finance";
import { useConvertionRate } from "./convertion-rate/useConvertionRate";
import { useExchangeTokens } from "./exchange-tokens/useExchangeTokens";
import useFunds from "./useFunds";
import { useOffersBacked } from "./useOffersBacked";
import { useSellerDeposit } from "./useSellerDeposit";
import { useSellerRoles } from "./useSellerRoles";
import {
  FinanceWidgetProviders,
  FinanceWidgetProvidersProps
} from "./FinanceWidgetProviders";
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
      sellerIds: sellerId ? [sellerId] : [],
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
    const addressRef = useRef<string | null>(null);
    useEffect(() => {
      if (address) {
        addressRef.current = null;
      }
    }, [address]);
    if (exchangesTokens.isLoading || sellerDeposit.isLoading) {
      return (
        <Wrapper>
          <Loading />
        </Wrapper>
      );
    }
    const forcedAccount =
      sellerId && !sellerRoles.isAssistant ? seller?.assistant : "";
    if (
      forcedAccount &&
      address &&
      forcedAccount.toLowerCase() !== address.toLowerCase()
    ) {
      addressRef.current = address;
      console.error(
        `disconnect account because connected account (${address}) is not ${forcedAccount}`
      );
      // force disconnection as the current connected wallet is not the forced one
      disconnect({ isUserDisconnecting: false });
    }

    if (forcedAccount && addressRef.current) {
      return (
        <p style={{ textAlign: "center" }}>
          Please connect this wallet account{" "}
          <strong>{ethers.utils.getAddress(forcedAccount)}</strong> (which is
          linked to the <strong>assistant</strong> role of the seller id{" "}
          <strong>{sellerId}</strong>). The connected address was{" "}
          {addressRef.current}
        </p>
      );
    }

    if (!address) {
      return <p style={{ textAlign: "center" }}>Please connect your wallet</p>;
    }

    if (!sellerIdToUse) {
      return (
        <p style={{ textAlign: "center" }}>
          Connect a wallet that has a seller account
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
type FinanceWidgetProps = FinanceWidgetProvidersProps & {
  sellerId: string | null | undefined;
};

export function FinanceWidget(props: FinanceWidgetProps) {
  const { sellerId, withExternalSigner } = props;
  return (
    <FinanceWidgetProviders {...props} withReduxProvider>
      {!withExternalSigner && (
        <Grid justifyContent="flex-end">
          <StyledConnectButton showChangeWallet />
        </Grid>
      )}
      <Component sellerId={sellerId ?? undefined} />
    </FinanceWidgetProviders>
  );
}
