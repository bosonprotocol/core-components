import dayjs from "dayjs";
import {
  ArrowRight,
  ArrowSquareOut,
  Check,
  Question,
  CircleWavyQuestion,
  WarningCircle
} from "phosphor-react";
import React, { useMemo } from "react";
import styled from "styled-components";
import { useBreakpoints } from "../../../../../../hooks/useBreakpoints";
import { Offer } from "../../../../../../types/offer";
import { Exchange } from "../../../../../../types/exchange";
import Typography from "../../../../../ui/Typography";
import { Button } from "../../../../../buttons/Button";
import { breakpoint } from "../../../../../../lib/ui/breakpoint";
import { getDateTimestamp } from "../../../../../../lib/dates/getDateTimestamp";
import { theme } from "../../../../../../theme";
import Grid from "../../../../../ui/Grid";
import ThemedButton from "../../../../../ui/ThemedButton";
import { useConvertedPrice } from "../../../../../price/useConvertedPrice";
import {
  Break,
  CommitAndRedeemButton,
  ContactSellerButton,
  RaiseProblemButton,
  ActionMessage,
  StyledCancelButton,
  Widget,
  WidgetUpperGrid
} from "../../../common/detail/Detail.style";
import { exchanges, offers, subgraph } from "@bosonprotocol/core-sdk";
import Price from "../../../../../price/Price";
import {
  getCalcPercentage,
  useDisplayFloat
} from "../../../../../../lib/price/prices";
import { useConfigContext } from "../../../../../config/ConfigContext";
import { titleCase } from "../../../../../../lib/string/formatText";
import DetailTable from "../../../common/detail/DetailTable";
import { DetailDisputeResolver } from "../../../common/detail/DetailDisputeResolver";
import { IPrice } from "../../../../../../lib/price/convertPrice";
import useCheckTokenGatedOffer from "../../../../../../hooks/tokenGated/useCheckTokenGatedOffer";
import { ButtonSize } from "../../../../../ui/buttonSize";
import {
  useAccount,
  useIsConnectedToWrongChain
} from "../../../../../../hooks/connection/connection";
import { useCoreSDKWithContext } from "../../../../../../hooks/core-sdk/useCoreSdkWithContext";
import TokenGated from "../../../common/detail/TokenGated";

const colors = theme.colors.light;

const StyledPrice = styled(Price)`
  h3 {
    font-size: 2rem;
  }
  small {
    font-size: 1rem;
  }
`;

const RedeemButton = styled(Button)`
  padding: 1rem;
  height: 3.5rem;
  display: flex;
  align-items: center;

  && {
    > div {
      width: 100%;
      gap: 1rem;
      display: flex;
      align-items: stretch;
      justify-content: center;
      small {
        align-items: center;
      }
    }

    ${breakpoint.s} {
      > div {
        gap: 0.5rem;
      }
    }
    ${breakpoint.m} {
      > div {
        gap: 1rem;
      }
    }
  }
`;

