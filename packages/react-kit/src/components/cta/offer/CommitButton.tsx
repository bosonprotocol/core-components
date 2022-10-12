import React, { RefObject, useState } from "react";
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
  isPauseCommitting?: boolean;
  buttonRef?: RefObject<HTMLButtonElement>;
} & CtaButtonProps<{
  exchangeId: BigNumberish;
}>;

export const CommitButton = ({
  offerId,
  disabled = false,
  showLoading = false,
  extraInfo = "",
  children,
  onPendingSignature,
  onPendingTransaction,
  onSuccess,
  onError,
  waitBlocks = 1,
  size = ButtonSize.Large,
  isPauseCommitting = false,
  buttonRef,
  variant = "primary",
  ...coreSdkConfig
}: Props) => {
  const coreSdk = useCoreSdk(coreSdkConfig);
  const signerAddress = useSignerAddress(coreSdkConfig.web3Provider);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <Button
      ref={buttonRef}
      variant={variant}
      size={size}
      disabled={disabled}
      onClick={async () => {
        if (!isLoading && !isPauseCommitting) {
          try {
            setIsLoading(true);
            onPendingSignature?.();

            let txResponse;

            if (coreSdk.isMetaTxConfigSet && signerAddress) {
              const nonce = Date.now();
              const { r, s, v, functionName, functionSignature } =
                await coreSdk.signMetaTxCommitToOffer({
                  offerId,
                  nonce
                });
              txResponse = await coreSdk.relayMetaTransaction({
                functionName,
                functionSignature,
                sigR: r,
                sigS: s,
                sigV: v,
                nonce
              });
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
        {extraInfo && ((!isLoading && showLoading) || !showLoading) ? (
          <ExtraInfo>{extraInfo}</ExtraInfo>
        ) : (
          <>
            {isLoading && showLoading && (
              <LoadingWrapper>
                <Loading />
              </LoadingWrapper>
            )}
          </>
        )}
      </ButtonTextWrapper>
    </Button>
  );
};
