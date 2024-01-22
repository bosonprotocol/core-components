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
  InnerDetailWithProviderExchangeProps &
    Omit<DetailViewWithProviderProps, "offer">;

export const ExchangeDetailViewWithProvider: React.FC<
  ExchangeDetailViewWithProviderProps
> = (props) => {
  return (
    <DetailViewWithProvider {...props} offer={props.selectedVariant.offer}>
      <InnerDetailWithProviderExchange {...props} />
    </DetailViewWithProvider>
  );
};