const getOfferDetailData = (
  config: ReturnType<typeof useConfigContext>,
  displayFloat: ReturnType<typeof useDisplayFloat>,
  offer: Offer,
  convertedPrice: IPrice | null,
  isModal: boolean,
  onExchangePolicyClick: IDetailWidget["onExchangePolicyClick"],
  exchangePolicyCheckResult?: offers.CheckExchangePolicyResult
) => {
  const redeemableFromDayJs = dayjs(
    Number(`${offer.voucherRedeemableFromDate}000`)
  );
  const redeemableFrom = redeemableFromDayJs.format(config.dateFormat);
  const redeemableUntil = dayjs(
    Number(`${offer.voucherRedeemableUntilDate}000`)
  ).format(config.dateFormat);
  const calcPercentage = getCalcPercentage(displayFloat);

  const { deposit, formatted } = calcPercentage(offer, "buyerCancelPenalty");
  const { deposit: sellerDeposit, formatted: sellerFormatted } = calcPercentage(
    offer,
    "sellerDeposit"
  );

  const exchangePolicyLabel = (
    (offer.metadata as subgraph.ProductV1MetadataEntity)?.exchangePolicy
      ?.label || "Unspecified"
  ).replace("fairExchangePolicy", "Fair Exchange Policy");

  // if offer is in creation, offer.id does not exist
  const handleShowExchangePolicy = () => {
    // const offerData = offer.id ? undefined : offer;
    // showModal(modalTypes.EXCHANGE_POLICY_DETAILS, {
    //   title: "Exchange Policy Details",
    //   offerId: offer.id,
    //   offerData
    // });
    onExchangePolicyClick();
  };
  const redeemableFromValues =
    offer.voucherRedeemableFromDate && redeemableFromDayJs.isAfter(Date.now())
      ? [
          {
            name: "Redeemable from",
            info: (
              <>
                <Typography tag="h6">
                  <b>Redeemable</b>
                </Typography>
                <Typography tag="p">
                  If you don't redeem your NFT during the redemption period, it
                  will expire and you will receive back the price minus the
                  Buyer cancel penalty
                </Typography>
              </>
            ),
            value: <Typography tag="p">{redeemableFrom}</Typography>
          }
        ]
      : [];
  return [
    ...redeemableFromValues,
    {
      name: "Redeemable until",
      info: (
        <>
          <Typography tag="h6">
            <b>Redeemable</b>
          </Typography>
          <Typography tag="p">
            If you don't redeem your NFT during the redemption period, it will
            expire and you will receive back the price minus the Buyer cancel
            penalty
          </Typography>
        </>
      ),
      value: <Typography tag="p">{redeemableUntil}</Typography>
    },
    isModal
      ? {
          name: "Price",
          value: convertedPrice?.currency ? (
            <Typography tag="p">
              {displayFloat(convertedPrice?.price)} {offer.exchangeToken.symbol}
              <small>
                ({convertedPrice?.currency?.symbol}{" "}
                {displayFloat(convertedPrice?.converted, { fixed: 2 })})
              </small>
            </Typography>
          ) : (
            <Typography tag="p">
              {displayFloat(convertedPrice?.price)} {offer.exchangeToken.symbol}
            </Typography>
          )
        }
      : { hide: true },
    {
      name: "Seller deposit",
      info: (
        <>
          <Typography tag="h6">
            <b>Seller deposit</b>
          </Typography>
          <Typography tag="p">
            The Seller deposit is used to hold the seller accountable to follow
            through with their commitment to deliver the physical item. If the
            seller breaks their commitment, the deposit will be transferred to
            the buyer.
          </Typography>
        </>
      ),
      value: (
        <Typography tag="p">
          {sellerFormatted} {offer.exchangeToken.symbol}
          {sellerDeposit !== "0" ? <small>({sellerDeposit}%)</small> : ""}
        </Typography>
      )
    },
    {
      name: "Buyer cancel. pen.",
      info: (
        <>
          <Typography tag="h6">
            <b>Buyer Cancelation penalty</b>
          </Typography>
          <Typography tag="p">
            If you fail to redeem your rNFT in time, you will receive back the
            price minus the buyer cancellation penalty.
          </Typography>
        </>
      ),
      value: (
        <Typography tag="p">
          {formatted} {offer.exchangeToken.symbol}
          {deposit !== "0" ? <small>({deposit}%)</small> : ""}
        </Typography>
      )
    },
    {
      name: "Exchange policy",
      info: (
        <>
          <Typography tag="h6">
            <b>Exchange policy</b>
          </Typography>
          <Typography tag="p">
            The Exchange policy ensures that the terms of sale are set in a fair
            way to protect both buyers and sellers.
          </Typography>
        </>
      ),
      value: exchangePolicyCheckResult ? (
        exchangePolicyCheckResult.isValid ? (
          <Typography tag="p">
            {exchangePolicyLabel + " "}
            <ArrowSquareOut
              size={20}
              onClick={() => handleShowExchangePolicy()}
              style={{ cursor: "pointer" }}
            />
          </Typography>
        ) : (
          <Typography tag="p" color={colors.orange}>
            <WarningCircle size={20}></WarningCircle> Non-standard{" "}
            <ArrowSquareOut
              size={20}
              onClick={() => handleShowExchangePolicy()}
              style={{ cursor: "pointer" }}
            />
          </Typography>
        )
      ) : (
        <Typography tag="p" color="purple">
          <CircleWavyQuestion size={20}></CircleWavyQuestion> Unknown{" "}
          <ArrowSquareOut
            size={20}
            onClick={() => handleShowExchangePolicy()}
            style={{ cursor: "pointer" }}
          />
        </Typography>
      )
    },
    {
      name: DetailDisputeResolver.name,
      info: DetailDisputeResolver.info,
      // eslint-disable-next-line react/jsx-pascal-case
      value: <DetailDisputeResolver.value />
    }
  ];
};

