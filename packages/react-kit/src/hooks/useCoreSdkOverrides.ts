import { useMemo } from "react";
import { useExternalSigner } from "../components/signer/useExternalSigner";
import { CoreSdkConfig, useCoreSdk } from "./useCoreSdk";

export const useCoreSdkOverrides = ({
  coreSdkConfig
}: {
  coreSdkConfig: CoreSdkConfig;
}) => {
  const externalSigner = useExternalSigner();
  const overrides = useMemo(() => {
    return externalSigner ? { web3Lib: externalSigner.externalWeb3LibAdapter } : undefined;
  }, [externalSigner]);
  const coreSdk = useCoreSdk(coreSdkConfig, overrides);
  return coreSdk;
};
