import { exchanges, subgraph } from "@bosonprotocol/core-sdk";
import dayjs from "dayjs";
import { ArrowRight, Check } from "phosphor-react";
import React from "react";
import styled from "styled-components";
import {
  useAccount,
  useIsConnectedToWrongChain
} from "../../../../../hooks/connection/connection";
import type { ExtendedExchange } from "../../../../../hooks/useExchanges";
import { getDateTimestamp } from "@bosonprotocol/utils";
import { titleCase } from "@bosonprotocol/utils";
import { breakpoint } from "@bosonprotocol/utils";
import { colors, getCssVar } from "../../../../../theme";
import { Button } from "../../../../buttons/Button";
import { Grid } from "../../../../ui/Grid";
import ThemedButton from "../../../../ui/ThemedButton";
import { Typography } from "../../../../ui/Typography";
import { ButtonSize } from "../../../../ui/buttonSize";
import {
  RaiseProblemButton,
  RedeemLeftButton,
  StyledCancelButton
} from "../../common/detail/Detail.style";
import { InnerDetailViewWithPortal } from "../../common/detail/InnerDetailViewWithPortal";
import { DetailViewProps } from "../../common/detail/types";

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
  subgraph.ExchangeState.COMMITTED,
  subgraph.ExchangeState.REVOKED,
  subgraph.ExchangeState.CANCELLED,
  exchanges.ExtendedExchangeState.Expired,
  subgraph.ExchangeState.COMPLETED,
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
    !exchangeStatus || exchangeStatus === subgraph.ExchangeState.COMMITTED;
  const isBeforeRedeem =
    !exchangeStatus || NOT_REDEEMED_YET.includes(exchangeStatus);

  const isExchangeExpired =
    exchangeStatus &&
    [exchanges.ExtendedExchangeState.Expired].includes(
      exchangeStatus as unknown as exchanges.ExtendedExchangeState
    );
  const isInWrongChain = useIsConnectedToWrongChain();
  const isRedeemDisabled = !isBuyer || isExchangeExpired;
  const voucherRedeemableUntilDate = dayjs(
    getDateTimestamp(
      exchange?.validUntilDate ?? exchange.offer.voucherRedeemableUntilDate
    )
  );
  const nowDate = dayjs();

  const totalHours = voucherRedeemableUntilDate.diff(nowDate, "hours");
  const redeemableDays = Math.floor(totalHours / 24);
  const redeemableHours = totalHours - redeemableDays * 24;
  return (
    <InnerDetailViewWithPortal
      {...props}
      priceSibling={
        <>
          {isToRedeem ? (
            <>
              <div />
              <Grid flexDirection="column" style={{ gridColumn: "1 / span 2" }}>
                <RedeemButton
                  variant="primaryFill"
                  size={ButtonSize.Large}
                  disabled={isInWrongChain || !isBuyer}
                  onClick={() => {
                    onRedeem?.();
                  }}
                  style={{ width: "100%" }}
                >
                  <span>Redeem</span>
                </RedeemButton>
                {!isRedeemDisabled && (
                  <Typography
                    fontSize="0.8rem"
                    style={{
                      color: "initial",
                      display: "block",
                      marginTop: "0.25rem"
                    }}
                    color={getCssVar("--sub-text-color")}
                  >
                    By proceeding to Redeem, I agree to the{" "}
                    <span
                      style={{
                        fontSize: "inherit",
                        cursor: "pointer",
                        textDecoration: "underline"
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
            </>
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
              style={{ color: colors.greyDark, margin: 0 }}
              fontSize="0.75rem"
            >
              You can withdraw your funds here
            </Typography>
            <ArrowRight size={18} color={colors.greyDark} />
          </Grid>
        ) : isToRedeem ? (
          <RedeemLeftButton style={{ paddingTop: 0, paddingBottom: 0 }}>
            {redeemableDays > 0
              ? `${redeemableDays} days left to Redeem`
              : `${redeemableHours} hours left to Redeem`}
          </RedeemLeftButton>
        ) : null
      }
      bottomChildren={
        <>
          {isBeforeRedeem ? (
            <>
              {![
                exchanges.ExtendedExchangeState.Expired,
                subgraph.ExchangeState.CANCELLED,
                subgraph.ExchangeState.REVOKED,
                subgraph.ExchangeState.COMPLETED
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
                  Cancel exchange
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
