import { BigNumber } from "ethers";
import React, { ReactNode, createContext, useContext } from "react";

type ContextProps = {
  quantity: number;
  isBuyerInsufficientFunds: boolean;
  balanceLoading: boolean;
  exchangeTokenBalance: BigNumber | undefined;
  isOfferNotValidYet: boolean;
  isExpiredOffer: boolean;
  isConditionMet: boolean;
  hasSellerEnoughFunds: boolean;
};
const DetailViewContext = createContext<ContextProps | undefined>(undefined);

type DetailViewProviderProps = ContextProps & {
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
