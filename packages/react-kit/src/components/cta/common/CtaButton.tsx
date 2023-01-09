import React from "react";
import { providers } from "ethers";

import { Button, ButtonSize } from "../../buttons/Button";
import { useCoreSdk } from "../../../hooks/useCoreSdk";
import { useSignerAddress } from "../../../hooks/useSignerAddress";
import { useCtaClickHandler, Action } from "../../../hooks/useCtaClickHandler";
import { ButtonTextWrapper, ExtraInfo, LoadingWrapper } from "../common/styles";
import { CtaButtonProps } from "../common/types";
import { Loading } from "../../Loading";

type Props<T> = CtaButtonProps<T> & {
  defaultLabel?: string;
  actions: Action[];
  successPayload: T | ((receipt: providers.TransactionReceipt) => T);
};

export function CtaButton<T>({
  disabled = false,
  showLoading = false,
  extraInfo,
  onSuccess,
  onError,
  onPendingSignature,
  onPendingTransaction,
  actions,
  defaultLabel,
  successPayload,
  waitBlocks = 1,
  children,
  size = ButtonSize.Large,
  variant = "secondaryFill",
  buttonRef,
  ...coreSdkConfig
}: Props<T>) {
  const coreSdk = useCoreSdk(coreSdkConfig);
  const signerAddress = useSignerAddress(coreSdkConfig.web3Provider);

  const { clickHandler, isLoading } = useCtaClickHandler<T>({
    waitBlocks,
    coreSdk,
    signerAddress,
    actions,
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
      ref={buttonRef}
      onClick={(e) => {
        if (!isLoading) {
          clickHandler(e);
        }
      }}
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
