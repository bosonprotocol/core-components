import React, { ReactNode } from "react";
import { OnClickBuyOrSwapHandler } from "./types";

export const BuyOrSwapContainer = ({
  children,
  swapParams,
  onClickBuyOrSwap
}: {
  children: ReactNode;
  swapParams: {
    outputCurrency: string;
    exactAmount: string;
    exactField: string;
  };
} & OnClickBuyOrSwapHandler) => {
  return onClickBuyOrSwap ? (
    <>{children}</>
  ) : (
    <a
      style={{ all: "inherit", fontWeight: "600" }}
      target="__blank"
      href={`https://bosonapp.io/#/swap?${new URLSearchParams(
        swapParams
      ).toString()}`}
    >
      {children}
    </a>
  );
};
