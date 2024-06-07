import React, { useState } from "react";
import { BigNumberish, providers } from "ethers";

import { Button } from "../../buttons/Button";
import { ButtonTextWrapper, ExtraInfo, LoadingWrapper } from "../common/styles";
import { CtaButtonProps } from "../common/types";
import { Loading } from "../../ui/loading/Loading";
import { UpdateSellerArgs, TransactionResponse } from "@bosonprotocol/common";
import { ButtonSize } from "../../ui/buttonSize";
import { useCoreSdkOverrides } from "../../../hooks/core-sdk/useCoreSdkOverrides";

export type IUpdateSellerButton = {
  exchangeId: BigNumberish;
  updateSellerArgs: UpdateSellerArgs;
} & CtaButtonProps<{
  exchangeId: BigNumberish;
}>;

export const UpdateSellerButton = ({
  exchangeId,
  disabled = false,
  showLoading = false,
  extraInfo,
  onSuccess,
  onError,
  onPendingSignature,
  onPendingTransaction,
  waitBlocks = 1,
  children,
  size = ButtonSize.Large,
  variant = "accentInverted",
  updateSellerArgs,
  coreSdkConfig,
  ...rest
}: IUpdateSellerButton) => {
  const coreSdk = useCoreSdkOverrides({ coreSdkConfig });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <Button
      variant={variant}
      size={size}
      disabled={disabled}
      onClick={async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        if (!isLoading) {
          let txResponse: TransactionResponse | undefined = undefined;
          try {
            setIsLoading(true);
            onPendingSignature?.();

            txResponse = await coreSdk.updateSellerAndOptIn(updateSellerArgs);

            onPendingTransaction?.(txResponse.hash);
            const receipt = await txResponse.wait(waitBlocks);

            onSuccess?.(receipt as providers.TransactionReceipt, {
              exchangeId
            });
          } catch (error) {
            onError?.(error as Error, {
              txResponse: txResponse as providers.TransactionResponse
            });
          } finally {
            setIsLoading(false);
          }
        }
      }}
      {...rest}
    >
      <ButtonTextWrapper>
        {children || "Update Seller"}
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
