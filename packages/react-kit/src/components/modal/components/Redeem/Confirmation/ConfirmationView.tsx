import { getAddress } from "ethers/lib/utils";
import React from "react";
import { Exchange } from "../../../../../types/exchange";
import Confirmation, { ConfirmationProps } from "./Confirmation";
import NonModal, { NonModalProps } from "../../../NonModal";
import Grid from "../../../../ui/Grid";
import Typography from "../../../../ui/Typography";
import ConnectButton from "../../../../wallet/ConnectButton";
import { BosonFooter } from "../BosonFooter";

export interface ConfirmationViewProps {
  onBackClick: ConfirmationProps["onBackClick"];
  onSuccess: ConfirmationProps["onSuccess"];
  exchange: Exchange | null;
  nonModalProps: Partial<NonModalProps>;
}

export function ConfirmationView({
  onBackClick,
  onSuccess,
  exchange,
  nonModalProps
}: ConfirmationViewProps) {
  const offerId = exchange?.offer?.id;
  const offerName = exchange?.offer?.metadata?.name;
  const buyerId = exchange?.buyer.id || "";
  const sellerId = exchange?.seller.id || "";
  const sellerAddress = exchange?.seller?.assistant
    ? getAddress(exchange.seller.assistant)
    : "";
  return (
    <NonModal
      props={{
        ...nonModalProps,
        headerComponent: <Typography tag="h3">Redeem your item</Typography>,
        footerComponent: <BosonFooter />
      }}
    >
      {exchange ? (
        <Confirmation
          exchangeId={exchange.id}
          offerId={offerId as string}
          offerName={offerName as string}
          buyerId={buyerId}
          sellerId={sellerId}
          sellerAddress={sellerAddress}
          onBackClick={onBackClick}
          onSuccess={onSuccess}
        />
      ) : (
        <p>Exchange could not be retrieved</p>
      )}
    </NonModal>
  );
}
