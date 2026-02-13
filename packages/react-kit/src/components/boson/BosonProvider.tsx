import React, { ReactNode, createContext, useContext, useMemo } from "react";
import { isTruthy } from "../../types/helpers";

export type BosonProviderProps = {
  minimumDisputePeriodInDays?: number;
  minimumDisputeResolutionPeriodDays?: number;
  fairExchangePolicyRules?: string;
  commitProxyAddress?: string;
  openseaLinkToOriginalMainnetCollection?: string;
  enableCurationLists?: boolean;
  withOwnProducts?: "all" | "mine" | "custom";
  buyerSellerAgreementTemplate?: string;
  licenseTemplate?: string;
  contactSellerForExchangeUrl?: string;
  sellerCurationListBetweenCommas?: string;
  offerCurationListBetweenCommas?: string;
};

type BosonContextProps = Omit<
  BosonProviderProps,
  "sellerCurationListBetweenCommas" | "offerCurationListBetweenCommas"
> & {
  sellerCurationList?: string[];
  offerCurationList?: string[];
  licenseTemplate: string;
  fairExchangePolicyRules: string;
  contactSellerForExchangeUrl: string;
  buyerSellerAgreementTemplate: string;
  minimumDisputePeriodInDays: number;
  minimumDisputeResolutionPeriodDays: number;
};

const BosonContext = createContext<null | BosonContextProps>(null);
export function BosonProvider({
  children,
  ...rest
}: BosonProviderProps & { children: ReactNode }) {
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
    <BosonContext.Provider
      value={{
        ...rest,
        sellerCurationList,
        offerCurationList,
        minimumDisputePeriodInDays: rest.minimumDisputePeriodInDays || 30,
        minimumDisputeResolutionPeriodDays:
          rest.minimumDisputeResolutionPeriodDays || 15,
        fairExchangePolicyRules:
          rest.fairExchangePolicyRules ||
          "ipfs://QmPBjCyxLdYFGQRJnD1xfdtBTEUsviwJV5Y4ZN3rCBo2QQ",
        contactSellerForExchangeUrl:
          rest.contactSellerForExchangeUrl || "https://bosonapp.io/#/chat/{id}",
        buyerSellerAgreementTemplate:
          rest.buyerSellerAgreementTemplate ||
          "ipfs://QmXxRznUVMkQMb6hLiojbiv9uDw22RcEpVk6Gr3YywihcJ",
        licenseTemplate:
          rest.licenseTemplate ||
          "ipfs://QmeYsxxy4aDvC5ocMEDrBj5xjSKobnRNw9VDN8DBzqqdmj"
      }}
    >
      {children}
    </BosonContext.Provider>
  );
}

export const useBosonContext = () => {
  const contextValue = useContext(BosonContext);
  if (!contextValue) {
    throw new Error("useBosonContext has to be used inside the BosonProvider");
  }
  return contextValue;
};
