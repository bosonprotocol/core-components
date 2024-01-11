import React, { useMemo } from "react";
import styled from "styled-components";
import { Offer } from "../../../../../types/offer";
import Price from "../../../../price/Price";
import GridContainer from "../../../../ui/GridContainer";
import Typography from "../../../../ui/Typography";
import { Break } from "../detail/Detail.style";
import { theme } from "../../../../../theme";
import { useNotCommittableOfferStatus } from "../../Commit/useNotCommittableOfferStatus";
import { TokenGatedItem } from "../detail/TokenGatedItem";
import { useDetailViewContext } from "../../Commit/DetailView/common/DetailViewProvider";
import { breakpoint } from "../../../../../lib/ui/breakpoint";
import Grid from "../../../../ui/Grid";
import DetailTable from "../detail/DetailTable";
import { getOfferDetailData } from "../../Commit/DetailView/common/getOfferDetailData";
import { useConvertedPrice } from "../../../../price/useConvertedPrice";
import { useConfigContext } from "../../../../config/ConfigContext";
import { useDisplayFloat } from "../../../../../lib/price/prices";
const colors = theme.colors.light;

const StyledPrice = styled(Price)`
  h3 {
    font-size: 2rem;
  }
  small {
    font-size: 1rem;
  }
`;
const TokenGatedGrid = styled.div`
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
type GeneralProductDataProps = {
  offer: Offer;
  onExchangePolicyClick: () => void;
};

export const GeneralProductData: React.FC<GeneralProductDataProps> = ({
  offer,
  onExchangePolicyClick
}) => {
  const notCommittableOfferStatus = useNotCommittableOfferStatus({
    isOfferVoided: offer.voided
  });
  const { isConditionMet, exchangePolicyCheckResult } = useDetailViewContext();
  const config = useConfigContext();
  const convertedPrice = useConvertedPrice({
    value: offer.price,
    decimals: offer.exchangeToken.decimals,
    symbol: offer.exchangeToken.symbol
  });
  const displayFloat = useDisplayFloat();
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
  const isPhygital = false; // TODO: change
  return (
    <>
      <GridContainer
        itemsPerRow={{
          xs: 1,
          s: 3,
          m: 3,
          l: 3,
          xl: 3
        }}
        style={{ alignItems: "center" }}
      >
        <Typography tag="h3">Price</Typography>
        <StyledPrice
          isExchange={false}
          currencySymbol={offer.exchangeToken.symbol}
          value={offer.price}
          decimals={offer.exchangeToken.decimals}
          tag="h3"
          convert
          withBosonStyles
          withAsterisk={false}
        />
        <span style={{ color: colors.orange, textAlign: "right" }}>
          {notCommittableOfferStatus}
        </span>
      </GridContainer>
      <Break />
      {offer.condition && (
        <>
          <TokenGatedGrid>
            <Typography tag="h3">Token Gated Offer</Typography>
            <TokenGatedItem offer={offer} isConditionMet={isConditionMet} />
          </TokenGatedGrid>
          <Break />
        </>
      )}
      {isPhygital && (
        <>
          <Typography tag="h3">Phygital Product</Typography>
          <Break />
          <GridContainer
            itemsPerRow={{
              xs: 1,
              s: 3,
              m: 3,
              l: 3,
              xl: 3
            }}
            style={{ alignItems: "center" }}
          >
            <Typography>
              This is what you'll get when you purchase this product.
            </Typography>
            <Grid flexDirection="column" alignItems="flex-start">
              <Typography>
                <b>This product includes:</b>
              </Typography>
            </Grid>
          </GridContainer>
        </>
      )}
      <Typography tag="h3">Details</Typography>
      <Break style={{ marginBottom: "1rem" }} />
      <DetailTable
        align={false}
        noBorder
        data={OFFER_DETAIL_DATA}
        inheritColor={false}
      />
    </>
  );
};
