import { Cube, Lock, LockOpen } from "phosphor-react";
import React, {
  ElementRef,
  forwardRef,
  useMemo,
  useRef,
  useState
} from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import Logo from "../../../../../assets/logo.svg";
import { useIsPhygital } from "../../../../../hooks/offer/useIsPhygital";
import { useConfigContext } from "../../../../config/ConfigContext";
import Price from "../../../../price/Price";
import { DetailsSummary } from "../../../../ui/DetailsSummary";
import { Grid } from "../../../../ui/Grid";
import {
  BaseWidget,
  BosonExclusiveContainer,
  Break,
  WidgetUpperGrid
} from "./Detail.style";
import DetailTable from "./DetailTable";
import { useDetailViewContext } from "./DetailViewProvider";
import { PhygitalProduct } from "./PhygitalProduct";
import { TokenGatedItem } from "./TokenGatedItem";
import { DetailViewProps } from "./types";
import { useGetOfferDetailData } from "./useGetOfferDetailData";
import { SvgImage } from "../../../../ui/SvgImage";
import { getIsOfferRobloxGated } from "../../../../../lib/roblox/getIsOfferRobloxGated";

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
const iconSize = 20;
export const DetailViewCore = forwardRef<ElementRef<"div">, Props>(
  (
    {
      selectedVariant,
      topChildren,
      priceSibling,
      children,
      bottomChildren,
      exchange,
      // allVariants,
      // disableVariationsSelects,
      showBosonLogo,
      showPriceAsterisk,
      isBosonExclusive,
      onExchangePolicyClick,
      onClickBuyOrSwap
    },
    ref
  ) => {
    const forwardedRef = ref as React.MutableRefObject<ElementRef<"div">>;
    const { offer } = selectedVariant;
    const { isConditionMet, exchangePolicyCheckResult } =
      useDetailViewContext();

    const config = useConfigContext();

    const offerDetailData = useGetOfferDetailData({
      defaultCurrencySymbol: config.defaultCurrency.symbol,
      offer,
      exchange,
      onExchangePolicyClick,
      exchangePolicyCheckResult
    });

    const [isDetailsOpen, setDetailsOpen] = useState<boolean>(true);
    const closeDetailsRef = useRef(true);
    const isPhygital = useIsPhygital({ offer });
    const robloxGatedAssetId = useMemo(() => {
      return getIsOfferRobloxGated({ offer });
    }, [offer]);
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
              withAsterisk={showPriceAsterisk}
            />
            {priceSibling}
          </WidgetUpperGrid>
        </div>
        {children}
        {offer.condition && (
          <>
            <DetailsSummary
              summaryText={
                robloxGatedAssetId ? "Roblox gated offer" : "Token gated offer"
              }
              icon={
                isConditionMet ? (
                  <LockOpen size={iconSize} />
                ) : (
                  <Lock size={iconSize} />
                )
              }
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
                robloxGatedAssetId={robloxGatedAssetId}
              />
            </DetailsSummary>
          </>
        )}
        {isPhygital && (
          <DetailsSummary
            summaryText="Phygital product"
            icon={<Cube size={iconSize} />}
            onSetOpen={(open) => {
              if (open && closeDetailsRef.current) {
                setDetailsOpen(false);
                closeDetailsRef.current = false;
              }
            }}
          >
            <PhygitalProduct offer={offer} />
          </DetailsSummary>
        )}
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
            data={offerDetailData}
            inheritColor={false}
          />
        </DetailsSummary>
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
              <SvgImage src={BlackLogo} />
            </Grid>
          </>
        )}
      </Widget>
    );
  }
);
