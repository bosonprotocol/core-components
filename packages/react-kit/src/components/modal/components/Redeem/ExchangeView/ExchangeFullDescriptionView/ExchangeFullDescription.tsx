import React from "react";
import { Exchange } from "../../../../../../types/exchange";
import DetailTransactions from "../../../common/detail/DetailTransactions";
import { OfferFullDescription } from "../../../common/OfferFullDescription/OfferFullDescription";
import { OnClickBuyOrSwapHandler } from "../../../common/detail/types";

interface ExchangeFullDescriptionProps extends OnClickBuyOrSwapHandler {
  exchange: Exchange;
  onExchangePolicyClick: () => void;
}

export const ExchangeFullDescription: React.FC<
  ExchangeFullDescriptionProps
> = ({ exchange, onExchangePolicyClick, onClickBuyOrSwap }) => {
  const { offer } = exchange;
  const buyerAddress = exchange.buyer.wallet;

  return (
    <OfferFullDescription
      offer={offer}
      onExchangePolicyClick={onExchangePolicyClick}
      onClickBuyOrSwap={onClickBuyOrSwap}
    >
      <DetailTransactions
        title="Transaction History (this item)"
        exchange={exchange}
        offer={offer}
        buyerAddress={buyerAddress}
      />
    </OfferFullDescription>
  );
};
