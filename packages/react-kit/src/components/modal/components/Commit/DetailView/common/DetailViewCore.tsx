import { Cube, Info, Lock, LockOpen } from "phosphor-react";
import React, {
  ElementRef,
  forwardRef,
  useMemo,
  useRef,
  useState
} from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { ReactComponent as Logo } from "../../../../../../assets/logo.svg";
import { useDisplayFloat } from "../../../../../../lib/price/prices";
import { theme } from "../../../../../../theme";
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
import { useDetailViewContext } from "./DetailViewProvider";
import { getOfferDetailData } from "./getOfferDetailData";
import { DetailViewProps } from "./types";

const colors = theme.colors.light;

const StyledPrice = styled(Price)`
  h3 {
    font-size: 2rem;
  }
  small {
    font-size: 1rem;
  }
`;

const BlackLogo = styled(Logo)`
  width: 6.25rem;
  height: fit-content;
  padding: 1.2rem 0;
`;

const Widget = styled(BaseWidget)`
  padding-top: 1rem;
`;

type Props = {
  isBosonExclusive: boolean;
} & DetailViewProps;

export const DetailViewCore = forwardRef<ElementRef<"div">, Props>(
  (
    {
      selectedVariant,
      topChildren,
      priceSibling,
      children,
      bottomChildren,
      // allVariants,
      // disableVariationsSelects,
      showBosonLogo,
      isPreview = false,
      hasMultipleVariants,
      isBosonExclusive,
      onExchangePolicyClick,
      onPurchaseOverview,
      onClickBuyOrSwap
    },
    ref
  ) => {
    const forwardedRef = ref as React.MutableRefObject<ElementRef<"div">>;
    const { offer } = selectedVariant;
    const { isConditionMet, exchangePolicyCheckResult } =
      useDetailViewContext();

    const config = useConfigContext();

    const displayFloat = useDisplayFloat();

    const convertedPrice = useConvertedPrice({
      value: offer.price,
      decimals: offer.exchangeToken.decimals,
      symbol: offer.exchangeToken.symbol
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
        {topChildren && (
          <>
            {topChildren}
            <Break style={{ margin: "1rem 0" }} />
          </>
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
            {priceSibling}
          </WidgetUpperGrid>
        </div>
        {children}
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
            <TokenGatedItem
              offer={offer}
              isConditionMet={isConditionMet}
              onClickBuyOrSwap={onClickBuyOrSwap}
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
        {bottomChildren && (
          <>
            <Break />
            {bottomChildren}
          </>
        )}
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
