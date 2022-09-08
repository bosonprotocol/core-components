import React, { useState } from "react";
import { BigNumberish, providers } from "ethers";

import { Button, ButtonSize } from "../../buttons/Button";
import { useCoreSdk } from "../../../hooks/useCoreSdk";
import { useSignerAddress } from "../../../hooks/useSignerAddress";
import { ButtonTextWrapper, ExtraInfo, LoadingWrapper } from "../common/styles";
import { CtaButtonProps } from "../common/types";
import { Loading } from "../../Loading";

type Props = {
  /**
   * ID of offer to commit to.
   */
  offerId: BigNumberish;
} & CtaButtonProps<{
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
  variant = "primary",
  ...coreSdkConfig
}: Props) => {
  const coreSdk = useCoreSdk(coreSdkConfig);
  const signerAddress = useSignerAddress(coreSdkConfig.web3Provider);

  const [isLoading, setIsLoading] = useState<boolean>(false);

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

            if (metaTransactionsApiKey && signerAddress) {
              const nonce = Date.now();
              const { r, s, v, functionName, functionSignature } =
                await coreSdk.signExecuteMetaTxCommitToOffer({
                  chainId: coreSdkConfig.chainId,
                  offerId,
                  nonce
                });
              txResponse = await coreSdk.relayMetaTransaction(
                metaTransactionsApiKey,
                signerAddress,
                functionName,
                functionSignature,
                nonce,
                r,
                s,
                v
              );
            } else {
              txResponse = await coreSdk.commitToOffer(offerId);
            }

            onPendingTransaction?.(txResponse.hash);
            const receipt = await txResponse.wait(waitBlocks);
            const exchangeId = coreSdk.getCommittedExchangeIdFromLogs(
              receipt.logs
            );

            onSuccess?.(receipt as providers.TransactionReceipt, {
              exchangeId: exchangeId || ""
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
        {children || "Commit"}
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
