import React from "react";
import { TransactionResponse } from "@bosonprotocol/common";
import { metaTx } from "@bosonprotocol/core-sdk";

import { Button, ButtonSize } from "../../buttons/Button";
import { useCoreSdk } from "../../../hooks/useCoreSdk";
import { useSignerAddress } from "../../../hooks/useSignerAddress";
import { useCtaClickHandler } from "../../../hooks/useCtaClickHandler";
import { ButtonTextWrapper, ExtraInfo, LoadingWrapper } from "../common/styles";
import { CtaButtonProps } from "../common/types";
import { Loading } from "../../Loading";

type Props<T> = CtaButtonProps<T> & {
  defaultLabel?: string;
  writeContractFn: () => Promise<TransactionResponse>;
  signMetaTxFn?: () => Promise<metaTx.handler.SignedMetaTx>;
  successPayload: T;
};

export function CtaButton<T>({
  disabled = false,
  showLoading = false,
  extraInfo,
  onSuccess,
  onError,
  onPendingSignature,
  onPendingTransaction,
  writeContractFn,
  signMetaTxFn,
  defaultLabel,
  successPayload,
  waitBlocks = 1,
  children,
  size = ButtonSize.Large,
  variant = "secondaryFill",
  ...coreSdkConfig
}: Props<T>) {
  const coreSdk = useCoreSdk(coreSdkConfig);
  const signerAddress = useSignerAddress(coreSdkConfig.web3Provider);

  const { clickHandler, isLoading } = useCtaClickHandler<T>({
    waitBlocks,
    coreSdk,
    signerAddress,
    writeContractFn,
    signMetaTxFn,
    onSuccess,
    successPayload,
    onError,
    onPendingSignature,
    onPendingTransaction
  });

  return (
    <Button
      variant={variant}
      size={size}
      disabled={disabled}
      onClick={clickHandler}
    >
      <ButtonTextWrapper>
        {children || defaultLabel}
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
}
