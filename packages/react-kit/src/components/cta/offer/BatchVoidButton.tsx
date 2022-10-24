import React, { useState } from "react";
import { BigNumberish, providers } from "ethers";

import { Button, ButtonSize } from "../../buttons/Button";
import { useCoreSdk } from "../../../hooks/useCoreSdk";
import { ButtonTextWrapper, ExtraInfo, LoadingWrapper } from "../common/styles";
import { CtaButtonProps } from "../common/types";
import { Loading } from "../../Loading";

type Props = {
  /**
   * IDs of offer to voided.
   */
  offerIds: BigNumberish[];
} & CtaButtonProps<{
  offerIds: BigNumberish[];
}>;

export const BatchVoidButton = ({
  offerIds,
  disabled = false,
  showLoading = false,
  extraInfo,
  onSuccess,
  onError,
  onPendingSignature,
  onPendingTransaction,
  waitBlocks = 1,
  size = ButtonSize.Large,
  variant = "secondaryFill",
  children,
  ...coreSdkConfig
}: Props) => {
  const coreSdk = useCoreSdk(coreSdkConfig);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <Button
      variant={variant}
      disabled={disabled}
      size={size}
      onClick={async () => {
        if (!isLoading) {
          try {
            setIsLoading(true);
            onPendingSignature?.();
            const txResponse = await coreSdk.voidOfferBatch(offerIds);

            onPendingTransaction?.(txResponse.hash);
            const receipt = await txResponse.wait(waitBlocks);

            onSuccess?.(receipt as providers.TransactionReceipt, {
              offerIds
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
        {children || "Batch Void"}
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
