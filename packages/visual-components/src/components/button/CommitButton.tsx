import { CoreSDK } from "@bosonprotocol/core-sdk";
import { EthersAdapter } from "@bosonprotocol/ethers-sdk";
import { providers } from "ethers";
import { useState } from "react";

import Button from "./button";
import { useMetaTxHandlerContract } from "../../lib/meta-transactions/useMetaTxHandlerContract";
import { hooks } from "../../lib/connectors/metamask";
import { useCoreSDK } from "../../lib/useCoreSDK";

interface CommitButtonProps {
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
  onSuccess: ({
    offerId,
    txHash,
    exchangeId
  }: {
    offerId: string;
    txHash: string;
    exchangeId: string | null;
  }) => void;
  onError: ({ offerId, message }: { offerId: string; message: string }) => void;
}

const CommitButton = ({
  offerId,
  web3Provider,
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
      onClick={async () => {
        console.log("on button click");

        const coreSDK = CoreSDK.fromDefaultConfig({
          web3Lib: new EthersAdapter(web3Provider),
          chainId: chainId
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
          onError({ offerId, message: "error commiting the item" });
        }
      }}
    >
      Commit
    </Button>
  );
};

export default CommitButton;
