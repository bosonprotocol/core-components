import { getAddress } from "ethers/lib/utils";
import React, { useEffect } from "react";
import { Exchange } from "../../../../../types/exchange";
import Confirmation, { ConfirmationProps } from "./Confirmation";
import { NonModalProps, useNonModalContext } from "../../../nonModal/NonModal";
import Typography from "../../../../ui/Typography";
import { theme } from "../../../../../theme";
import { useAccount } from "wagmi";

const colors = theme.colors.light;

export interface ConfirmationViewProps {
  onBackClick: ConfirmationProps["onBackClick"];
  onSuccess: ConfirmationProps["onSuccess"];
  exchange: Exchange | null;
  hideModal?: NonModalProps["hideModal"];
}

export function ConfirmationView({
  onBackClick,
  onSuccess,
  exchange,
  hideModal
}: ConfirmationViewProps) {
  const offerId = exchange?.offer?.id;
  const offerName = exchange?.offer?.metadata?.name;
  const buyerId = exchange?.buyer.id || "";
  const sellerId = exchange?.seller.id || "";
  const sellerAddress = exchange?.seller?.assistant
    ? getAddress(exchange.seller.assistant)
    : "";
  const dispatch = useNonModalContext();
  const { address } = useAccount();
  useEffect(() => {
    dispatch({
      payload: {
        headerComponent: (
          <Typography tag="h3" $width="100%">
            Redeem your item
          </Typography>
        ),
        contentStyle: {
          background: colors.white
        }
      }
    });
  }, [dispatch]);
  return (
    <>
      {!exchange ? (
        <p>Exchange could not be retrieved.</p>
      ) : exchange.buyer?.wallet?.toLowerCase() !== address?.toLowerCase() ? (
        <p>You do not own this exchange.</p>
      ) : exchange.state !== "COMMITTED" ? (
        <p>Invalid exchange state.</p>
      ) : (
        <Confirmation
          exchangeId={exchange.id}
          offerId={offerId as string}
          offerName={offerName as string}
          buyerId={buyerId}
          sellerId={sellerId}
          sellerAddress={sellerAddress}
          onBackClick={onBackClick}
          onSuccess={onSuccess}
          hideModal={hideModal}
        />
      )}
    </>
  );
}
