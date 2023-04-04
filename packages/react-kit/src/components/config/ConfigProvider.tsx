import React, { ReactNode } from "react";
import { Context, ConfigContextProps } from "./ConfigContext";

export type ConfigProviderProps = Omit<
  ConfigContextProps,
  "defaultCurrency"
> & {
  children: ReactNode;
  defaultCurrencyTicker: string;
  defaultCurrencySymbol: string;
};
export function ConfigProvider({ children, ...rest }: ConfigProviderProps) {
  return (
    <Context.Provider
      value={{
        ...rest,
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
          "ipfs://QmS6SUVL1mhRq9wyNho914vcHwj3gC491vq7wtdoe34SUz",
        licenseTemplate:
          rest.licenseTemplate ||
          "ipfs://QmUxAXqM6smDYj7TvS9oDe5kRoAVmkqcyWCKEeNsD6JA97"
      }}
    >
      {children}
    </Context.Provider>
  );
}
