import React from "react";

import { Button } from "../../buttons/Button";
import { useCoreSdk } from "../../../hooks/useCoreSdk";
import { useSignerAddress } from "../../../hooks/useSignerAddress";
import { useMetaTxHandlerContract } from "../../../hooks/meta-tx/useMetaTxHandlerContract";
import { ExtraInfo } from "../styles/common.styles";
import { ExchangeCtaProps } from "./common/types";

export const CancelButton = ({
  exchangeId,
  metaTransactionsApiKey,
  disabled = false,
  extraInfo,
  onSuccess,
  onError,
  onPendingUserConfirmation,
  onPendingTransactionConfirmation,
  waitBlocks = 1,
  children,
  ...coreSdkConfig
}: ExchangeCtaProps) => {
  const coreSdk = useCoreSdk(coreSdkConfig);

  const signerAddress = useSignerAddress(coreSdkConfig.web3Provider);
  const metaTxContract = useMetaTxHandlerContract({
    chainId: coreSdkConfig.chainId,
    metaTransactionsApiKey,
    web3Provider: coreSdkConfig.web3Provider
  });

  return (
    <Button
      variant="secondary"
      disabled={disabled}
      onClick={async () => {
        try {
          onPendingUserConfirmation({ exchangeId, isLoading: true });

          let txResponse;

          if (metaTransactionsApiKey && metaTxContract && signerAddress) {
            const nonce = Date.now();

            const { r, s, v } = await coreSdk.signExecuteMetaTxCancelVoucher({
              chainId: coreSdkConfig.chainId,
              exchangeId,
              nonce
            });

            txResponse = await metaTxContract.executeMetaTxCancelVoucher(
              signerAddress,
              {
                exchangeId
              },
              nonce,
              r,
              s,
              v
            );
          } else {
            txResponse = await coreSdk.cancelVoucher(exchangeId);
          }

          await txResponse.wait(waitBlocks);
          onPendingTransactionConfirmation(txResponse.hash);

          onSuccess({ exchangeId, txHash: txResponse.hash });
          onPendingUserConfirmation({ exchangeId, isLoading: false });
        } catch (error) {
          onPendingUserConfirmation({ exchangeId, isLoading: false });
          onError({ exchangeId, message: "error canceling the item", error });
        }
      }}
    >
      <>
        {children || "Cancel"}
        {extraInfo && <ExtraInfo>{extraInfo}</ExtraInfo>}
      </>
    </Button>
  );
};
