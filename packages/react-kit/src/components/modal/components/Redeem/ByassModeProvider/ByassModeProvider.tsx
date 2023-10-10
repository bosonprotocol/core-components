import React, { ReactNode, createContext, useContext } from "react";
import { RedemptionBypassMode } from "./const";

const Context = createContext<RedemptionBypassMode | undefined>(undefined);

type BypassModeProviderProps = {
  children: ReactNode;
  bypassMode: RedemptionBypassMode | undefined;
};
export const BypassModeProvider = ({
  children,
  bypassMode
}: BypassModeProviderProps) => {
  return <Context.Provider value={bypassMode}>{children}</Context.Provider>;
};

export const useBypassMode = () => {
  const context = useContext(Context);
  return context;
};
