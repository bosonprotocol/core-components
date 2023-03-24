import React, { ReactNode } from "react";
import { Context } from "./IpfsContext";

export type IpfsProviderProps = NonNullable<
  Parameters<typeof Context["Provider"]>[0]["value"]
>;
type Props = IpfsProviderProps & {
  children: ReactNode;
};
export function IpfsProvider({ children, ...rest }: Props) {
  return <Context.Provider value={{ ...rest }}>{children}</Context.Provider>;
}
