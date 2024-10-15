import { css, styled } from "styled-components";
import { Grid } from "../../../../ui/Grid";
import React, { ReactNode } from "react";
import { Checks, Package, ShoppingCartSimple } from "phosphor-react";
import { Typography } from "../../../../ui/Typography";
import { theme } from "../../../../../theme";
const colors = theme.colors.light;

const IconWrapper = styled.div<{ $isDisabled?: boolean }>`
  display: grid;
  align-content: center;
  justify-content: center;
  min-width: 40px;
  min-height: 40px;
  background-color: black;
  border-radius: 8px;
  ${({ $isDisabled }) => {
    return $isDisabled
      ? css`
          background-color: ${colors.lightGrey};
        `
      : "";
  }};
`;
const Wrapper = styled(Grid)`
  > *:first-child > *:first-child {
    position: relative;
    &::after {
      content: "";
      position: absolute;
      background-color: ${colors.lightGrey};
      bottom: -62%;
      left: 50%;
      height: 18px;
      width: 3px;
      flex-shrink: 0;
    }
  }
`;

const iconSize = 24;
export type CommitRedeemStepsProps = {
  offerId: string;
  status: "pending-transaction" | "pending-signature" | "success";
  children: ReactNode;
};
export const CommitRedeemSteps = ({
  offerId,
  status,
  children
}: CommitRedeemStepsProps) => {
  return (
    <Wrapper flexDirection="column" alignItems="flex-start" gap="2rem">
      {status === "pending-signature" ? (
        <Grid justifyContent="flex-start" gap="1rem">
          <IconWrapper>
            <ShoppingCartSimple color="white" size={iconSize} />
          </IconWrapper>
          <Typography fontSize="0.875rem" fontWeight={600}>
            Confirm transaction to buy this product
          </Typography>
        </Grid>
      ) : status === "success" ? (
        <Grid justifyContent="flex-start" gap="1rem">
          <IconWrapper>
            <Checks color="black" size={iconSize} />
          </IconWrapper>
          <Typography fontSize="0.875rem" fontWeight={600}>
            You've successfully purchased this item.
          </Typography>
        </Grid>
      ) : null}
      {status === "pending-signature" ? (
        <Grid justifyContent="flex-start" gap="1rem" style={{ opacity: 0.5 }}>
          <IconWrapper $isDisabled={true}>
            <Package color="black" size={iconSize} />
          </IconWrapper>
          <Grid flexDirection="column" alignItems="flex-start">
            <Typography fontSize="0.875rem" fontWeight={600}>
              Request shipment (redeem)
            </Typography>
            <Typography fontSize="0.75rem" fontWeight={400}>
              You can redeem your product now or later.
            </Typography>
          </Grid>
        </Grid>
      ) : status === "success" ? (
        <Grid justifyContent="flex-start" gap="1rem">
          <IconWrapper>
            <Package color="white" size={iconSize} />
          </IconWrapper>
          <Typography fontSize="0.875rem" fontWeight={600}>
            Ship, Trade or Hold
          </Typography>
        </Grid>
      ) : null}
      {children}
    </Wrapper>
  );
};
