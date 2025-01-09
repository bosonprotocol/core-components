import React, { ReactNode } from "react";
import { RedemptionContext, RedemptionContextProps } from "./RedemptionContext";
export type RedemptionProviderProps = RedemptionContextProps & {
  children: ReactNode;
};
export function RedemptionProvider({
  children,
  ...rest
}: RedemptionProviderProps) {
  return (
    <RedemptionContext.Provider value={rest}>
      {children}
    </RedemptionContext.Provider>
  );
}
