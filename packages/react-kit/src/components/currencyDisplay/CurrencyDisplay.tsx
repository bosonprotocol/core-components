import React from "react";
import styled, { css } from "styled-components";

import {
  Bitcoin,
  Boson,
  Dai,
  Ether,
  Polygon,
  Solana,
  Tether,
  Usdc,
  Weth
} from "../../icons/coins";

export enum Currencies {
  BOSON = "BOSON",
  BTC = "BTC",
  DAI = "DAI",
  ETH = "ETH",
  POLYGON = "MATIC",
  SOLANA = "SOL",
  TETHER = "USDT",
  USDC = "USDC",
  WETH = "WETH"
}
interface CurrencyDisplayProps {
  value?: number | string;
  currency: Currencies;
  height?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
}

export const CurrencyDisplay = ({
  value,
  currency,
  height = 25,
  ...rest
}: CurrencyDisplayProps) => {
  return (
    <CurrencyDisplayValueWrapper
      style={{ height: `${height}px`, width: "100%" }}
      {...rest}
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

export const CurrencyLogo = ({
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

    case Currencies.DAI:
      return <Dai size={size} />;

    case Currencies.WETH:
      return <Weth size={size} />;

    case Currencies.BOSON:
      return <Boson size={size} />;

    case Currencies.USDC:
      return <Usdc size={size} />;

    default:
      return <div>{currency}</div>;
  }
};
