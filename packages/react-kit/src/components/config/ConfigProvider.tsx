import React, { ReactNode } from "react";
import { isTruthy } from "../../types/helpers";
import { Context, ConfigContextProps } from "./ConfigContext";

export type ConfigProviderProps = Omit<
  ConfigContextProps,
  "defaultCurrency" | "sellerCurationList" | "offerCurationList"
> & {
  children: ReactNode;
  defaultCurrencyTicker: string;
  defaultCurrencySymbol: string;
  sellerCurationListBetweenCommas?: string;
  offerCurationListBetweenCommas?: string;
};
export function ConfigProvider({ children, ...rest }: ConfigProviderProps) {
  const sellerCurationList = rest.sellerCurationListBetweenCommas
    ?.split(",")
    .map((item) => item.trim())
    .filter(isTruthy);
  const offerCurationList = rest.offerCurationListBetweenCommas
    ?.split(",")
    .map((item) => item.trim())
    .filter(isTruthy);
  return (
    <Context.Provider
      value={{
        ...rest,
        sellerCurationList,
        offerCurationList,
        defaultCurrency: {
          ticker: rest.defaultCurrencyTicker,
          symbol: rest.defaultCurrencySymbol
        },
        dateFormat: rest.dateFormat || "YYYY/MM/DD",
        shortDateFormat: rest.shortDateFormat || "MMM DD, YYYY",
        minimumDisputePeriodInDays: rest.minimumDisputePeriodInDays || 30,
        minimumDisputeResolutionPeriodDays:
          rest.minimumDisputeResolutionPeriodDays || 15,
        buyerSellerAgreementTemplate:
          rest.buyerSellerAgreementTemplate ||
          "ipfs://QmXxRznUVMkQMb6hLiojbiv9uDw22RcEpVk6Gr3YywihcJ",
        licenseTemplate:
          rest.licenseTemplate ||
          "ipfs://QmeYsxxy4aDvC5ocMEDrBj5xjSKobnRNw9VDN8DBzqqdmj"
      }}
    >
      {children}
    </Context.Provider>
  );
}