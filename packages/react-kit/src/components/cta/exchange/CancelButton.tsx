import React from "react";
import { BigNumberish, providers } from "ethers";

import { Button, ButtonSize } from "../../buttons/Button";
import { useCoreSdk } from "../../../hooks/useCoreSdk";
import { useSignerAddress } from "../../../hooks/useSignerAddress";
import { useMetaTxHandlerContract } from "../../../hooks/meta-tx/useMetaTxHandlerContract";
import { ExtraInfo } from "../common/styles";
import { CtaButtonProps } from "../common/types";

type Props = { exchangeId: BigNumberish } & CtaButtonProps<{
  exchangeId: BigNumberish;
}>;

export const CancelButton = ({
  exchangeId,
  metaTransactionsApiKey,
  disabled = false,
  extraInfo,
  onSuccess,
  onError,
  onPendingSignature,
  onPendingTransaction,
  waitBlocks = 1,
  children,
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
      variant="secondary"
      size={size}
      disabled={disabled}
      onClick={async () => {
        try {
          onPendingSignature && onPendingSignature();

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

          onPendingTransaction && onPendingTransaction(txResponse.hash);
          const receipt = await txResponse.wait(waitBlocks);

          onSuccess &&
            onSuccess(receipt as providers.TransactionReceipt, { exchangeId });
        } catch (error) {
          onError && onError(error as Error);
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
