import React from "react";
import { Exchange } from "../../../../../../types/exchange";
import DetailTransactions from "../../../common/detail/DetailTransactions";
import { OfferFullDescription } from "../../../common/OfferFullDescription/OfferFullDescription";

interface ExchangeFullDescriptionProps {
  exchange: Exchange;
}

export const ExchangeFullDescription: React.FC<
  ExchangeFullDescriptionProps
> = ({ exchange }) => {
  const { offer } = exchange;
  const buyerAddress = exchange.buyer.wallet;

  return (
    <OfferFullDescription offer={offer}>
      <DetailTransactions
        title="Transaction History (this item)"
        exchange={exchange}
        offer={offer}
        buyerAddress={buyerAddress}
      />
    </OfferFullDescription>
  );
};
