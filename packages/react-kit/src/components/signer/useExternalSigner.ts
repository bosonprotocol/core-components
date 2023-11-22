import { useContext } from "react";
import { SignerContext } from "./SignerContext";

export const useExternalSigner = () => {
  const context = useContext(SignerContext);
  return context;
};
