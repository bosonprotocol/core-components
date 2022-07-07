import { CoreSDK, getDefaultConfig } from "@bosonprotocol/core-sdk";
import { EthersAdapter } from "@bosonprotocol/ethers-sdk";
import { providers } from "ethers";
import React, { useState } from "react";

import Button from "../button/button";

interface VoidButtonProps {
  offerId: string;
  web3Provider?: providers.Web3Provider;
  chainId: number;
  subgraphUrl?: string;
  protocolDiamond?: string;
  onPending: ({
    offerId,
    isLoading
  }: {
    offerId: string;
    isLoading: boolean;
  }) => void;
  onSuccess: ({ offerId, txHash }: { offerId: string; txHash: string }) => void;
  onError: ({
    offerId,
    message,
    error
  }: {
    offerId: string;
    message: string;
    error: unknown;
  }) => void;
}

const VoidButton = ({
  offerId,
  web3Provider,
  chainId,
  subgraphUrl,
  protocolDiamond,
  onPending,
  onSuccess,
  onError
}: VoidButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Button
      variant="primary"
      onClick={async () => {
        // connect to wallet

        try {
          setIsLoading(true);

          let localWeb3Provider = web3Provider;
          if (!web3Provider && window.ethereum) {
            const provider = new providers.Web3Provider(window.ethereum);
            localWeb3Provider = provider;
          }
          if (!localWeb3Provider) {
            return;
          }

          // set default config for chaind Id
          const defaultConfig = getDefaultConfig({
            chainId
          });
          const coreSDK = new CoreSDK({
            web3Lib: new EthersAdapter(localWeb3Provider),
            subgraphUrl: subgraphUrl || defaultConfig.subgraphUrl,
            protocolDiamond:
              protocolDiamond || defaultConfig.contracts.protocolDiamond
          });

          const txResponse = await coreSDK.voidOffer(offerId);

          await txResponse.wait(1);
          const txHash = txResponse.hash;
          onSuccess({ offerId, txHash });

          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
          onPending({ offerId, isLoading });
          onError({ offerId, message: "error commiting the item", error });
        }
      }}
    >
      Void Offer {offerId}
    </Button>
  );
};

export default VoidButton;
