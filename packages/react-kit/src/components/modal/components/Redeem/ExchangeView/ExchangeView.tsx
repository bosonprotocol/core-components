import React from "react";
import { useExchanges } from "../../../../../hooks/useExchanges";
import { useSellers } from "../../../../../hooks/useSellers";
import Loading from "../../../../ui/loading/Loading";
import DetailView from "./DetailView/DetailView";
type Props = {
  onBackClick: () => void;
  onNextClick: () => void;
  onExchangePolicyClick: () => void;
  exchangeId: string;
  isValid: boolean;
};

export function ExchangeView({
  onBackClick,
  onNextClick,
  onExchangePolicyClick,
  exchangeId
}: Props) {
  const {
    data: exchanges,
    isError,
    isLoading,
    refetch: reload
  } = useExchanges(
    {
      id: exchangeId,
      disputed: null
    },
    {
      enabled: !!exchangeId
    }
  );
  const exchange = exchanges?.[0];
  const offer = exchange?.offer;
  const { data: sellers } = useSellers(
    {
      id: offer?.seller.id,
      includeFunds: true
    },
    {
      enabled: !!offer?.seller.id
    }
  );

  if (!offer) {
    return <div data-testid="notFound">This exchange does not exist</div>;
  }
  const sellerAvailableDeposit = sellers?.[0]?.funds?.find(
    (fund) => fund.token.address === offer?.exchangeToken.address
  )?.availableAmount;
  const offerRequiredDeposit = Number(offer?.sellerDeposit || 0);
  const hasSellerEnoughFunds =
    offerRequiredDeposit > 0
      ? Number(sellerAvailableDeposit) >= offerRequiredDeposit
      : true;
  if (isLoading) {
    return <Loading />;
  }

  if (isError || !exchangeId) {
    return (
      <div data-testid="errorExchange">
        There has been an error, please try again later...
      </div>
    );
  }

  return (
    <>
      <DetailView
        hasSellerEnoughFunds={hasSellerEnoughFunds}
        offer={offer}
        exchange={exchange}
        reload={reload}
        onExchangePolicyClick={onExchangePolicyClick}
        onBackClick={onBackClick}
      />
    </>
  );
}
