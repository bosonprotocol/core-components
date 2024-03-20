import { Web3LibAdapter } from "@bosonprotocol/common";

import { useQuery } from "react-query";

export function useSignerAddress(web3Lib: Web3LibAdapter | undefined) {
  const { data: signerAddress } = useQuery(
    ["useSignerAddress-signerAddress", web3Lib?.uuid],
    () => {
      return web3Lib?.getSignerAddress();
    },
    {
      enabled: !!web3Lib?.getSignerAddress
    }
  );
  const { data: signerContract } = useQuery(
    ["useSignerAddress-signerContract", web3Lib?.uuid],
    () => {
      return web3Lib?.isSignerContract();
    },
    {
      enabled: !!web3Lib?.getSignerAddress
    }
  );

  return { signerAddress, signerContract };
}
