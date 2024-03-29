import React, { ReactNode, useState } from "react";
import { RedemptionContext, RedemptionContextProps } from "./RedemptionContext";

export function RedemptionProvider({
  children,
  ...rest
}: Omit<RedemptionContextProps, "setWidgetAction"> & { children: ReactNode }) {
  const [widgetAction, setWidgetAction] = useState(rest.widgetAction);
  return (
    <RedemptionContext.Provider
      value={{
        ...rest,
        widgetAction,
        setWidgetAction
      }}
    >
      {children}
    </RedemptionContext.Provider>
  );
}
