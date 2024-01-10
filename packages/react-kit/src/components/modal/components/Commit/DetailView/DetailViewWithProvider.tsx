import dayjs from "dayjs";
import React, { useEffect, useMemo } from "react";
import { useExchangeTokenBalance } from "../../../../../hooks/offer/useExchangeTokenBalance";
import useCheckTokenGatedOffer from "../../../../../hooks/tokenGated/useCheckTokenGatedOffer";
import useCheckExchangePolicy from "../../../../../hooks/useCheckExchangePolicy";
import { useSellers } from "../../../../../hooks/useSellers";
import { getDateTimestamp } from "../../../../../lib/dates/getDateTimestamp";
import { useConfigContext } from "../../../../config/ConfigContext";
import Loading from "../../../../ui/loading/Loading";
import InnerDetailViewWithCTAs, {
  DetailViewWithCTAsProps
} from "./InnerDetailViewWithCTAs";
import {
  DetailViewWithPortalProps,
  InnerDetailViewWithPortal
} from "./InnerDetailViewWithPortal";
import {
  DetailContextProps,
  DetailViewProvider,
  useDetailViewContext
} from "./common/DetailViewProvider";

export type DetailViewWithProviderProps = ConsumerProps &
  (DetailViewWithCTAsProps | DetailViewWithPortalProps);
export const DetailViewWithProvider: React.FC<DetailViewWithProviderProps> = (
  props
) => {
  const { selectedVariant, onGetProviderProps } = props;
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
  // const {
  //   store: { tokens: defaultTokens }
  // } = useConvertionRate();
  const exchangePolicyCheckResult = useCheckExchangePolicy({
    offerId: offer.id,
    defaultDisputeResolverId:
      config.config.defaultDisputeResolverId || "unknown",
    defaultTokens: config.config.defaultTokens ?? [], // TODO: check default tokens list
    fairExchangePolicyRules: config.fairExchangePolicyRules
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
    return <div>There has been an error, please try again later...</div>;
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
      exchangePolicyCheckResult={exchangePolicyCheckResult}
    >
      {withCTAs ? (
        <InnerDetailViewWithCTAs {...props} />
      ) : (
        <InnerDetailViewWithPortal {...props} />
      )}
      <Consumer onGetProviderProps={onGetProviderProps} />
    </DetailViewProvider>
  );
};

type ConsumerProps = {
  onGetProviderProps?: (props: DetailContextProps) => void;
};
const Consumer = ({ onGetProviderProps }: ConsumerProps) => {
  const contextProps = useDetailViewContext();
  useEffect(() => {
    if (onGetProviderProps) {
      onGetProviderProps(contextProps);
    }
  }, [onGetProviderProps, contextProps]);
  return null;
};
