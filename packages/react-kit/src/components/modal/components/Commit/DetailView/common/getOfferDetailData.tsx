import { offers, subgraph } from "@bosonprotocol/core-sdk";
import dayjs from "dayjs";
import { ArrowSquareOut, CircleWavyQuestion } from "phosphor-react";
import React from "react";
import {
  buyerAndSellerAgreementIncluding,
  customisedExchangePolicy
} from "../../../../../../lib/const/policies";
import { getDateTimestamp } from "../../../../../../lib/dates/getDateTimestamp";
import {
  getCalcPercentage,
  useDisplayFloat
} from "../../../../../../lib/price/prices";
import { Offer } from "../../../../../../types/offer";
import { useConfigContext } from "../../../../../config/ConfigContext";
import Typography from "../../../../../ui/Typography";
import { DetailDisputeResolver } from "../../../common/detail/DetailDisputeResolver";
import { DetailViewProps } from "./DetailViewCore";
import { theme } from "../../../../../../theme";
const colors = theme.colors.light;

const fontSizeExchangePolicy = "0.625rem";

export const getOfferDetailData = ({
  config,
  displayFloat,
  offer,
  onExchangePolicyClick,
  exchangePolicyCheckResult
}: {
  config: ReturnType<typeof useConfigContext>;
  displayFloat: ReturnType<typeof useDisplayFloat>;
  offer: Offer;
  onExchangePolicyClick: DetailViewProps["onExchangePolicyClick"];
  exchangePolicyCheckResult: offers.CheckExchangePolicyResult | undefined;
}) => {
  const redeemableUntil = dayjs(
    Number(`${offer.voucherRedeemableUntilDate}000`)
  ).format(config.dateFormat);
  const calcPercentage = getCalcPercentage(displayFloat);

  const { formatted } = calcPercentage(offer, "buyerCancelPenalty");
  const { formatted: sellerFormatted } = calcPercentage(offer, "sellerDeposit");
  const redeemableForXDays =
    Number(`${offer.voucherValidDuration}000`) / 86400000;
  const exchangePolicyLabel = (
    (offer.metadata as subgraph.ProductV1MetadataEntity)?.exchangePolicy
      ?.label || "Unspecified"
  ).replace("fairExchangePolicy", "Fair Exchange Policy");

  const handleShowExchangePolicy = () => {
    onExchangePolicyClick({
      exchangePolicyCheckResult
    });
  };
  const canBeRedeemedFrom = dayjs(
    getDateTimestamp(offer.voucherRedeemableFromDate) +
      Number(offer.voucherValidDuration || "0")
  );
  return [
    ...(offer.voucherRedeemableFromDate !== "0"
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
            value: (
              <Typography tag="p">
                {canBeRedeemedFrom.format(config.dateFormat)}
              </Typography>
            )
          }
        ]
      : []),
    {
      name:
        offer.voucherRedeemableUntilDate !== "0"
          ? "Redeemable until"
          : "Redeemable for",
      info: (
        <>
          <Typography tag="h6">
            <b>Redeemable</b>
          </Typography>
          <Typography tag="p">
            {offer.voucherRedeemableUntilDate !== "0"
              ? "If you don't redeem your NFT during the redemption period, it will expire and you will receive back the price minus the Buyer cancel penalty."
              : "Your NFT is available for redemption during this period, calculated from the date it was committed. If you do not redeem the NFT in this period, it will expire and you will receive back the price minus the buyer cancellation penalty."}
          </Typography>
        </>
      ),
      value: (
        <Typography tag="p">
          {offer.voucherRedeemableUntilDate !== "0"
            ? redeemableUntil
            : `${redeemableForXDays} day${redeemableForXDays === 1 ? "" : "s"}`}
        </Typography>
      )
    },
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
          {sellerFormatted}{" "}
          <span style={{ opacity: 0.5 }}>{offer.exchangeToken.symbol}</span>
        </Typography>
      )
    },
    {
      name: "Buyer cancellation penalty",
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
          {formatted}{" "}
          <span style={{ opacity: 0.5 }}>{offer.exchangeToken.symbol}</span>
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
          <p>
            The Exchange policy ensures that the terms of sale are set in a fair
            way to protect both buyers and sellers.
          </p>
        </>
      ),
      value: exchangePolicyCheckResult ? (
        exchangePolicyCheckResult.isValid ? (
          <Typography tag="p" alignItems="center">
            <span style={{ fontSize: fontSizeExchangePolicy }}>
              {`${buyerAndSellerAgreementIncluding} ${exchangePolicyLabel}`}
            </span>

            <ArrowSquareOut
              size={20}
              onClick={() => handleShowExchangePolicy()}
              style={{ cursor: "pointer", minWidth: "20px" }}
            />
          </Typography>
        ) : (
          <Typography
            tag="p"
            color={colors.orange}
            $fontSize={fontSizeExchangePolicy}
            alignItems="center"
          >
            {customisedExchangePolicy}
            <ArrowSquareOut
              size={20}
              onClick={() => handleShowExchangePolicy()}
              style={{ cursor: "pointer", minWidth: "20px" }}
            />
          </Typography>
        )
      ) : (
        <>
          <CircleWavyQuestion size={20} color="purple"></CircleWavyQuestion>{" "}
          <span style={{ color: "purple" }}>Unknown </span>
          <ArrowSquareOut
            size={20}
            color="purple"
            onClick={() => handleShowExchangePolicy()}
            style={{ cursor: "pointer" }}
          />
        </>
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