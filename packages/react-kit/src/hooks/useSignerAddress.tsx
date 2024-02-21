import { Web3LibAdapter } from "@bosonprotocol/common";

import { useEffect, useState } from "react";

export function useSignerAddress(web3Lib: Web3LibAdapter | undefined) {
  const [signerAddress, setSignerAddress] = useState<string | undefined>();
  const [signerContract, setSignerContract] = useState<boolean>(false);

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
      web3Lib
        .isSignerContract()
        .then((isSignerContract) => {
          setSignerContract(isSignerContract);
        })
        .catch((e) => {
          console.error(e);
          setSignerContract(false);
        });
    }

    return () => setSignerAddress(undefined);
  }, [web3Lib]);

  return { signerAddress, signerContract };
}
