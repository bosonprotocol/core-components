import { createContext, useContext } from "react";
import { FormType as RedeemFormType } from "../../../modal/components/Redeem/RedeemFormModel";
import {
  DeliveryInfoCallbackResponse,
  DeliveryInfoMessage,
  RedeemTransactionConfirmedCallbackResponse,
  RedeemTransactionConfirmedMessage,
  RedeemTransactionSubmittedCallbackResponse,
  RedeemTransactionSubmittedMessage
} from "../../../../hooks/callbacks/types";

export type RedemptionContextProps = {
  // If the deliveryInfo shall be sent to the seller via XMTP
  sendDeliveryInfoThroughXMTP: boolean;
  // A specific handler to transfer deliveryInfo (can be used to post message between frontend windows)
  deliveryInfoHandler?: (
    message: DeliveryInfoMessage,
    signature?: string
  ) => Promise<DeliveryInfoCallbackResponse>;
  // Url to POST the callback with deliveryInfo
  postDeliveryInfoUrl?: string;
  // Request headers to POST the postDeliveryInfoUrl callback
  postDeliveryInfoHeaders?: { [key: string]: string };
  // In case the redemption submission shall be handled in frontend
  redemptionSubmittedHandler?: (
    message: RedeemTransactionSubmittedMessage
  ) => Promise<RedeemTransactionSubmittedCallbackResponse>;
  // Url to POST the callback after a Redeem/Cancel transaction has been submitted, or an error if the submission failed
  postRedemptionSubmittedUrl?: string;
  // Request headers to POST the postRedemptionSubmittedUrl callback
  postRedemptionSubmittedHeaders?: { [key: string]: string };
  // In case the redemption confirmation shall be handled in frontend
  redemptionConfirmedHandler?: (
    message: RedeemTransactionConfirmedMessage
  ) => Promise<RedeemTransactionConfirmedCallbackResponse>;
  // Url to POST the callback after a Redeem/Cancel transaction has been confirmed, or an error if the confirmation failed
  postRedemptionConfirmedUrl?: string;
  // Request headers to POST the postRedemptionConfirmedUrl callback
  postRedemptionConfirmedHeaders?: { [key: string]: string };
  // Delivery information used as Redeem Form Initial value, or to be shown while confirming redemption
  deliveryInfo?: RedeemFormType;
};

export const RedemptionContext = createContext<
  RedemptionContextProps | undefined
>(undefined);

export const useRedemptionContext = () => {
  const contextValue = useContext(RedemptionContext);
  if (!contextValue) {
    throw new Error(
      "You need to use RedemptionProvider before using useRedemptionContext"
    );
  }
  return contextValue;
};
