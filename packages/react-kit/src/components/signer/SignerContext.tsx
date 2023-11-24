import React, { createContext, ReactNode } from "react";
import { Web3LibAdapter } from "@bosonprotocol/common";
import { useProvideExternalSigner } from "../../lib/signer/externalSigner";

export const SignerContext = createContext<Web3LibAdapter | undefined>(
  undefined
);

type SignerProviderProps = {
  children: ReactNode;
  parentOrigin: `http${string}` | null | undefined;
};
export const SignerProvider = ({
  children,
  parentOrigin
}: SignerProviderProps) => {
  const externalSigner = useProvideExternalSigner({
    parentOrigin
  });
  return (
    <SignerContext.Provider value={externalSigner}>
      {children}
    </SignerContext.Provider>
  );
};
