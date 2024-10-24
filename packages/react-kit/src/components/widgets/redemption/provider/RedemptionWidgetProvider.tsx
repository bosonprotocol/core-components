import React, { ReactNode, useState } from "react";
import {
  RedemptionWidgetContext,
  RedemptionWidgetContextProps
} from "./RedemptionWidgetContext";

export type RedemptionWidgetProviderProps = Omit<
  RedemptionWidgetContextProps,
  "setWidgetAction"
> & {
  children: ReactNode;
};
export function RedemptionWidgetProvider({
  children,
  ...rest
}: RedemptionWidgetProviderProps) {
  const [widgetAction, setWidgetAction] = useState(rest.widgetAction);
  return (
    <RedemptionWidgetContext.Provider
      value={{
        ...rest,
        widgetAction,
        setWidgetAction
      }}
    >
      {children}
    </RedemptionWidgetContext.Provider>
  );
}
