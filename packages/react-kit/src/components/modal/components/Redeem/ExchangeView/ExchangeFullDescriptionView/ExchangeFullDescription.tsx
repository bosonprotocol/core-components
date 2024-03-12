import React from "react";
import { Exchange } from "../../../../../../types/exchange";
import { OfferFullDescription } from "../../../common/OfferFullDescription/OfferFullDescription";
import { OnClickBuyOrSwapHandler } from "../../../common/detail/types";
import { UseGetOfferDetailDataProps } from "../../../common/detail/useGetOfferDetailData";

interface ExchangeFullDescriptionProps
  extends OnClickBuyOrSwapHandler,
    Pick<UseGetOfferDetailDataProps, "onExchangePolicyClick"> {
  exchange: Exchange;
}

export const ExchangeFullDescription: React.FC<
  ExchangeFullDescriptionProps
> = ({ exchange, onExchangePolicyClick, onClickBuyOrSwap }) => {
  const { offer } = exchange;
  return (
    <OfferFullDescription
      includeOverviewTab
      includeGeneralProductDataTab
      offer={offer}
      exchange={exchange}
      onExchangePolicyClick={onExchangePolicyClick}
      onClickBuyOrSwap={onClickBuyOrSwap}
    />
  );
};
