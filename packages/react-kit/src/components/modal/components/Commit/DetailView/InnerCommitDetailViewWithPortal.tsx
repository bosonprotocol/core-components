import React, { ElementRef, useRef } from "react";
import { DetailViewCore } from "./common/DetailViewCore";
import Grid from "../../../../ui/Grid";
import styled, { css } from "styled-components";
import { DetailViewProps } from "./common/types";
import { useNotCommittableOfferStatus } from "../useNotCommittableOfferStatus";
import { useDetailViewContext } from "./common/DetailViewProvider";
import { BuyOrSwapContainer } from "./common/BuyOrSwapContainer";
import { Button } from "../../../../buttons/Button";
import { ArrowsLeftRight } from "phosphor-react";

const BosonExclusive = styled.div<{
  $hasVariations: boolean;
  $isBosonExclusive: boolean;
}>`
  width: 100%;
  position: relative;
  height: 1rem;
  &:has(*) {
    height: 2rem;
  }
  ${({ $hasVariations, $isBosonExclusive }) =>
    $hasVariations &&
    $isBosonExclusive &&
    css`
      && {
        height: 3rem;
      }
    `}

  ${({ $hasVariations, $isBosonExclusive }) =>
    !$hasVariations &&
    !$isBosonExclusive &&
    css`
      && {
        height: 0;
      }
    `}
`;

const SwapArrows = styled(ArrowsLeftRight)`
  && {
    stroke: none;
  }
`;

export type InnerCommitDetailViewWithPortalProps = DetailViewProps;
export function InnerCommitDetailViewWithPortal(props: DetailViewProps) {
  const portalRef = useRef<ElementRef<"div">>(null);
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
  const hasVariations = !!selectedVariant.variations?.length;
  const isBosonExclusive = true; // TODO: change
  const notCommittableOfferStatus = useNotCommittableOfferStatus({
    isOfferVoided: props.selectedVariant.offer.voided
  });
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
    <Grid flexDirection="column">
      <BosonExclusive
        ref={portalRef}
        $hasVariations={hasVariations}
        $isBosonExclusive={isBosonExclusive}
      />
      <DetailViewCore
        {...props}
        status={notCommittableOfferStatus}
        ref={portalRef}
        isBosonExclusive={isBosonExclusive}
      >
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
      </DetailViewCore>
    </Grid>
  );
}
