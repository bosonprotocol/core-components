import React from "react";
import { InnerDetailViewWithPortal } from "./InnerDetailViewWithPortal";
import { DetailViewProps } from "./common/types";
import { Button } from "../../../../buttons/Button";
import styled from "styled-components";
import { breakpoint } from "../../../../../lib/ui/breakpoint";
import { ButtonSize } from "../../../../ui/buttonSize";
import ThemedButton from "../../../../ui/ThemedButton";
import { ArrowRight, Check, Question } from "phosphor-react";
import type { ExtendedExchange } from "../../../../../hooks/useExchanges";
import { exchanges, subgraph } from "@bosonprotocol/core-sdk";
import { titleCase } from "../../../../../lib/string/formatText";
import {
  useAccount,
  useIsConnectedToWrongChain
} from "../../../../../hooks/connection/connection";
import {
  ActionMessage,
  RaiseProblemButton,
  StyledCancelButton
} from "../../common/detail/Detail.style";
import Grid from "../../../../ui/Grid";
import Typography from "../../../../ui/Typography";
import { theme } from "../../../../../theme";
const colors = theme.colors.light;

const RedeemButton = styled(Button)`
  padding: 1rem;
  height: 3.5rem;
  display: flex;
  align-items: center;

  && {
    > div {
      width: 100%;
      gap: 1rem;
      display: flex;
      align-items: stretch;
      justify-content: center;
      small {
        align-items: center;
      }
    }

    ${breakpoint.s} {
      > div {
        gap: 0.5rem;
      }
    }
    ${breakpoint.m} {
      > div {
        gap: 1rem;
      }
    }
  }
`;
const NOT_REDEEMED_YET = [
  subgraph.ExchangeState.Committed,
  subgraph.ExchangeState.Revoked,
  subgraph.ExchangeState.Cancelled,
  exchanges.ExtendedExchangeState.Expired,
  subgraph.ExchangeState.Completed,
  exchanges.ExtendedExchangeState.NotRedeemableYet
];
export type InnerExchangeDetailViewProps = Omit<
  DetailViewProps,
  "children" | "hasSellerEnoughFunds"
> & {
  exchange: ExtendedExchange;
  onRedeem: () => void;
  onExpireVoucherClick: () => void;
  onRaiseDisputeClick: () => void;
  onCancelExchangeClick: () => void;
  onContractualAgreementClick: () => void;
};
export default function InnerExchangeDetailView(
  props: InnerExchangeDetailViewProps
) {
  const {
    exchange,
    isPreview,
    onRedeem,
    onExpireVoucherClick,
    onRaiseDisputeClick,
    onCancelExchangeClick,
    onContractualAgreementClick
  } = props;
  const { address } = useAccount();
  const isBuyer = exchange?.buyer.wallet === address?.toLowerCase();
  const exchangeStatus = exchange ? exchanges.getExchangeState(exchange) : null;

  const disabledRedeemText =
    exchangeStatus === exchanges.ExtendedExchangeState.NotRedeemableYet
      ? "Redeem"
      : titleCase(exchangeStatus || "Unsupported");
  const isToRedeem =
    !exchangeStatus || exchangeStatus === subgraph.ExchangeState.Committed;
  const isBeforeRedeem =
    !exchangeStatus || NOT_REDEEMED_YET.includes(exchangeStatus);

  const isExchangeExpired =
    exchangeStatus &&
    [exchanges.ExtendedExchangeState.Expired].includes(
      exchangeStatus as unknown as exchanges.ExtendedExchangeState
    );
  const isInWrongChain = useIsConnectedToWrongChain();
  const isRedeemDisabled = isPreview || !isBuyer || isExchangeExpired;
  return (
    <InnerDetailViewWithPortal
      {...props}
      priceSibling={
        <>
          {isToRedeem ? (
            <Grid flexDirection="column">
              <RedeemButton
                variant="primaryFill"
                size={ButtonSize.Large}
                disabled={isInWrongChain || isPreview || !isBuyer}
                onClick={() => {
                  onRedeem?.();
                }}
                style={{ width: "100%" }}
              >
                <span>Redeem</span>
              </RedeemButton>
              {isToRedeem && !isRedeemDisabled && (
                <Typography
                  $fontSize="0.8rem"
                  style={{ color: "initial", display: "block" }}
                >
                  By proceeding to Redeem, I agree to the{" "}
                  <span
                    style={{
                      color: colors.blue,
                      fontSize: "inherit",
                      cursor: "pointer"
                    }}
                    onClick={() => {
                      onContractualAgreementClick();
                    }}
                  >
                    Buyer & Seller Agreement
                  </span>
                  .
                </Typography>
              )}
            </Grid>
          ) : (
            <ThemedButton
              themeVal="outline"
              disabled
              style={{ marginBottom: "0.5rem" }}
            >
              {disabledRedeemText}
              <Check size={24} />
            </ThemedButton>
          )}
        </>
      }
      topChildren={
        isExchangeExpired ? (
          <Grid
            alignItems="center"
            justifyContent="space-between"
            style={{
              cursor: "pointer"
            }}
            onClick={() => {
              if (exchange) {
                onExpireVoucherClick();
              }
            }}
          >
            <Typography
              tag="p"
              style={{ color: colors.darkGrey, margin: 0 }}
              $fontSize="0.75rem"
            >
              You can withdraw your funds here
            </Typography>
            <ArrowRight size={18} color={colors.darkGrey} />
          </Grid>
        ) : null
      }
      bottomChildren={
        <>
          {isBeforeRedeem ? (
            <>
              {![
                exchanges.ExtendedExchangeState.Expired,
                subgraph.ExchangeState.Cancelled,
                subgraph.ExchangeState.Revoked,
                subgraph.ExchangeState.Completed
              ].includes(
                exchangeStatus as
                  | exchanges.ExtendedExchangeState
                  | subgraph.ExchangeState
              ) && (
                <StyledCancelButton
                  onClick={onCancelExchangeClick}
                  themeVal="blank"
                  type="button"
                  style={{ fontSize: "0.875rem" }}
                  disabled={isInWrongChain || !isBuyer}
                >
                  Cancel
                </StyledCancelButton>
              )}
            </>
          ) : (
            <>
              {!exchange?.disputed && (
                <RaiseProblemButton
                  onClick={() => {
                    onRaiseDisputeClick?.();
                  }}
                  type="button"
                  themeVal="blank"
                  style={{ fontSize: "0.875rem" }}
                  disabled={
                    exchange?.state !== "REDEEMED" || !isBuyer || isInWrongChain
                  }
                >
                  Raise a problem
                  <Question size={18} />
                </RaiseProblemButton>
              )}
            </>
          )}
        </>
      }
    >
      <></>
    </InnerDetailViewWithPortal>
  );
}