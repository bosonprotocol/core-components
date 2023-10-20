import { subgraph } from "@bosonprotocol/core-sdk";
import { createContext, useContext } from "react";
import { FormType as RedeemFormType } from "../../../modal/components/Redeem/RedeemFormModel";

export enum RedemptionWidgetAction {
  // The widget will ask the user to select an Exchange (My Items view)
  SELECT_EXCHANGE = "SELECT_EXCHANGE",
  // The widget will directly show the details of a given exchange
  EXCHANGE_DETAILS = "EXCHANGE_DETAILS",
  // The widget will directly show the redeem form of a given exchange
  REDEEM_FORM = "REDEEM_FORM",
  // The widget will directly show the cancellation form of a given exchange
  CANCEL_FORM = "CANCEL_FORM",
  // The widget will directly show the redeem confirmation view for of a given exchange
  CONFIRM_REDEEM = "CONFIRM_REDEEM"
}

export type RedemptionContextProps = {
  // if the Overview (step #1) shall be shown
  showRedemptionOverview: boolean;
  // action that shall be presented to the user when the widget shows up
  widgetAction: RedemptionWidgetAction;
  // allow to change the widgetAction property from the code
  setWidgetAction: (widgetAction: RedemptionWidgetAction) => void;
  // default state of exchanges shown in My Items view
  exchangeState: subgraph.ExchangeState;
  // Url to POST the callback with deliveryInfo
  postDeliveryInfoUrl?: string;
  // Request headers to POST the postDeliveryInfoUrl callback
  postDeliveryInfoHeaders?: { [key: string]: string };
  // Url to POST the callback after a Redeem/Cancel transaction has been submitted, or an error if the submission failed
  postRedemptionSubmittedUrl?: string;
  // Request headers to POST the postRedemptionSubmittedUrl callback
  postRedemptionSubmittedHeaders?: { [key: string]: string };
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
