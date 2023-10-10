import { ProtocolConfig } from "@bosonprotocol/core-sdk";
import { createContext, useContext } from "react";

export type ConfigContextProps = {
  config: ProtocolConfig;
  dateFormat: string;
  shortDateFormat: string;
  defaultCurrency: {
    ticker: "USD" | string;
    symbol: "$" | string;
  };
  minimumDisputePeriodInDays: number;
  minimumDisputeResolutionPeriodDays: number;
  fairExchangePolicyRules: string;
  commitProxyAddress?: string;
  openseaLinkToOriginalMainnetCollection?: string;
  enableCurationLists?: boolean;
  sellerCurationList?: string[];
  offerCurationList?: string[];
  withOwnProducts?: "all" | "mine" | "custom";
  buyerSellerAgreementTemplate: string;
  licenseTemplate: string;
  contactSellerForExchangeUrl: string;
  usePendingTransactions?: boolean;
  magicLinkKey: string;
  infuraKey: string;
};

export const Context = createContext<ConfigContextProps | null>(null);

export const useConfigContext = () => {
  const contextValue = useContext(Context);
  if (!contextValue) {
    throw new Error(
      "You need to use ConfigProvider before using useConfigContext"
    );
  }
  return contextValue;
};
