import { getAddress } from "ethers/lib/utils";
import React, { useEffect } from "react";
import { Exchange } from "../../../../../types/exchange";
import { Confirmation, ConfirmationProps } from "./Confirmation";
import { NonModalProps, useNonModalContext } from "../../../nonModal/NonModal";
import { colors, getCssVar } from "../../../../../theme";
import { RedeemHeader } from "../RedeemHeader";
import { useAccount } from "../../../../../hooks/connection/connection";
import {
  RedemptionWidgetAction,
  useRedemptionWidgetContext
} from "../../../../widgets/redemption/provider/RedemptionWidgetContext";

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
  const { dispatch } = useNonModalContext();
  const { address } = useAccount();
  useEffect(() => {
    dispatch({
      payload: {
        headerComponent: RedeemHeader,
        contentStyle: {
          background: getCssVar("--background-accent-color")
        }
      }
    });
  }, [dispatch]);
  const { widgetAction, setWidgetAction } = useRedemptionWidgetContext();
  const isConfirm = widgetAction === RedemptionWidgetAction.CONFIRM_REDEEM;
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
          redemptionInfoAcceptedInitial={isConfirm}
          resumeRedemptionInitial={isConfirm}
          onBackClick={() => {
            if (isConfirm) {
              // As the redemption will be edited again, switch the widgetAction to REDEEM_FORM
              setWidgetAction(RedemptionWidgetAction.REDEEM_FORM);
            }
            onBackClick();
          }}
          onSuccess={onSuccess}
          hideModal={hideModal}
        />
      )}
    </>
  );
}
