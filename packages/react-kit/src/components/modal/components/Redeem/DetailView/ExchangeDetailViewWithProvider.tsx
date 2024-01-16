import React from "react";
import {
  DetailViewWithProvider,
  DetailViewWithProviderProps
} from "../../common/detail/DetailViewWithProvider";
import {
  InnerDetailWithProviderExchange,
  InnerDetailWithProviderExchangeProps
} from "./InnerDetailWithProviderExchange";

export type ExchangeDetailViewWithProviderProps =
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
