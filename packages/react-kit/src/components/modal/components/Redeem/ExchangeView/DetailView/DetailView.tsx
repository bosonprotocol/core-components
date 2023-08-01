import dayjs from "dayjs";
import { BigNumber, ethers } from "ethers";
import { ArrowRight, ArrowSquareOut, Check, Question } from "phosphor-react";
import React, { useMemo } from "react";
import styled from "styled-components";
import { useAccount, useBalance } from "wagmi";
import { useBreakpoints } from "../../../../../../hooks/useBreakpoints";
import { Offer } from "../../../../../../types/offer";
import { Exchange } from "../../../../../../types/exchange";
import Typography from "../../../../../ui/Typography";
import { Button, ButtonSize } from "../../../../../buttons/Button";
import { breakpoint } from "../../../../../../lib/ui/breakpoint";
import { getDateTimestamp } from "../../../../../../lib/dates/getDateTimestamp";
import { getItemFromStorage } from "../../../../../widgets/finance/storage/useLocalStorage";
import { theme } from "../../../../../../theme";
import Grid from "../../../../../ui/Grid";
import ThemedButton from "../../../../../ui/ThemedButton";
import { useConvertedPrice } from "../../../../../price/useConvertedPrice";
import DetailTopRightLabel from "./DetailTopRightLabel";
import { QuantityDisplay } from "./QuantityDisplay";
import {
  Break,
  CommitAndRedeemButton,
  ContactSellerButton,
  RaiseProblemButton,
  ActionMessage,
  StyledCancelButton,
  Widget,
  WidgetUpperGrid
} from "../detail/Detail.style";
import TokenGated from "./TokenGated";
import { exchanges, subgraph } from "@bosonprotocol/core-sdk";
import Price from "../../../../../price/Price";
import {
  getCalcPercentage,
  useDisplayFloat
} from "../../../../../../lib/price/prices";
import { useConfigContext } from "../../../../../config/ConfigContext";
import { titleCase } from "../../../../../../lib/string/formatText";
import DetailTable from "../detail/DetailTable";
import { DetailDisputeResolver } from "./DetailDisputeResolver";
import { IPrice } from "../../../../../../lib/price/convertPrice";
import useCheckTokenGatedOffer from "../../../../../../hooks/tokenGated/useCheckTokenGatedOffer";

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
  isExchange?: boolean
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
    isExchange &&
    offer.voucherRedeemableFromDate &&
    redeemableFromDayJs.isAfter(Date.now())
      ? [
          {
            name: "Redeemable from",
            info: (
              <>
                <Typography tag="h6">
                  <b>Redeemable</b>
                </Typography>
                <Typography tag="p">
                  If you don’t redeem your NFT during the redemption period, it
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
            If you don’t redeem your NFT during the redemption period, it will
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
      value: (
        <Typography tag="p" style={{ wordBreak: "break-word" }}>
          Fair Exchange Policy{" "}
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
  pageType?: "exchange" | "offer";
  offer: Offer;
  exchange?: Exchange;
  hasSellerEnoughFunds: boolean;
  isPreview?: boolean;
  onCancelExchange: () => void;
  hasMultipleVariants?: boolean;
  onExchangePolicyClick: () => void;
  onRedeem: () => void;
  onPurchaseOverview: () => void;
  onExpireVoucherClick: () => void;
  onRaiseDisputeClick: () => void;
}

const DetailView: React.FC<IDetailWidget> = ({
  pageType,
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
  onRedeem
}) => {
  const { isLteXS } = useBreakpoints();
  const config = useConfigContext();
  const {
    commitProxyAddress,
    openseaLinkToOriginalMainnetCollection,
    contactSellerForExchangeUrl
  } = config;
  const displayFloat = useDisplayFloat();
  const { address } = useAccount();
  const isBuyer = exchange?.buyer.wallet === address?.toLowerCase();
  const isOffer = pageType === "offer";
  const isExchange = pageType === "exchange";
  const exchangeStatus = exchange ? exchanges.getExchangeState(exchange) : null;

  const disabledRedeemText =
    exchangeStatus === exchanges.ExtendedExchangeState.NotRedeemableYet
      ? "Redeem"
      : titleCase(exchangeStatus || "Unsupported");

  const { data: dataBalance } = useBalance(
    offer.exchangeToken.address !== ethers.constants.AddressZero
      ? {
          address,
          token: offer.exchangeToken.address as `0x${string}`
        }
      : { address }
  );

  const isToRedeem =
    !exchangeStatus || exchangeStatus === subgraph.ExchangeState.Committed;

  const isBeforeRedeem =
    !exchangeStatus || NOT_REDEEMED_YET.includes(exchangeStatus);

  const isExchangeExpired =
    exchangeStatus &&
    [exchanges.ExtendedExchangeState.Expired].includes(
      exchangeStatus as unknown as exchanges.ExtendedExchangeState
    );

  const isBuyerInsufficientFunds: boolean = useMemo(
    () => !!dataBalance?.value && dataBalance?.value < BigInt(offer.price),
    [dataBalance, offer.price]
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
        isExchange
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [offer, convertedPrice, isExchange, config, displayFloat]
  );

  const quantity = useMemo<number>(
    () => Number(offer?.quantityAvailable || 0),
    [offer?.quantityAvailable]
  );

  const quantityInitial = useMemo<number>(
    () => Number(offer?.quantityInitial || 0),
    [offer?.quantityInitial]
  );

  const isExpiredOffer = useMemo<boolean>(
    () => dayjs(getDateTimestamp(offer?.validUntilDate)).isBefore(dayjs()),
    [offer?.validUntilDate]
  );

  const voucherRedeemableUntilDate = dayjs(
    getDateTimestamp(offer.voucherRedeemableUntilDate)
  );
  const nowDate = dayjs();

  const totalHours = voucherRedeemableUntilDate.diff(nowDate, "hours");
  const redeemableDays = Math.floor(totalHours / 24);
  const redeemableHours = totalHours - redeemableDays * 24;

  const isChainUnsupported = getItemFromStorage("isChainUnsupported", false);

  const handleCancel = () => {
    if (!exchange) {
      return;
    }
    onCancelExchange();
  };

  const isOfferEmpty = quantity < 1;
  const isOfferNotValidYet = dayjs(
    getDateTimestamp(offer?.validFromDate)
  ).isAfter(nowDate);

  const isNotCommittableOffer =
    (isOfferEmpty ||
      isOfferNotValidYet ||
      isExpiredOffer ||
      offer.voided ||
      !hasSellerEnoughFunds ||
      isBuyerInsufficientFunds) &&
    isOffer;

  const notCommittableOfferStatus = useMemo(() => {
    if (isBuyerInsufficientFunds) {
      return "Insufficient Funds";
    }
    if (offer.voided) {
      return "Offer voided";
    }
    if (isExpiredOffer) {
      return "Expired";
    }
    if (isOfferNotValidYet) {
      return "Sale starting soon™️";
    }
    if (isOfferEmpty) {
      return "Sold out";
    }
    if (!hasSellerEnoughFunds) {
      return "Invalid";
    }
    return "";
  }, [
    hasSellerEnoughFunds,
    isBuyerInsufficientFunds,
    isExpiredOffer,
    isOfferEmpty,
    isOfferNotValidYet,
    offer.voided
  ]);
  const { isConditionMet } = useCheckTokenGatedOffer({
    commitProxyAddress,
    condition: offer.condition
  });
  return (
    <>
      <Widget>
        {isExchange && isToRedeem && (
          <ActionMessage>
            {redeemableDays > 0
              ? `${redeemableDays} days left to Redeem`
              : `${redeemableHours} hours left to Redeem`}
          </ActionMessage>
        )}
        <div>
          {isExchange && isExchangeExpired && (
            <ActionMessage>
              <Grid
                alignItems="center"
                justifyContent="space-between"
                style={{
                  cursor: "pointer"
                }}
                onClick={() => {
                  if (exchange) {
                    onExpireVoucherClick();
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
          <WidgetUpperGrid
            style={{ paddingBottom: !isExchange || isLteXS ? "0.5rem" : "0" }}
          >
            <StyledPrice
              isExchange={isExchange}
              currencySymbol={offer.exchangeToken.symbol}
              value={offer.price}
              decimals={offer.exchangeToken.decimals}
              tag="h3"
              convert
              withBosonStyles
              withAsterisk={isPreview && hasMultipleVariants}
            />

            {isOffer && !isNotCommittableOffer && (
              <QuantityDisplay
                quantityInitial={quantityInitial}
                quantity={quantity}
              />
            )}

            {isOffer && isNotCommittableOffer && (
              <DetailTopRightLabel>
                {!isPreview && notCommittableOfferStatus}
              </DetailTopRightLabel>
            )}
            {isToRedeem && (
              <RedeemButton
                variant="primaryFill"
                size={ButtonSize.Large}
                disabled={
                  isChainUnsupported || isOffer || isPreview || !isBuyer
                }
                onClick={() => {
                  onRedeem();
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
            !isOffer && !isLteXS
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
        {isExchange && (
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
                  isChainUnsupported || !isBuyer || !contactSellerForExchangeUrl
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
                      disabled={isChainUnsupported || !isBuyer}
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
                        onRaiseDisputeClick();
                      }}
                      type="button"
                      theme="blank"
                      style={{ fontSize: "0.875rem" }}
                      disabled={exchange?.state !== "REDEEMED" || !isBuyer}
                    >
                      Raise a problem
                      <Question size={18} />
                    </RaiseProblemButton>
                  )}
                </>
              )}
            </Grid>
          </>
        )}
      </Widget>
    </>
  );
};

export default DetailView;
