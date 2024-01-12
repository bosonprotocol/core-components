import React from "react";
import {
  DetailViewWithProvider,
  DetailViewWithProviderProps
} from "./DetailViewWithProvider";
import {
  InnerDetailWithProviderExchange,
  InnerDetailWithProviderExchangeProps
} from "./InnerDetailWithProviderExchange";

type ExchangeDetailViewWithProviderProps =
  InnerDetailWithProviderExchangeProps & DetailViewWithProviderProps;

export const ExchangeDetailViewWithProvider: React.FC<
  ExchangeDetailViewWithProviderProps
> = (props) => {
  return (
    <DetailViewWithProvider {...props}>
      <InnerDetailWithProviderExchange {...props} />
    </DetailViewWithProvider>
  );
};
