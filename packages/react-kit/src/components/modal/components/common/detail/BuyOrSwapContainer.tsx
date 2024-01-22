import React, { AnchorHTMLAttributes, ReactNode } from "react";
import { OnClickBuyOrSwapHandler } from "./types";
import styled from "styled-components";

const SwapAnchor = styled.a`
  all: inherit;
  font-weight: 600;
`;

export const BuyOrSwapContainer = ({
  children,
  swapParams,
  onClickBuyOrSwap,
  ...rest
}: {
  children: ReactNode;
  swapParams: {
    outputCurrency: string;
    exactAmount: string;
    exactField: string;
  };
} & OnClickBuyOrSwapHandler &
  AnchorHTMLAttributes<HTMLAnchorElement>) => {
  return onClickBuyOrSwap ? (
    <>{children}</>
  ) : (
    <SwapAnchor
      {...rest}
      target="__blank"
      href={`https://bosonapp.io/#/swap?${new URLSearchParams(
        swapParams
      ).toString()}`}
    >
      {children}
    </SwapAnchor>
  );
};
