import React, { ReactNode, useMemo } from "react";
import { isTruthy } from "../../types/helpers";
import { Context, ConfigContextProps } from "./ConfigContext";
import { useEnvContext } from "../environment/EnvironmentContext";
import { getEnvConfigById } from "@bosonprotocol/core-sdk";

export type ConfigProviderProps = Omit<
  ConfigContextProps,
  "config" | "defaultCurrency" | "sellerCurationList" | "offerCurationList"
> & {
  children: ReactNode;
  defaultCurrencyTicker: string;
  defaultCurrencySymbol: string;
  sellerCurationListBetweenCommas?: string;
  offerCurationListBetweenCommas?: string;
};
export function ConfigProvider({ children, ...rest }: ConfigProviderProps) {
  const { envName, configId } = useEnvContext();
  const envConfig = useMemo(
    () => getEnvConfigById(envName, configId),
    [envName, configId]
  );
  const sellerCurationList = useMemo(
    () =>
      rest.sellerCurationListBetweenCommas
        ?.split(",")
        .map((item) => item.trim())
        .filter(isTruthy),
    [rest.sellerCurationListBetweenCommas]
  );
  const offerCurationList = useMemo(
    () =>
      rest.offerCurationListBetweenCommas
        ?.split(",")
        .map((item) => item.trim())
        .filter(isTruthy),
    [rest.offerCurationListBetweenCommas]
  );
  return (
    <Context.Provider
      value={{
        ...rest,
        config: envConfig,
        sellerCurationList,
        offerCurationList,
        defaultCurrency: {
          ticker: rest.defaultCurrencyTicker,
          symbol: rest.defaultCurrencySymbol
        },
        fairExchangePolicyRules: rest.fairExchangePolicyRules,
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
