import React from "react";
import styled, { css } from "styled-components";

import { Bitcoin, Ether, Solana, Polygon, Tether } from "../../icons/coins";

export enum Currencies {
  ETH = "ETH",
  BTC = "BTC",
  POLYGON = "MATIC",
  SOLANA = "SOL",
  TETHER = "USDT"
}
interface CurrencyDisplayProps {
  value?: number;
  currency: Currencies;
  height?: number;
}

export const CurrencyDisplay = ({
  value,
  currency,
  height = 25
}: CurrencyDisplayProps) => {
  return (
    <CurrencyDisplayValueWrapper
      style={{ height: `${height}px`, width: "100%" }}
    >
      <CurrencyLogo currency={currency} size={height} />
      {value && (
        <CurrencyDisplayValue height={height}>{value}</CurrencyDisplayValue>
      )}
    </CurrencyDisplayValueWrapper>
  );
};

const CurrencyDisplayValueWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const CurrencyDisplayValue = styled.span.attrs((props: { height: number }) => ({
  height: props.height
}))`
  ${({ height }) =>
    css`
      line-height: ${height}px;
      font-size: ${height - 5}px;
    `}

  color: #09182c;
  display: flex;
  text-align: right;
  align-items: center;
  padding-left: 1rem;
`;

const CurrencyLogo = ({
  currency,
  size = 25
}: {
  currency: Currencies;
  size?: number;
}) => {
  switch (currency) {
    case Currencies.ETH:
      return <Ether size={size} />;

    case Currencies.BTC:
      return <Bitcoin size={size} />;

    case Currencies.POLYGON:
      return <Polygon size={size} />;

    case Currencies.SOLANA:
      return <Solana size={size} />;

    case Currencies.TETHER:
      return <Tether size={size} />;

    default:
      return <div>{currency}</div>;
  }
};
