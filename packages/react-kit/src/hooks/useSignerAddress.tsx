import { Web3LibAdapter } from "@bosonprotocol/common";

import { useEffect, useState } from "react";

export function useSignerAddress(web3Lib: Web3LibAdapter | undefined) {
  const [signerAddress, setSignerAddress] = useState<string | undefined>();

  useEffect(() => {
    if (web3Lib?.getSignerAddress) {
      web3Lib
        .getSignerAddress()
        .then((address) => {
          setSignerAddress(address);
        })
        .catch((e) => {
          console.error(e);
          setSignerAddress(undefined);
        });
    }

    return () => setSignerAddress(undefined);
  }, [web3Lib]);

  return signerAddress;
}
