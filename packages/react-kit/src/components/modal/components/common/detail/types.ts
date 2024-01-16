import { offers } from "@bosonprotocol/core-sdk";
import { ReactNode } from "react";
import { VariantV1 } from "../../../../../types/variants";
import { Exchange } from "../../../../../types/exchange";

export type DetailViewProps = OnClickBuyOrSwapHandler & {
  selectedVariant: VariantV1;
  exchange?: Exchange;
  // allVariants: VariantV1[];
  // disableVariationsSelects?: boolean;
  priceSibling?: ReactNode;
  children: ReactNode;
  topChildren?: ReactNode;
  bottomChildren?: ReactNode;
  showPriceAsterisk: boolean;
  showBosonLogo: boolean;
  // onLicenseAgreementClick: () => void;
  onExchangePolicyClick: (args: {
    exchangePolicyCheckResult: offers.CheckExchangePolicyResult | undefined;
  }) => void;
  // onCommit: (exchangeId: string, txHash: string) => void;
  // onCommitting: (txHash: string) => void;
  onPurchaseOverview: () => void;
  // exchangePolicyCheckResult?: offers.CheckExchangePolicyResult;
};

export type OnClickBuyOrSwapHandler = {
  onClickBuyOrSwap?: (arg0: {
    swapParams: {
      outputCurrency: string;
      exactAmount: string;
      exactField: string;
    };
  }) => void;
};
