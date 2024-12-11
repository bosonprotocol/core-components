import React from "react";
import styled, { css, CSSProperties } from "styled-components";

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
  value?: string;
  currency: Currencies;
  height?: number;
  fontSize?: number | string;
  iconSize?: number;
  gap?: number | string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
}

export const CurrencyDisplay = ({
  value,
  currency,
  height = 25,
  fontSize,
  iconSize,
  gap,
  ...rest
}: CurrencyDisplayProps) => {
  return (
    <CurrencyDisplayValueWrapper
      style={{ height: `${height}px`, width: "100%" }}
      {...rest}
    >
      <CurrencyLogo currency={currency} size={iconSize || height} />
      {value && (
        <CurrencyDisplayValue $height={height} $fontSize={fontSize} $gap={gap}>
          {value}
        </CurrencyDisplayValue>
      )}
    </CurrencyDisplayValueWrapper>
  );
};

const CurrencyDisplayValueWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const CurrencyDisplayValue = styled.span<{
  $height: CSSProperties["height"];
  $fontSize?: CSSProperties["fontSize"];
  $gap?: CSSProperties["gap"];
}>`
  ${({ $height, $fontSize, $gap }) => css`
    line-height: ${$height}px;
    font-size: ${$fontSize ? $fontSize : `${(Number($height) - 5) / 16}rem`};
    padding-left: ${$gap !== undefined ? $gap : "1rem"};
  `}
  color: #09182c;
  display: flex;
  text-align: right;
  align-items: center;
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
