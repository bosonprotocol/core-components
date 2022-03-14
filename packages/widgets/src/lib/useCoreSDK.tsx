import { useEffect, useState } from "react";
import { CoreSDK } from "@bosonprotocol/core-sdk";
import { EthersAdapter } from "@bosonprotocol/ethers-sdk";
import { IpfsMetadata } from "@bosonprotocol/ipfs-storage";
import { hooks } from "./connectors/metamask";

export function useCoreSDK() {
  const [coreSDK, setCoreSDK] = useState<CoreSDK>();
  const provider = hooks.useProvider();

  useEffect(() => {
    if (!provider) return;

    CoreSDK.fromDefaultConfig({
      chainId: 3,
      web3Lib: new EthersAdapter(provider),
      metadataStorage: new IpfsMetadata({
        url: "https://ipfs.infura.io:5001"
      }),
      theGraphStorage: IpfsMetadata.fromTheGraphIpfsUrl()
    })
      .then(setCoreSDK)
      .catch((e) => console.error("failed to init core-sdk", e));
  }, [provider]);

  return coreSDK;
}
