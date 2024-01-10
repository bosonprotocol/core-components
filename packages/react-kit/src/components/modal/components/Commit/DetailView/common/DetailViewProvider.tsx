import { CheckExchangePolicyResult } from "@bosonprotocol/core-sdk/dist/cjs/offers";
import { BigNumber } from "ethers";
import React, { ReactNode, createContext, useContext } from "react";

export type DetailContextProps = {
  quantity: number;
  isBuyerInsufficientFunds: boolean;
  balanceLoading: boolean;
  exchangeTokenBalance: BigNumber | undefined;
  isOfferNotValidYet: boolean;
  isExpiredOffer: boolean;
  isConditionMet: boolean;
  hasSellerEnoughFunds: boolean;
  exchangePolicyCheckResult: CheckExchangePolicyResult | undefined;
};
const DetailViewContext = createContext<DetailContextProps | undefined>(
  undefined
);

type DetailViewProviderProps = DetailContextProps & {
  children: ReactNode;
};

export const DetailViewProvider: React.FC<DetailViewProviderProps> = ({
  children,
  ...rest
}) => {
  return (
    <DetailViewContext.Provider value={rest}>
      {children}
    </DetailViewContext.Provider>
  );
};

export const useDetailViewContext = () => {
  const context = useContext(DetailViewContext);
  if (!context) {
    throw new Error(
      "useDetailViewContext must be used within DetailViewProvider"
    );
  }
  return context;
};
