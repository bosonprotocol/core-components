import { ProtocolConfig } from "@bosonprotocol/core-sdk";
import { createContext, useContext } from "react";
import { Signer } from "ethers";

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
  supportedChains: number[];
  externalConnectedChainId?: number;
  externalConnectedAccount?: string;
  externalConnectedSigner?: Signer;
  withExternalConnectionProps?: boolean;
};

export const ConfigContext = createContext<ConfigContextProps | null>(null);

export const useConfigContext = () => {
  const contextValue = useContext(ConfigContext);
  if (!contextValue) {
    throw new Error(
      "You need to use ConfigProvider before using useConfigContext"
    );
  }
  return contextValue;
};
