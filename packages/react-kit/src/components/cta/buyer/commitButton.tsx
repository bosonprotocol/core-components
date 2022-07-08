import React from "react";

import Button from "../../buttons/Button";
import { useMetaTxHandlerContract } from "../../../hooks/meta-tx/useMetaTxHandlerContract";
import { useCoreSdk, CoreSdkConfig } from "../../../hooks/useCoreSdk";
import { useSignerAddress } from "../../../hooks/useSignerAddress";

type CommitButtonProps = CoreSdkConfig & {
  offerId: string;
  metaTransactionsApiKey?: string;
  disabled?: boolean;
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
};

const CommitButton = ({
  offerId,
  metaTransactionsApiKey,
  disabled = false,
  onPending,
  onSuccess,
  onError,
  ...coreSdkConfig
}: CommitButtonProps) => {
  const coreSdk = useCoreSdk(coreSdkConfig);
  const signerAddress = useSignerAddress(coreSdkConfig.web3Provider);
  const metaTxContract = useMetaTxHandlerContract({
    chainId: coreSdkConfig.chainId,
    metaTransactionsApiKey,
    web3Provider: coreSdkConfig.web3Provider
  });

  return (
    <Button
      variant="primary"
      disabled={disabled}
      onClick={async () => {
        try {
          onPending({ offerId, isLoading: true });
          let txResponse;
          if (metaTransactionsApiKey && metaTxContract && signerAddress) {
            const nonce = Date.now();
            const { r, s, v } = await coreSdk.signExecuteMetaTxCommitToOffer({
              chainId: coreSdkConfig.chainId,
              offerId,
              nonce
            });
            txResponse = await metaTxContract.executeMetaTxCommitToOffer(
              signerAddress,
              { buyer: signerAddress, offerId },
              nonce,
              r,
              s,
              v
            );
          } else {
            txResponse = await coreSdk.commitToOffer(offerId);
          }
          const txReceipt = await txResponse.wait(1);
          const txHash = txResponse.hash;
          const exchangeId = coreSdk.getCommittedExchangeIdFromLogs(
            txReceipt.logs
          );
          onSuccess({ offerId, txHash, exchangeId });
          onPending({ offerId, isLoading: false });
        } catch (error) {
          onPending({ offerId, isLoading: false });
          onError({ offerId, message: "error commiting the item", error });
        }
      }}
    >
      Commit
    </Button>
  );
};

export default CommitButton;
