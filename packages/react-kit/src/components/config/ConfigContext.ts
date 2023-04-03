import { createContext, useContext } from "react";

export type ConfigProviderProps = {
  dateFormat: string;
  shortDateFormat: string;
  defaultCurrency: {
    ticker: "USD" | string;
    symbol: "$" | string;
  };
  minimumDisputePeriodInDays: number;
  minimumDisputeResolutionPeriodDays: number;
  commitProxyAddress?: string;
  openseaLinkToOriginalMainnetCollection?: string;
  enableCurationLists?: boolean;
  sellerCurationList?: string[];
  offerCurationList?: string[];
  withOwnProducts?: "all" | "mine" | "custom";
  buyerSellerAgreementTemplate: string;
  licenseTemplate: string;
  contactSellerForExchangeUrl: string;
  redeemCallbackUrl?: string;
  usePendingTransactions?: boolean;
};

export const Context = createContext<ConfigProviderProps | null>(null);

export const useConfigContext = () => {
  const contextValue = useContext(Context);
  if (!contextValue) {
    throw new Error(
      "You need to use ConfigProvider before using useConfigContext"
    );
  }
  return contextValue;
};
