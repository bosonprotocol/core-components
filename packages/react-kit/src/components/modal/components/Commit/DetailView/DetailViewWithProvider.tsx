import dayjs from "dayjs";
import React, { useEffect, useMemo } from "react";
import { useExchangeTokenBalance } from "../../../../../hooks/offer/useExchangeTokenBalance";
import useCheckTokenGatedOffer from "../../../../../hooks/tokenGated/useCheckTokenGatedOffer";
import useCheckExchangePolicy from "../../../../../hooks/useCheckExchangePolicy";
import { useSellers } from "../../../../../hooks/useSellers";
import { getDateTimestamp } from "../../../../../lib/dates/getDateTimestamp";
import { useConfigContext } from "../../../../config/ConfigContext";
import Loading from "../../../../ui/loading/Loading";
import InnerCommitDetailView, {
  InnerCommitDetailViewProps
} from "./InnerCommitDetailView";
import {
  DetailContextProps,
  DetailViewProvider,
  useDetailViewContext
} from "./common/DetailViewProvider";
import { Field, swapQueryParameters } from "../../../../../lib/parameters/swap";
import { utils } from "ethers";
import {
  InnerDetailViewWithPortal,
  InnerDetailViewWithPortalProps
} from "./InnerDetailViewWithPortal";

export type DetailViewWithProviderProps =
  | InnerCommitDetailViewProps
  | InnerDetailViewWithPortalProps;
export const DetailViewWithProvider: React.FC<
  ConsumerProps & DetailViewWithProviderProps
> = (props) => {
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
  const minNeededBalance = exchangeTokenBalance?.sub(offer.price).mul(-1);

  const swapParams = useMemo(
    () =>
      ({
        [swapQueryParameters.outputCurrency]: offer.exchangeToken.address,
        [swapQueryParameters.exactAmount]: minNeededBalance
          ? utils.formatUnits(
              minNeededBalance || "",
              offer.exchangeToken.decimals
            )
          : "",
        [swapQueryParameters.exactField]: Field.OUTPUT.toLowerCase()
      } as const),
    [
      minNeededBalance,
      offer.exchangeToken.address,
      offer.exchangeToken.decimals
    ]
  );
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
      swapParams={swapParams}
    >
      {withCTAs ? (
        <InnerCommitDetailView {...props} />
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
