import React, { ReactNode } from "react";
import { Context, ConfigProviderProps } from "./ConfigContext";

type Props = ConfigProviderProps & {
  children: ReactNode;
};
export function ConfigProvider({ children, ...rest }: Props) {
  return <Context.Provider value={rest}>{children}</Context.Provider>;
}
