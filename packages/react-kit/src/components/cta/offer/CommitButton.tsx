import React from "react";

import { Button } from "../../buttons/Button";
import { useMetaTxHandlerContract } from "../../../hooks/meta-tx/useMetaTxHandlerContract";
import { useCoreSdk } from "../../../hooks/useCoreSdk";
import { useSignerAddress } from "../../../hooks/useSignerAddress";
import { ExtraInfo } from "../styles/common.styles";
import { OfferCtaProps } from "./common/types";

export const CommitButton = ({
  offerId,
  metaTransactionsApiKey,
  disabled = false,
  extraInfo = "",
  children,
  onPendingUserConfirmation,
  onPendingTransactionConfirmation,
  onSuccess,
  onError,
  ...coreSdkConfig
}: OfferCtaProps) => {
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
          onPendingUserConfirmation({ offerId, isLoading: true });
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
          onPendingTransactionConfirmation(txHash);
          const exchangeId = coreSdk.getCommittedExchangeIdFromLogs(
            txReceipt.logs
          );
          onSuccess({ offerId, txHash, exchangeId });
          onPendingUserConfirmation({ offerId, isLoading: false });
        } catch (error) {
          onPendingUserConfirmation({ offerId, isLoading: false });
          onError({ offerId, message: "error commiting the item", error });
        }
      }}
    >
      <>
        {children || "Commit"}
        {extraInfo && <ExtraInfo>{extraInfo}</ExtraInfo>}
      </>
    </Button>
  );
};