const NOT_REDEEMED_YET = [
  subgraph.ExchangeState.Committed,
  subgraph.ExchangeState.Revoked,
  subgraph.ExchangeState.Cancelled,
  exchanges.ExtendedExchangeState.Expired,
  subgraph.ExchangeState.Completed,
  exchanges.ExtendedExchangeState.NotRedeemableYet
];

interface IDetailWidget {
  offer: Offer;
  exchange?: Exchange;
  hasSellerEnoughFunds: boolean;
  isPreview?: boolean;
  onCancelExchange?: () => void;
  hasMultipleVariants?: boolean;
  onExchangePolicyClick: () => void;
  onRedeem?: () => void;
  onPurchaseOverview: () => void;
  onExpireVoucherClick?: () => void;
  onRaiseDisputeClick?: () => void;
  exchangePolicyCheckResult?: offers.CheckExchangePolicyResult;
}

const DetailView: React.FC<IDetailWidget> = ({
  offer,
  exchange,
  hasSellerEnoughFunds,
  isPreview = false,
  hasMultipleVariants,
  onCancelExchange,
  onExchangePolicyClick,
  onExpireVoucherClick,
  onPurchaseOverview,
  onRaiseDisputeClick,
  onRedeem,
  exchangePolicyCheckResult
}) => {
  const core = useCoreSDKWithContext();
  const { isLteXS } = useBreakpoints();
  const config = useConfigContext();
  const {
    commitProxyAddress,
    openseaLinkToOriginalMainnetCollection,
    contactSellerForExchangeUrl
  } = config;
  const isInWrongChain = useIsConnectedToWrongChain();
  const displayFloat = useDisplayFloat();
  const { address } = useAccount();
  const isBuyer = exchange?.buyer.wallet === address?.toLowerCase();
  const exchangeStatus = exchange ? exchanges.getExchangeState(exchange) : null;

  const disabledRedeemText =
    exchangeStatus === exchanges.ExtendedExchangeState.NotRedeemableYet
      ? "Redeem"
      : titleCase(exchangeStatus || "Unsupported");

  const isToRedeem =
    !exchangeStatus || exchangeStatus === subgraph.ExchangeState.Committed;

  const isBeforeRedeem =
    !exchangeStatus || NOT_REDEEMED_YET.includes(exchangeStatus);

  const isExchangeExpired =
    exchangeStatus &&
    [exchanges.ExtendedExchangeState.Expired].includes(
      exchangeStatus as unknown as exchanges.ExtendedExchangeState
    );

  const convertedPrice = useConvertedPrice({
    value: offer.price,
    decimals: offer.exchangeToken.decimals,
    symbol: offer.exchangeToken.symbol
  });

  const OFFER_DETAIL_DATA = useMemo(
    () =>
      getOfferDetailData(
        config,
        displayFloat,
        offer,
        convertedPrice,
        false,
        onExchangePolicyClick,
        exchangePolicyCheckResult
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [offer, convertedPrice, config, displayFloat]
  );

  const voucherRedeemableUntilDate = dayjs(
    getDateTimestamp(offer.voucherRedeemableUntilDate)
  );
  const nowDate = dayjs();

  const totalHours = voucherRedeemableUntilDate.diff(nowDate, "hours");
  const redeemableDays = Math.floor(totalHours / 24);
  const redeemableHours = totalHours - redeemableDays * 24;

  const handleCancel = () => {
    if (!exchange) {
      return;
    }
    onCancelExchange?.();
  };

  const { isConditionMet } = useCheckTokenGatedOffer({
    commitProxyAddress,
    offer
  });
  return (
    <Widget>
      {isToRedeem && (
        <ActionMessage>
          {redeemableDays > 0
            ? `${redeemableDays} days left to Redeem`
            : `${redeemableHours} hours left to Redeem`}
        </ActionMessage>
      )}
      <div>
        {isExchangeExpired && (
          <ActionMessage>
            <Grid
              alignItems="center"
              justifyContent="space-between"
              style={{
                cursor: "pointer"
              }}
              onClick={() => {
                if (exchange) {
                  onExpireVoucherClick?.();
                }
              }}
            >
              <Typography
                tag="p"
                style={{ color: colors.darkGrey, margin: 0 }}
                $fontSize="0.75rem"
              >
                You can withdraw your funds here
              </Typography>
              <ArrowRight size={18} color={colors.darkGrey} />
            </Grid>
          </ActionMessage>
        )}
        <WidgetUpperGrid style={{ paddingBottom: isLteXS ? "0.5rem" : "0" }}>
          <StyledPrice
            isExchange
            currencySymbol={offer.exchangeToken.symbol}
            value={offer.price}
            decimals={offer.exchangeToken.decimals}
            tag="h3"
            convert
            withBosonStyles
            withAsterisk={isPreview && hasMultipleVariants}
          />

          {isToRedeem && (
            <RedeemButton
              variant="primaryFill"
              size={ButtonSize.Large}
              disabled={isInWrongChain || isPreview || !isBuyer}
              onClick={() => {
                onRedeem?.();
              }}
            >
              <span>Redeem</span>
            </RedeemButton>
          )}
          {!isToRedeem && (
            <ThemedButton theme="outline" disabled>
              {disabledRedeemText}
              <Check size={24} />
            </ThemedButton>
          )}
        </WidgetUpperGrid>
      </div>
      <Grid
        justifyContent="center"
        style={
          !isLteXS
            ? {
                maxWidth: "50%",
                marginLeft: "calc(50% - 0.5rem)"
              }
            : {}
        }
      >
        {isBeforeRedeem ? (
          <CommitAndRedeemButton
            tag="p"
            onClick={onPurchaseOverview}
            style={{ fontSize: "0.75rem", marginTop: 0 }}
          >
            How it works?
          </CommitAndRedeemButton>
        ) : (
          <CommitAndRedeemButton
            tag="p"
            style={{ fontSize: "0.75rem", marginTop: 0 }}
          >
            &nbsp;
          </CommitAndRedeemButton>
        )}
      </Grid>
      <Break />
      {offer.condition && (
        <TokenGated
          coreSDK={core}
          offer={offer}
          commitProxyAddress={commitProxyAddress}
          openseaLinkToOriginalMainnetCollection={
            openseaLinkToOriginalMainnetCollection
          }
          isConditionMet={isConditionMet}
        />
      )}
      <div style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
        <DetailTable
          align
          noBorder
          data={OFFER_DETAIL_DATA}
          inheritColor={false}
        />
      </div>
      {
        <>
          <Break />
          <Grid as="section">
            <ContactSellerButton
              onClick={() => {
                const contactSellerForExchangeUrlWithId =
                  contactSellerForExchangeUrl.replace(
                    "{id}",
                    exchange?.id || ""
                  );
                window.open(contactSellerForExchangeUrlWithId, "_blank");
              }}
              theme="blank"
              type="button"
              style={{ fontSize: "0.875rem" }}
              disabled={
                isInWrongChain || !isBuyer || !contactSellerForExchangeUrl
              }
            >
              Contact seller
            </ContactSellerButton>
            {isBeforeRedeem ? (
              <>
                {![
                  exchanges.ExtendedExchangeState.Expired,
                  subgraph.ExchangeState.Cancelled,
                  subgraph.ExchangeState.Revoked,
                  subgraph.ExchangeState.Completed
                ].includes(
                  exchangeStatus as
                    | exchanges.ExtendedExchangeState
                    | subgraph.ExchangeState
                ) && (
                  <StyledCancelButton
                    onClick={handleCancel}
                    theme="blank"
                    type="button"
                    style={{ fontSize: "0.875rem" }}
                    disabled={isInWrongChain || !isBuyer}
                  >
                    Cancel
                  </StyledCancelButton>
                )}
              </>
            ) : (
              <>
                {!exchange?.disputed && (
                  <RaiseProblemButton
                    onClick={() => {
                      onRaiseDisputeClick?.();
                    }}
                    type="button"
                    theme="blank"
                    style={{ fontSize: "0.875rem" }}
                    disabled={
                      exchange?.state !== "REDEEMED" ||
                      !isBuyer ||
                      isInWrongChain
                    }
                  >
                    Raise a problem
                    <Question size={18} />
                  </RaiseProblemButton>
                )}
              </>
            )}
          </Grid>
        </>
      }
    </Widget>
  );
};

export default DetailView;
