import { CoreSDK, getDefaultConfig } from "@bosonprotocol/core-sdk";
import { EthersAdapter } from "@bosonprotocol/ethers-sdk";
import React, { useState } from "react";

import Button from "./button";
import { useMetaTxHandlerContract } from "../../lib/meta-transactions/useMetaTxHandlerContract";
import { hooks } from "../../lib/connectors/metamask";
import getWeb3Provider from "../../lib/getWeb3Provider";

interface CommitButtonProps {
  offerId: string;
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
  onSuccess: ({
    offerId,
    txHash,
    exchangeId
  }: {
    offerId: string;
    txHash: string;
    exchangeId: string | null;
  }) => void;
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

const CommitButton = ({
  offerId,
  chainId,
  subgraphUrl,
  protocolDiamond,
  metaTransactionApiKey,
  onPending,
  onSuccess,
  onError
}: CommitButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const metaTxContract = useMetaTxHandlerContract();
  const account = hooks.useAccount();

  return (
    <Button
      variant="primary"
      loading={isLoading}
      onClick={async () => {
        const localWeb3Provider = await getWeb3Provider();

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
        try {
          setIsLoading(true);
          onPending({ offerId, isLoading });
          let txResponse;
          if (metaTransactionApiKey && metaTxContract && account) {
            const nonce = Date.now();
            const { r, s, v } = await coreSDK.signExecuteMetaTxCommitToOffer({
              chainId,
              offerId,
              nonce
            });
            txResponse = await metaTxContract.executeMetaTxCommitToOffer(
              account,
              { buyer: account, offerId },
              nonce,
              r,
              s,
              v
            );
          } else {
            txResponse = await coreSDK.commitToOffer(offerId);
          }
          const txReceipt = await txResponse.wait(1);
          const txHash = txResponse.hash;
          const exchangeId = coreSDK.getCommittedExchangeIdFromLogs(
            txReceipt.logs
          );
          onSuccess({ offerId, txHash, exchangeId });
          setIsLoading(false);
          onPending({ offerId, isLoading });
        } catch (error) {
          setIsLoading(false);
          onPending({ offerId, isLoading });
          onError({ offerId, message: "error commiting the item", error });
        }
      }}
    >
      Commit
    </Button>
  );
};

export default CommitButton;
