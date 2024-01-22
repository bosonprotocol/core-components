import { ArrowRight, ArrowsLeftRight } from "phosphor-react";
import React, { useMemo } from "react";
import styled from "styled-components";
import { Button } from "../../../../buttons/Button";
import { Grid } from "../../../../ui/Grid";
import { InnerDetailViewWithPortal } from "../../common/detail/InnerDetailViewWithPortal";
import { BuyOrSwapContainer } from "../../common/detail/BuyOrSwapContainer";
import { useDetailViewContext } from "../../common/detail/DetailViewProvider";
import { DetailViewProps } from "../../common/detail/types";
import { useBuyers } from "../../../../../hooks/useBuyers";
import { useAccount } from "../../../../../hooks/connection/connection";
import { theme } from "../../../../../theme";
const colors = theme.colors.light;

const SwapArrows = styled(ArrowsLeftRight)`
  && {
    stroke: none;
  }
`;

export type InnerCommitDetailViewWithPortalProps = DetailViewProps & {
  onAlreadyOwnOfferClick?: () => void;
};
export function InnerCommitDetailViewWithPortal(
  props: InnerCommitDetailViewWithPortalProps
) {
  const {
    quantity,
    isBuyerInsufficientFunds,
    swapParams,
    isOfferNotValidYet,
    isExpiredOffer,
    hasSellerEnoughFunds
  } = useDetailViewContext();
  const { selectedVariant, onClickBuyOrSwap, onAlreadyOwnOfferClick } = props;
  const { offer } = selectedVariant;
  const { address } = useAccount();
  const { data: buyers } = useBuyers(
    {
      wallet: address
    },
    { enabled: !!address }
  );
  const buyer = buyers?.[0];
  const userCommittedOffersLength = useMemo(
    () =>
      buyer
        ? offer.exchanges?.filter((elem) => elem?.buyer?.id === buyer.id).length
        : 0,
    [offer, buyer]
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
  return (
    <InnerDetailViewWithPortal
      {...props}
      topChildren={
        address && !!userCommittedOffersLength ? (
          <Grid
            alignItems="center"
            justifyContent="space-between"
            style={{
              ...(onAlreadyOwnOfferClick && { cursor: "pointer" })
            }}
            onClick={() => onAlreadyOwnOfferClick?.()}
          >
            <p style={{ color: colors.orange, margin: 0, fontSize: "0.75rem" }}>
              You already own {userCommittedOffersLength}{" "}
              <b>{offer.metadata.name}</b> rNFT
            </p>
            {onAlreadyOwnOfferClick && (
              <ArrowRight size={18} color={colors.orange} />
            )}
          </Grid>
        ) : null
      }
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
    </InnerDetailViewWithPortal>
  );
}
