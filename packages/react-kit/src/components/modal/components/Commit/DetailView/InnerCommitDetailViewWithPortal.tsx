import { ArrowsLeftRight } from "phosphor-react";
import React from "react";
import styled from "styled-components";
import { Button } from "../../../../buttons/Button";
import Grid from "../../../../ui/Grid";
import { InnerDetailViewWithPortal } from "./InnerDetailViewWithPortal";
import { BuyOrSwapContainer } from "./common/BuyOrSwapContainer";
import { useDetailViewContext } from "./common/DetailViewProvider";
import { DetailViewProps } from "./common/types";

const SwapArrows = styled(ArrowsLeftRight)`
  && {
    stroke: none;
  }
`;

export type InnerCommitDetailViewWithPortalProps = DetailViewProps;
export function InnerCommitDetailViewWithPortal(props: DetailViewProps) {
  const {
    quantity,
    isBuyerInsufficientFunds,
    swapParams,
    isOfferNotValidYet,
    isExpiredOffer,
    hasSellerEnoughFunds
  } = useDetailViewContext();
  const { selectedVariant, onClickBuyOrSwap } = props;
  const { offer } = selectedVariant;
  const isOfferEmpty = quantity < 1;

  const isNotCommittableOffer =
    isOfferEmpty ||
    isOfferNotValidYet ||
    isExpiredOffer ||
    offer.voided ||
    !hasSellerEnoughFunds ||
    isBuyerInsufficientFunds;

  const tokenOrCoinSymbol = offer.exchangeToken.symbol;
  return (
    <InnerDetailViewWithPortal {...props}>
      {isNotCommittableOffer && isBuyerInsufficientFunds && (
        <Grid marginBottom="1rem">
          <BuyOrSwapContainer
            swapParams={swapParams}
            onClickBuyOrSwap={onClickBuyOrSwap}
            style={{ padding: 0 }}
          >
            <Button
              size="regular"
              variant="accentInverted"
              withBosonStyle
              style={{
                width: "100%"
              }}
              {...(onClickBuyOrSwap && {
                onClick: () => onClickBuyOrSwap({ swapParams })
              })}
            >
              Buy or Swap {tokenOrCoinSymbol} <SwapArrows size={24} />
            </Button>
          </BuyOrSwapContainer>
        </Grid>
      )}
      {!isBuyerInsufficientFunds && props.children}
    </InnerDetailViewWithPortal>
  );
}
