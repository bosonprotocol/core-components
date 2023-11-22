import React, { createContext, ReactNode } from "react";
import { Web3LibAdapter } from "@bosonprotocol/common";

export const SignerContext = createContext<Web3LibAdapter | undefined>(
  undefined
);

type SignerProviderProps = {
  children: ReactNode;
  externalSigner: Web3LibAdapter | undefined;
};
export const SignerProvider = ({
  children,
  externalSigner
}: SignerProviderProps) => {
  return (
    <SignerContext.Provider value={externalSigner}>
      {children}
    </SignerContext.Provider>
  );
};
