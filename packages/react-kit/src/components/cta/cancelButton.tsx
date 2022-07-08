import { providers } from "ethers";
import { CoreSDK, getDefaultConfig } from "@bosonprotocol/core-sdk";

import Button from "../button/button";
import React, { useState } from "react";
import { EthersAdapter } from "@bosonprotocol/ethers-sdk";
import { hooks } from "../../lib/connectors/metamask";
import { useMetaTxHandlerContract } from "../../lib/meta-transactions/useMetaTxHandlerContract";

interface CancelButtonProps {
  exchangeId: string;
  chainId: number;
  subgraphUrl?: string;
  protocolDiamond?: string;
  metaTransactionApiKey?: string;
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

const CancelButton = ({
  exchangeId,
  chainId,
  subgraphUrl,
  protocolDiamond,
  metaTransactionApiKey,
  onPending,
  onSuccess,
  onError
}: CancelButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const metaTxContract = useMetaTxHandlerContract();

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

          const account = hooks.useAccount();

          let txResponse;

          if (metaTransactionApiKey && metaTxContract && account) {
            const nonce = Date.now();

            const { r, s, v } = await coreSDK.signExecuteMetaTxCancelVoucher({
              chainId,
              exchangeId,
              nonce
            });

            txResponse = await metaTxContract.executeMetaTxCancelVoucher(
              account,
              {
                exchangeId
              },
              nonce,
              r,
              s,
              v
            );
          } else {
            txResponse = await coreSDK.cancelVoucher(exchangeId);
          }

          await txResponse.wait(1);
          setIsLoading(false);
          onSuccess({ exchangeId, txHash: txResponse.hash });

          onPending({ exchangeId, isLoading });
        } catch (error) {
          setIsLoading(false);
          onPending({ exchangeId, isLoading });
          onError({ exchangeId, message: "error canceling the item", error });
        }
      }}
    >
      Cancel Exchange {exchangeId}
    </Button>
  );
};

export default CancelButton;
