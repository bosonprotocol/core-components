import React, { ReactNode } from "react";
import { RedemptionContext, RedemptionContextProps } from "./RedemptionContext";

export function RedemptionProvider({
  children,
  ...rest
}: RedemptionContextProps & { children: ReactNode }) {
  return (
    <RedemptionContext.Provider
      value={{
        ...rest
      }}
    >
      {children}
    </RedemptionContext.Provider>
  );
}
