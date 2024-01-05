import { offers, subgraph } from "@bosonprotocol/core-sdk";
import dayjs from "dayjs";
import { utils } from "ethers";
import {
  ArrowSquareOut,
  ArrowsLeftRight,
  CircleWavyQuestion,
  Cube,
  Info,
  Lock,
  WarningCircle
} from "phosphor-react";
import React, {
  ElementRef,
  ReactNode,
  forwardRef,
  useMemo,
  useRef,
  useState
} from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { ReactComponent as Logo } from "../../../../../../assets/logo.svg";
import { useCoreSDKWithContext } from "../../../../../../hooks/core-sdk/useCoreSdkWithContext";
import useCheckExchangePolicy from "../../../../../../hooks/useCheckExchangePolicy";
import {
  buyerAndSellerAgreementIncluding,
  customisedExchangePolicy
} from "../../../../../../lib/const/policies";
import { getDateTimestamp } from "../../../../../../lib/dates/getDateTimestamp";
import {
  Field,
  swapQueryParameters
} from "../../../../../../lib/parameters/swap";
import {
  getCalcPercentage,
  useDisplayFloat
} from "../../../../../../lib/price/prices";
import { theme } from "../../../../../../theme";
import { Offer } from "../../../../../../types/offer";
import { VariantV1 } from "../../../../../../types/variants";
import { Button } from "../../../../../buttons/Button";
import { useConfigContext } from "../../../../../config/ConfigContext";
import Price from "../../../../../price/Price";
import { useConvertedPrice } from "../../../../../price/useConvertedPrice";
import { DetailsSummary } from "../../../../../ui/DetailsSummary";
import Grid from "../../../../../ui/Grid";
import Typography from "../../../../../ui/Typography";
import {
  BaseWidget,
  BosonExclusiveContainer,
  Break,
  CommitAndRedeemButton,
  WidgetUpperGrid
} from "../../../common/detail/Detail.style";
import { DetailDisputeResolver } from "../../../common/detail/DetailDisputeResolver";
import DetailTable from "../../../common/detail/DetailTable";
import { TokenGatedList } from "../../../common/detail/TokenGatedList";
import { useDetailViewContext } from "./DetailViewProvider";
import { QuantityDisplay } from "./QuantityDisplay";

const colors = theme.colors.light;

const StyledPrice = styled(Price)`
  h3 {
    font-size: 2rem;
  }
  small {
    font-size: 1rem;
  }
`;

