import { Provider } from "@bosonprotocol/ethers-sdk";
import { useEffect, useState } from "react";

export function useSignerAddress(providerFromConfig?: Provider) {
  const [signerAddress, setSignerAddress] = useState<string | undefined>();

  useEffect(() => {
    if (
      providerFromConfig &&
      providerFromConfig.getSigner &&
      providerFromConfig.getSigner()
    ) {
      providerFromConfig
        .getSigner()
        .getAddress()
        .then(setSignerAddress)
        .catch((e) => {
          console.error(e);
          setSignerAddress(undefined);
        });
    }

    return () => setSignerAddress(undefined);
  }, [providerFromConfig]);

  return signerAddress;
}
