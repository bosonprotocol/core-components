import React, { useState } from "react";
import { BigNumberish, providers } from "ethers";

import { Button, ButtonSize } from "../../buttons/Button";
import { useCoreSdk } from "../../../hooks/useCoreSdk";
import { ButtonTextWrapper, ExtraInfo, LoadingWrapper } from "../common/styles";
import { CtaButtonProps } from "../common/types";
import { Loading } from "../../Loading";

type Props = {
  /**
   * ID of offer to void.
   */
  offerId: BigNumberish;
} & CtaButtonProps<{
  offerId: BigNumberish;
}>;

export const VoidButton = ({
  offerId,
  disabled = false,
  extraInfo,
  onSuccess,
  onError,
  onPendingSignature,
  onPendingTransaction,
  waitBlocks = 1,
  size = ButtonSize.Large,
  variant = "secondary",
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
            const txResponse = await coreSdk.voidOffer(offerId);

            onPendingTransaction?.(txResponse.hash);
            const receipt = await txResponse.wait(waitBlocks);

            onSuccess?.(receipt as providers.TransactionReceipt, { offerId });
          } catch (error) {
            onError?.(error as Error);
          } finally {
            setIsLoading(false);
          }
        }
      }}
    >
      <ButtonTextWrapper>
        {children || "Void"}
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
