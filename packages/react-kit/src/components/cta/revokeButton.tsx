import { providers } from "ethers";
import { CoreSDK, getDefaultConfig } from "@bosonprotocol/core-sdk";

import Button from "../button/button";
import React, { useState } from "react";
import { EthersAdapter } from "@bosonprotocol/ethers-sdk";

interface RevokeButtonProps {
  exchangeId: string;
  chainId: number;
  subgraphUrl?: string;
  protocolDiamond?: string;
  onPending: ({
    exchangeId,
    isLoading
  }: {
    exchangeId: string;
    isLoading: boolean;
  }) => void;
  onSuccess: ({
    exchangeId,
    txHash
  }: {
    exchangeId: string;
    txHash: string;
  }) => void;
  onError: ({
    exchangeId,
    message,
    error
  }: {
    exchangeId: string;
    message: string;
    error: unknown;
  }) => void;
}

const RevokeButton = ({
  exchangeId,
  chainId,
  subgraphUrl,
  protocolDiamond,
  onPending,
  onSuccess,
  onError
}: RevokeButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <Button
      variant="primary"
      onClick={async () => {
        try {
          // connect to wallet
          let localWeb3Provider;
          if (window.ethereum) {
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

          setIsLoading(true);
          onPending({ exchangeId, isLoading });

          const txResponse = await coreSDK.revokeVoucher(exchangeId);
          await txResponse.wait(1);

          setIsLoading(false);
          onPending({ exchangeId, isLoading });
          onSuccess({ exchangeId, txHash: txResponse.hash });
        } catch (error) {
          setIsLoading(false);
          onPending({ exchangeId, isLoading });
          onError({ exchangeId, message: "error revoking the item", error });
        }
      }}
    >
      Revoke Exchange {exchangeId}
    </Button>
  );
};

export default RevokeButton;
