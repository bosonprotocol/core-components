import { getAddress } from "ethers/lib/utils";
import React from "react";
import { Exchange } from "../../../../../types/exchange";
import Confirmation, { ConfirmationProps } from "./Confirmation";

export interface ConfirmationViewProps {
  onBackClick: ConfirmationProps["onBackClick"];
  onSuccess: ConfirmationProps["onSuccess"];
  exchange: Exchange | null;
}

export function ConfirmationView({
  onBackClick,
  onSuccess,
  exchange
}: ConfirmationViewProps) {
  if (!exchange) {
    return <p>Exchange could not be retrieved</p>;
  }
  const { offer } = exchange;
  const offerId = offer.id;
  const offerName = offer.metadata.name;
  const buyerId = exchange?.buyer.id || "";
  const sellerId = exchange?.seller.id || "";
  const sellerAddress = getAddress(exchange?.seller.assistant) || "";
  return (
    <Confirmation
      exchangeId={exchange.id}
      offerId={offerId}
      offerName={offerName}
      buyerId={buyerId}
      sellerId={sellerId}
      sellerAddress={sellerAddress}
      onBackClick={onBackClick}
      onSuccess={onSuccess}
    />
  );
}
