import React from "react";
import { BigNumberish, providers } from "ethers";

import { Button, ButtonSize } from "../../buttons/Button";
import { useMetaTxHandlerContract } from "../../../hooks/meta-tx/useMetaTxHandlerContract";
import { useCoreSdk } from "../../../hooks/useCoreSdk";
import { useSignerAddress } from "../../../hooks/useSignerAddress";
import { ExtraInfo } from "../common/styles";
import { CtaButtonProps } from "../common/types";

type Props = { offerId: BigNumberish } & CtaButtonProps<{
  exchangeId: BigNumberish;
}>;

export const CommitButton = ({
  offerId,
  metaTransactionsApiKey,
  disabled = false,
  extraInfo = "",
  children,
  onPendingSignature,
  onPendingTransaction,
  onSuccess,
  onError,
  waitBlocks = 1,
  size = ButtonSize.Large,
  ...coreSdkConfig
}: Props) => {
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
      size={size}
      disabled={disabled}
      onClick={async () => {
        try {
          onPendingSignature && onPendingSignature();

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

          onPendingTransaction && onPendingTransaction(txResponse.hash);
          const receipt = await txResponse.wait(waitBlocks);
          const exchangeId = coreSdk.getCommittedExchangeIdFromLogs(
            receipt.logs
          );

          onSuccess &&
            onSuccess(receipt as providers.TransactionReceipt, {
              exchangeId: exchangeId || ""
            });
        } catch (error) {
          onError && onError(error as Error);
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
