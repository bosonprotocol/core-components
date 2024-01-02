import React, { createContext, ReactNode } from "react";
import { Web3LibAdapter } from "@bosonprotocol/common";
import { useProvideExternalSigner } from "../../lib/signer/externalSigner";
import { Signer } from "ethers";

export const SignerContext = createContext<
  { externalWeb3LibAdapter: Web3LibAdapter; externalSigner: Signer } | undefined
>(undefined);

type SignerProviderProps = {
  children: ReactNode;
  parentOrigin: string | null | undefined;
  withExternalSigner: boolean | null | undefined;
};
export const SignerProvider = ({
  children,
  parentOrigin,
  withExternalSigner
}: SignerProviderProps) => {
  const externalSignerListenerObject = useProvideExternalSigner({
    parentOrigin,
    withExternalSigner
  });
  return (
    <SignerContext.Provider value={externalSignerListenerObject}>
      {children}
    </SignerContext.Provider>
  );
};
