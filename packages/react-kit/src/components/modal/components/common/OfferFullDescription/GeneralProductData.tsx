import React, { useMemo } from "react";
import styled from "styled-components";
import { useIsPhygital } from "../../../../../hooks/offer/useIsPhygital";
import { breakpoint } from "../../../../../lib/ui/breakpoint";
import { colors } from "../../../../../theme";
import { Offer } from "../../../../../types/offer";
import { useConfigContext } from "../../../../config/ConfigContext";
import Price from "../../../../price/Price";
import { Grid } from "../../../../ui/Grid";
import { GridContainer } from "../../../../ui/GridContainer";
import { Typography } from "../../../../ui/Typography";
import { useNotCommittableOfferStatus } from "../../Commit/useNotCommittableOfferStatus";
import { Break } from "../detail/Detail.style";
import DetailTable from "../detail/DetailTable";
import { useDetailViewContext } from "../detail/DetailViewProvider";
import { TokenGatedItem } from "../detail/TokenGatedItem";
import { OnClickBuyOrSwapHandler } from "../detail/types";
import {
  UseGetOfferDetailDataProps,
  useGetOfferDetailData
} from "../detail/useGetOfferDetailData";
import { Exchange } from "../../../../../types/exchange";
import { PhygitalProduct } from "../detail/PhygitalProduct";
import { getIsOfferRobloxGated } from "../../../../../lib/roblox/getIsOfferRobloxGated";
import { PriceType } from "@bosonprotocol/common";

const StyledPrice = styled(Price)`
  h3 {
    font-size: 2rem;
  }
  small {
    font-size: 1rem;
  }
  [data-testid="price-grid"] {
    justify-content: flex-end;
  }
`;
const TokenGatedGrid = styled.div`
  width: 100%;
  display: grid;
  grid-column-gap: 2rem;
  grid-row-gap: 2rem;
  align-items: center;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  ${breakpoint.s} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    :nth-child(2) {
      grid-column: 2 / span 2;
    }
  }
`;
type GeneralProductDataProps = OnClickBuyOrSwapHandler & {
  offer: Offer;
  exchange: Exchange | null;
} & Pick<UseGetOfferDetailDataProps, "onExchangePolicyClick">;

export const GeneralProductData: React.FC<GeneralProductDataProps> = ({
  offer,
  exchange,
  onExchangePolicyClick,
  onClickBuyOrSwap
}) => {
  const notCommittableOfferStatus = useNotCommittableOfferStatus({
    isOfferVoided: offer.voided
  });
  const { isConditionMet, exchangePolicyCheckResult } = useDetailViewContext();
  const config = useConfigContext();
  const offerDetailData = useGetOfferDetailData({
    defaultCurrencySymbol: config.defaultCurrency.symbol,
    offer,
    exchange,
    onExchangePolicyClick,
    exchangePolicyCheckResult
  });
  const isPhygital = useIsPhygital({ offer });
  const robloxGatedAssetId = useMemo(() => {
    return getIsOfferRobloxGated({ offer });
  }, [offer]);
  return (
    <Grid
      flexDirection="column"
      gap="0.5rem"
      alignItems="flex-start"
      justifyContent="space-between"
    >
      <GridContainer
        itemsPerRow={{
          xs: 2,
          s: 2,
          m: 2,
          l: 2,
          xl: 2
        }}
        style={{ alignItems: "center", width: "100%" }}
      >
        <Typography tag="h3">Price</Typography>
        <Grid alignItems="flex-end" flexDirection="column">
          <span style={{ color: colors.orange, textAlign: "right" }}>
            {notCommittableOfferStatus}
          </span>
          <StyledPrice
            isExchange={false}
            currencySymbol={offer.exchangeToken.symbol}
            value={offer.price}
            decimals={offer.exchangeToken.decimals}
            tag="h3"
            convert
            withAsterisk={false}
            isPriceDiscoveryOffer={offer.priceType === PriceType.Discovery}
          />
        </Grid>
      </GridContainer>
      <Break />
      {offer.condition && (
        <>
          <TokenGatedGrid>
            <Typography tag="h3">
              {robloxGatedAssetId ? "Roblox gated offer" : "Token gated offer"}
            </Typography>
            <TokenGatedItem
              offer={offer}
              isConditionMet={isConditionMet}
              onClickBuyOrSwap={onClickBuyOrSwap}
              robloxGatedAssetId={robloxGatedAssetId}
            />
          </TokenGatedGrid>
          <Break />
        </>
      )}
      {isPhygital && (
        <>
          <Typography tag="h3">Phygital product</Typography>
          <Break />
          <PhygitalProduct offer={offer} />
        </>
      )}
      <Typography tag="h3">Details</Typography>
      <Break style={{ marginBottom: "1rem" }} />
      <DetailTable
        align={false}
        noBorder
        data={offerDetailData}
        inheritColor={false}
      />
    </Grid>
  );
};
