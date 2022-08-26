import React, { useState } from "react";
import { BigNumberish, providers } from "ethers";

import { Button, ButtonSize } from "../../buttons/Button";
import { useCoreSdk } from "../../../hooks/useCoreSdk";
import { useSignerAddress } from "../../../hooks/useSignerAddress";
import { useMetaTxHandlerContract } from "../../../hooks/meta-tx/useMetaTxHandlerContract";
import { ButtonTextWrapper, ExtraInfo, LoadingWrapper } from "../common/styles";
import { CtaButtonProps } from "../common/types";
import { Loading } from "../../Loading";

type Props = {
  /**
   * ID of voucher/exchange to cancel.
   */
  exchangeId: BigNumberish;
} & CtaButtonProps<{
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
  variant = "secondary",
  ...coreSdkConfig
}: Props) => {
  const coreSdk = useCoreSdk(coreSdkConfig);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const signerAddress = useSignerAddress(coreSdkConfig.web3Provider);
  const metaTxContract = useMetaTxHandlerContract({
    chainId: coreSdkConfig.chainId,
    metaTransactionsApiKey,
    web3Provider: coreSdkConfig.web3Provider
  });

  return (
    <Button
      variant={variant}
      size={size}
      disabled={disabled}
      onClick={async () => {
        if (!isLoading) {
          try {
            setIsLoading(true);
            onPendingSignature?.();

            let txResponse;

            if (metaTransactionsApiKey && metaTxContract && signerAddress) {
              const nonce = Date.now();

              const { r, s, v, functionName, functionSignature } =
                await coreSdk.signExecuteMetaTxCancelVoucher({
                  chainId: coreSdkConfig.chainId,
                  exchangeId,
                  nonce
                });

              txResponse = await metaTxContract.executeMetaTransaction(
                signerAddress,
                functionName,
                functionSignature,
                nonce,
                r,
                s,
                v
              );
            } else {
              txResponse = await coreSdk.cancelVoucher(exchangeId);
            }

            onPendingTransaction?.(txResponse.hash);
            const receipt = await txResponse.wait(waitBlocks);

            onSuccess?.(receipt as providers.TransactionReceipt, {
              exchangeId
            });
          } catch (error) {
            onError?.(error as Error);
          } finally {
            setIsLoading(false);
          }
        }
      }}
    >
      <ButtonTextWrapper>
        {children || "Cancel"}
        {extraInfo && !isLoading && <ExtraInfo>{extraInfo}</ExtraInfo>}
        {extraInfo && isLoading && (
          <LoadingWrapper>
            <Loading />
          </LoadingWrapper>
        )}
      </ButtonTextWrapper>
    </Button>
  );
};
