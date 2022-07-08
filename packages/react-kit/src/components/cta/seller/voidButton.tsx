import { CoreSDK, getDefaultConfig } from "@bosonprotocol/core-sdk";
import { EthersAdapter } from "@bosonprotocol/ethers-sdk";
import { providers } from "ethers";
import React, { useState } from "react";

import Button from "../../button/button";
import { useMetaTxHandlerContract } from "../../../lib/meta-transactions/useMetaTxHandlerContract";
import { hooks } from "../../../lib/connectors/metamask";

interface VoidButtonProps {
  offerId: string;
  web3Provider: providers.Web3Provider;
  chainId: number;
  subgraphUrl?: string;
  protocolDiamond?: string;
  metaTransactionApiKey?: string;
  theGraphStorage?: string;
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
  metaTransactionApiKey,
  onPending,
  onSuccess,
  onError
}: VoidButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Button
      variant="primary"
      onClick={async () => {
        // set default config for chaind Id
        const defaultConfig = getDefaultConfig({
          chainId
        });
        const coreSDK = new CoreSDK({
          web3Lib: new EthersAdapter(web3Provider),
          subgraphUrl: subgraphUrl || defaultConfig.subgraphUrl,
          protocolDiamond:
            protocolDiamond || defaultConfig.contracts.protocolDiamond
        });
        try {
          setIsLoading(true);
          onPending({ offerId, isLoading });

          const txResponse = await coreSDK.voidOffer(offerId);

          await txResponse.wait(1);
          const txHash = txResponse.hash;
          onSuccess({ offerId, txHash });

          setIsLoading(false);
          onPending({ offerId, isLoading });
        } catch (error) {
          setIsLoading(false);
          onPending({ offerId, isLoading });
          onError({
            offerId,
            message: `error voiding the offer ${offerId}`,
            error
          });
        }
      }}
    >
      Void Offer {offerId}
    </Button>
  );
};

export default VoidButton;