const fontSizeExchangePolicy = "0.625rem";
const getOfferDetailData = ({
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

const SwapArrows = styled(ArrowsLeftRight)`
  && {
    stroke: none;
  }
`;

const BlackLogo = styled(Logo)`
  width: 6.25rem;
  height: fit-content;
  padding: 1.2rem 0;
`;

const Widget = styled(BaseWidget)`
  padding-top: 2rem;
`;

export type DetailViewProps = {
  selectedVariant: VariantV1;
  // allVariants: VariantV1[];
  // disableVariationsSelects?: boolean;
  children: ReactNode;
  isPreview: boolean;
  hasMultipleVariants: boolean;
  showBosonLogo: boolean;
  // onLicenseAgreementClick: () => void;
  onExchangePolicyClick: (args: {
    exchangePolicyCheckResult: offers.CheckExchangePolicyResult | undefined;
  }) => void;
  // onCommit: (exchangeId: string, txHash: string) => void;
  // onCommitting: (txHash: string) => void;
  onPurchaseOverview: () => void;
  // exchangePolicyCheckResult?: offers.CheckExchangePolicyResult;
};

export const DetailViewCore = forwardRef<ElementRef<"div">, DetailViewProps>(
  (
    {
      selectedVariant,
      children,
      // allVariants,
      // disableVariationsSelects,
      showBosonLogo,
      isPreview = false,
      hasMultipleVariants,
      onExchangePolicyClick,
      onPurchaseOverview
    },
    ref
  ) => {
    const forwardedRef = ref as React.MutableRefObject<ElementRef<"div">>;
    const { offer } = selectedVariant;
    const {
      quantity,
      isBuyerInsufficientFunds,
      exchangeTokenBalance,
      isOfferNotValidYet,
      isExpiredOffer,
      isConditionMet,
      hasSellerEnoughFunds
    } = useDetailViewContext();
    const coreSDK = useCoreSDKWithContext();

    const config = useConfigContext();
    const { commitProxyAddress, openseaLinkToOriginalMainnetCollection } =
      config;

    const displayFloat = useDisplayFloat();

    const convertedPrice = useConvertedPrice({
      value: offer.price,
      decimals: offer.exchangeToken.decimals,
      symbol: offer.exchangeToken.symbol
    });

    const minNeededBalance = exchangeTokenBalance?.sub(offer.price).mul(-1);
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
    const OFFER_DETAIL_DATA = useMemo(
      () =>
        getOfferDetailData({
          config,
          displayFloat,
          offer,
          onExchangePolicyClick,
          exchangePolicyCheckResult
        }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [offer, convertedPrice, config, displayFloat]
    );

    const quantityInitial = useMemo<number>(
      () => Number(offer?.quantityInitial || 0),
      [offer?.quantityInitial]
    );

    const isOfferEmpty = quantity < 1;

    const isNotCommittableOffer =
      isOfferEmpty ||
      isOfferNotValidYet ||
      isExpiredOffer ||
      offer.voided ||
      !hasSellerEnoughFunds ||
      isBuyerInsufficientFunds;

    const tokenOrCoinSymbol = offer.exchangeToken.symbol;
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

    const isBosonExclusive = true;
    const [isDetailsOpen, setDetailsOpen] = useState<boolean>(true);
    const closeDetailsRef = useRef(true);
    return (
      <Widget>
        {isBosonExclusive &&
          forwardedRef?.current &&
          createPortal(
            <BosonExclusiveContainer>BOSON EXCLUSIVE</BosonExclusiveContainer>,
            forwardedRef?.current
          )}
        <div>
          <WidgetUpperGrid style={{ paddingBottom: "0.5rem" }}>
            <StyledPrice
              isExchange={false}
              currencySymbol={offer.exchangeToken.symbol}
              value={offer.price}
              decimals={offer.exchangeToken.decimals}
              tag="h3"
              convert
              withBosonStyles
              withAsterisk={isPreview && hasMultipleVariants}
            />
            {notCommittableOfferStatus ? (
              <span style={{ color: colors.orange, textAlign: "right" }}>
                {notCommittableOfferStatus}
              </span>
            ) : (
              <QuantityDisplay
                quantityInitial={quantityInitial}
                quantity={quantity}
              />
            )}
          </WidgetUpperGrid>
        </div>
        {isNotCommittableOffer && isBuyerInsufficientFunds && (
          <Grid marginBottom="1rem">
            <Button
              size="regular"
              variant="accentInverted"
              withBosonStyle
              style={{
                width: "100%"
              }}
            >
              <a
                style={{ all: "inherit", fontWeight: "600" }}
                target="__blank"
                href={`https://bosonapp.io/#/swap?${new URLSearchParams({
                  [swapQueryParameters.outputCurrency]:
                    offer.exchangeToken.address,
                  [swapQueryParameters.exactAmount]: minNeededBalance
                    ? utils.formatUnits(
                        minNeededBalance || "",
                        offer.exchangeToken.decimals
                      )
                    : "",
                  [swapQueryParameters.exactField]: Field.OUTPUT.toLowerCase()
                }).toString()}`}
              >
                Buy or Swap {tokenOrCoinSymbol} <SwapArrows size={24} />
              </a>
            </Button>
          </Grid>
        )}
        {!isBuyerInsufficientFunds && children}
        {offer.condition && (
          <DetailsSummary
            summaryText="Token Gated Offer"
            icon={<Lock size={16} />}
            onSetOpen={(open) => {
              if (open && closeDetailsRef.current) {
                setDetailsOpen(false);
                closeDetailsRef.current = false;
              }
            }}
          >
            <TokenGatedList
              coreSDK={coreSDK}
              offer={offer}
              commitProxyAddress={commitProxyAddress}
              openseaLinkToOriginalMainnetCollection={
                openseaLinkToOriginalMainnetCollection
              }
              isConditionMet={isConditionMet}
            />
          </DetailsSummary>
        )}
        <DetailsSummary
          summaryText="Phygital Product"
          icon={<Cube size={16} />}
          onSetOpen={(open) => {
            if (open && closeDetailsRef.current) {
              setDetailsOpen(false);
              closeDetailsRef.current = false;
            }
          }}
        >
          <Grid flexDirection="column" alignItems="flex-start" gap="1rem">
            <Typography>
              This is what you'll get when you purchase this product.
            </Typography>
            <Grid flexDirection="column" alignItems="flex-start">
              <Typography>
                <b>This product includes:</b>
              </Typography>
            </Grid>
          </Grid>
        </DetailsSummary>
        <DetailsSummary
          summaryText="Details"
          initiallyOpen
          isOpen={isDetailsOpen}
          onSetOpen={(open) => {
            setDetailsOpen(open);
          }}
        >
          <DetailTable
            align={false}
            noBorder
            data={OFFER_DETAIL_DATA}
            inheritColor={false}
          />
        </DetailsSummary>
        <Grid
          justifyContent="center"
          alignItems="center"
          marginTop="12px"
          marginBottom="12px"
        >
          <div
            style={{
              cursor: "pointer",
              display: "flex",
              gap: "0.1rem",
              alignItems: "center"
            }}
            onClick={onPurchaseOverview}
          >
            <CommitAndRedeemButton>How it works?</CommitAndRedeemButton>
            <Info color={colors.secondary} size={24} />
          </div>
        </Grid>
        {showBosonLogo && (
          <>
            <Break />
            <Grid justifyContent="center" alignItems="center">
              <BlackLogo />
            </Grid>
          </>
        )}
      </Widget>
    );
  }
);
