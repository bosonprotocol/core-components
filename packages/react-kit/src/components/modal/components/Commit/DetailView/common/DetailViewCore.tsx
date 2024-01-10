import { offers } from "@bosonprotocol/core-sdk";
import { utils } from "ethers";
import { ArrowsLeftRight, Cube, Info, Lock, LockOpen } from "phosphor-react";
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
import {
  Field,
  swapQueryParameters
} from "../../../../../../lib/parameters/swap";
import { useDisplayFloat } from "../../../../../../lib/price/prices";
import { theme } from "../../../../../../theme";
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
import DetailTable from "../../../common/detail/DetailTable";
import { TokenGatedItem } from "../../../common/detail/TokenGatedItem";
import { useNotCommittableOfferStatus } from "../../useNotCommittableOfferStatus";
import { useDetailViewContext } from "./DetailViewProvider";
import { QuantityDisplay } from "./QuantityDisplay";
import { getOfferDetailData } from "./getOfferDetailData";

const colors = theme.colors.light;

const StyledPrice = styled(Price)`
  h3 {
    font-size: 2rem;
  }
  small {
    font-size: 1rem;
  }
`;

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

type Props = { isBosonExclusive: boolean } & DetailViewProps;

export const DetailViewCore = forwardRef<ElementRef<"div">, Props>(
  (
    {
      selectedVariant,
      children,
      // allVariants,
      // disableVariationsSelects,
      showBosonLogo,
      isPreview = false,
      hasMultipleVariants,
      isBosonExclusive,
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
      hasSellerEnoughFunds,
      exchangePolicyCheckResult
    } = useDetailViewContext();

    const config = useConfigContext();

    const displayFloat = useDisplayFloat();

    const convertedPrice = useConvertedPrice({
      value: offer.price,
      decimals: offer.exchangeToken.decimals,
      symbol: offer.exchangeToken.symbol
    });

    const minNeededBalance = exchangeTokenBalance?.sub(offer.price).mul(-1);

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
    const notCommittableOfferStatus = useNotCommittableOfferStatus({
      isOfferVoided: offer.voided
    });

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
            icon={isConditionMet ? <LockOpen size={16} /> : <Lock size={16} />}
            onSetOpen={(open) => {
              if (open && closeDetailsRef.current) {
                setDetailsOpen(false);
                closeDetailsRef.current = false;
              }
            }}
          >
            <TokenGatedItem offer={offer} isConditionMet={isConditionMet} />
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
