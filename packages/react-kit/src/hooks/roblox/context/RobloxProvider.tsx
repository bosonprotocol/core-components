import { RobloxContext } from "./RobloxContext";
import React from "react";

export type RobloxProviderProps = {
  children: React.ReactNode;
  backendOrigin: string;
};
export const RobloxProvider: React.FC<RobloxProviderProps> = ({
  children,
  backendOrigin
}) => {
  return (
    <RobloxContext.Provider value={{ backendOrigin }}>
      {children}
    </RobloxContext.Provider>
  );
};
