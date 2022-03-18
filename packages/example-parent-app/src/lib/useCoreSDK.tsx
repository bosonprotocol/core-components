import { useEffect, useState } from "react";
import { CoreSDK } from "@bosonprotocol/core-sdk";
import { IpfsMetadata } from "@bosonprotocol/ipfs-storage";

export function useCoreSDK() {
  const [coreSDK, setCoreSDK] = useState<CoreSDK>();

  const chainId = 3;
  useEffect(() => {
    CoreSDK.fromDefaultConfig({
      chainId: chainId,
      web3Lib: {
        getChainId: () => Promise.resolve(chainId)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
      metadataStorage: new IpfsMetadata({
        url: "https://ipfs.infura.io:5001"
      }),
      theGraphStorage: IpfsMetadata.fromTheGraphIpfsUrl()
    })
      .then(setCoreSDK)
      .catch((e) => console.error("failed to init core-sdk", e));
  }, []);

  return coreSDK;
}
