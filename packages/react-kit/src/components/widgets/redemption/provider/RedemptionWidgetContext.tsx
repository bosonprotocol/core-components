import { subgraph } from "@bosonprotocol/core-sdk";
import { createContext, useContext } from "react";

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

export type RedemptionWidgetContextProps = {
  // if the Overview (step #1) shall be shown
  showRedemptionOverview: boolean;
  // action that shall be presented to the user when the widget shows up
  widgetAction: RedemptionWidgetAction;
  // allow to change the widgetAction property from the code
  setWidgetAction: (widgetAction: RedemptionWidgetAction) => void;
  // default state of exchanges shown in My Items view
  exchangeState: subgraph.ExchangeState;
};

export const RedemptionWidgetContext = createContext<
  RedemptionWidgetContextProps | undefined
>(undefined);

export const useRedemptionWidgetContext = () => {
  const contextValue = useContext(RedemptionWidgetContext);
  if (!contextValue) {
    throw new Error(
      "You need to use RedemptionWidgetProvider before using useRedemptionWidgetContext"
    );
  }
  return contextValue;
};
