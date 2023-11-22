import { Provider } from "@bosonprotocol/ethers-sdk";
import { Web3LibAdapter } from "@bosonprotocol/common";

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

export function useSignerAddress2(web3Lib: Web3LibAdapter) {
  const [signerAddress, setSignerAddress] = useState<string | undefined>();

  useEffect(() => {
    if (web3Lib.getSignerAddress) {
      web3Lib
        .getSignerAddress()
        .then(setSignerAddress)
        .catch((e) => {
          console.error(e);
          setSignerAddress(undefined);
        });
    }

    return () => setSignerAddress(undefined);
  }, [web3Lib]);

  return signerAddress;
}
