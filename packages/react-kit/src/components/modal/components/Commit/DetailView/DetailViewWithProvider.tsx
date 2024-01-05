import React, { useMemo } from "react";
import {
  InnerDetailViewWithPortal,
  DetailViewWithPortalProps
} from "./InnerDetailViewWithPortal";
import InnerDetailViewWithCTAs, {
  DetailViewWithCTAsProps
} from "./InnerDetailViewWithCTAs";
import { DetailViewProvider } from "./common/DetailViewProvider";
import { useExchangeTokenBalance } from "../../../../../hooks/offer/useExchangeTokenBalance";
import dayjs from "dayjs";
import { getDateTimestamp } from "../../../../../lib/dates/getDateTimestamp";
import useCheckTokenGatedOffer from "../../../../../hooks/tokenGated/useCheckTokenGatedOffer";
import { useConfigContext } from "../../../../config/ConfigContext";
import { useSellers } from "../../../../../hooks/useSellers";
import Loading from "../../../../ui/loading/Loading";

export type DetailViewWithProviderProps =
  | DetailViewWithCTAsProps
  | DetailViewWithPortalProps;
export const DetailViewWithProvider: React.FC<DetailViewWithProviderProps> = (
  props
) => {
  const { selectedVariant } = props;
  const withCTAs = !("children" in props);
  const { offer } = selectedVariant;

  const quantity = useMemo<number>(
    () => Number(offer?.quantityAvailable || 0),
    [offer?.quantityAvailable]
  );
  const isFreeOffer = offer.price === "0";

  const { balance: exchangeTokenBalance, loading: balanceLoading } =
    useExchangeTokenBalance(offer.exchangeToken, {
      enabled: !isFreeOffer
    });
  const isBuyerInsufficientFunds: boolean = useMemo(
    () =>
      isFreeOffer
        ? false
        : !!exchangeTokenBalance && exchangeTokenBalance.lte(offer.price),
    [exchangeTokenBalance, offer.price, isFreeOffer]
  );
  const nowDate = dayjs();

  const isOfferNotValidYet = dayjs(
    getDateTimestamp(offer?.validFromDate)
  ).isAfter(nowDate);
  const isExpiredOffer = useMemo<boolean>(
    () => dayjs(getDateTimestamp(offer?.validUntilDate)).isBefore(dayjs()),
    [offer?.validUntilDate]
  );
  const config = useConfigContext();

  const { commitProxyAddress } = config;

  const { isConditionMet } = useCheckTokenGatedOffer({
    commitProxyAddress,
    offer
  });
  const {
    data: sellers,
    isLoading: isSellersLoading,
    isError: isSellersError
  } = useSellers(
    {
      id: offer?.seller.id,
      includeFunds: true
    },
    {
      enabled: !!offer?.seller.id
    }
  );
  const sellerAvailableDeposit = sellers?.[0]?.funds?.find(
    (fund) => fund.token.address === offer?.exchangeToken.address
  )?.availableAmount;
  const offerRequiredDeposit = Number(offer?.sellerDeposit || 0);

  const hasSellerEnoughFunds =
    offerRequiredDeposit > 0
      ? Number(sellerAvailableDeposit) >= offerRequiredDeposit
      : true;
  if (isSellersLoading) {
    return <Loading />;
  }
  if (isSellersError) {
    return (
      <div data-testid="errorOffer">
        There has been an error, please try again later...
      </div>
    );
  }
  return (
    <DetailViewProvider
      quantity={quantity}
      isBuyerInsufficientFunds={isBuyerInsufficientFunds}
      balanceLoading={balanceLoading}
      exchangeTokenBalance={exchangeTokenBalance}
      isOfferNotValidYet={isOfferNotValidYet}
      isExpiredOffer={isExpiredOffer}
      isConditionMet={isConditionMet}
      hasSellerEnoughFunds={hasSellerEnoughFunds}
    >
      {withCTAs ? (
        <InnerDetailViewWithCTAs {...props} />
      ) : (
        <InnerDetailViewWithPortal {...props} />
      )}
    </DetailViewProvider>
  );
};
