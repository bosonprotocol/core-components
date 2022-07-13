import React, { useState } from "react";
import { BigNumberish, providers } from "ethers";

import { Button, ButtonSize } from "../../buttons/Button";
import { useCoreSdk } from "../../../hooks/useCoreSdk";
import { ButtonTextWrapper, ExtraInfo, LoadingWrapper } from "../common/styles";
import { CtaButtonProps } from "../common/types";
import { Loading } from "../../Loading";

type Props = { exchangeId: BigNumberish } & CtaButtonProps<{
  exchangeId: BigNumberish;
}>;
export const RevokeButton = ({
  exchangeId,
  disabled = false,
  extraInfo = "",
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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <Button
      variant="secondary"
      size={size}
      disabled={disabled}
      onClick={async () => {
        if (!isLoading) {
          try {
            setIsLoading(true);
            onPendingSignature?.();
            const txResponse = await coreSdk.revokeVoucher(exchangeId);

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
        {children || "Revoke"}
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
