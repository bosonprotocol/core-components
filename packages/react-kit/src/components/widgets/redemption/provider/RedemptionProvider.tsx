import React, { ReactNode } from "react";
import { Context, RedemptionContextProps } from "./RedemptionContext";

export function RedemptionProvider({
  children,
  ...rest
}: RedemptionContextProps & { children: ReactNode }) {
  return (
    <Context.Provider
      value={{
        ...rest
      }}
    >
      {children}
    </Context.Provider>
  );
}
