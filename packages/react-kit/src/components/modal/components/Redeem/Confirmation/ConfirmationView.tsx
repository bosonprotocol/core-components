import React from "react";
import { Exchange } from "../../../../../types/exchange";
import Confirmation from "./Confirmation";

interface Props {
  onBackClick: () => void;
  onNextClick: () => void;
  exchange: Exchange | null;
}

export function ConfirmationView({
  onBackClick,
  onNextClick,
  exchange
}: Props) {
  if (!exchange) {
    return <p>Exchange could not be retrieved</p>;
  }
  const { offer } = exchange;
  const offerName = offer.metadata.name;
  const buyerId = exchange?.buyer.id || "";
  const sellerId = exchange?.seller.id || "";
  const sellerAddress = exchange?.seller.assistant || "";
  return (
    <Confirmation
      exchangeId={exchange.id}
      offerName={offerName}
      buyerId={buyerId}
      sellerId={sellerId}
      sellerAddress={sellerAddress}
      onBackClick={onBackClick}
      onSuccess={onNextClick}
    />
  );
}
