import { getAddress } from "ethers/lib/utils";
import React from "react";
import { Exchange } from "../../../../../types/exchange";
import Confirmation, { ConfirmationProps } from "./Confirmation";
import NonModal from "../../../NonModal";
import Grid from "../../../../ui/Grid";
import Typography from "../../../../ui/Typography";
import ConnectButton from "../../../../wallet/ConnectButton";
import { BosonFooter } from "../BosonFooter";

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
    <NonModal
      props={{
        headerComponent: (
          <Grid>
            <Typography tag="h3">Redeem your item</Typography>
            <ConnectButton showChangeWallet />
          </Grid>
        ),
        footerComponent: <BosonFooter />
      }}
    >
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
    </NonModal>
  );
}
