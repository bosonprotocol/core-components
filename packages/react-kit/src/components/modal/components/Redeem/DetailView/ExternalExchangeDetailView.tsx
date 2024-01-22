import React from "react";
import {
  RedemptionWidgetProviders,
  RedemptionWidgetProvidersProps
} from "../../../../widgets/redemption/RedemptionWidgetProviders";
import {
  ExchangeDetailViewWithProvider,
  ExchangeDetailViewWithProviderProps
} from "./ExchangeDetailViewWithProvider";

export type ExternalExchangeDetailViewProps =
  ExchangeDetailViewWithProviderProps & {
    providerProps: Omit<RedemptionWidgetProvidersProps, "children">;
  };

export const ExternalExchangeDetailView: React.FC<
  ExternalExchangeDetailViewProps
> = (props) => {
  return (
    <RedemptionWidgetProviders {...props.providerProps}>
      <ExchangeDetailViewWithProvider {...props} />
    </RedemptionWidgetProviders>
  );
};
