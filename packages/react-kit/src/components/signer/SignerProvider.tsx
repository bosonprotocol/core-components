import React, { ReactNode } from "react";
import { useProvideExternalSigner } from "../../lib/signer/externalSigner";
import { SignerContext } from "./SignerContext";

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
