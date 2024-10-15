import React, { ReactNode } from "react";
import { providers } from "ethers";

import { Button } from "../../buttons/Button";
import { useCtaClickHandler, Action } from "../../../hooks/useCtaClickHandler";
import { ButtonTextWrapper, ExtraInfo, LoadingWrapper } from "../common/styles";
import { CtaButtonProps } from "../common/types";
import { Loading } from "../../ui/loading/Loading";
import { ButtonSize } from "../../ui/buttonSize";
import { useCoreSdkOverrides } from "../../../hooks/core-sdk/useCoreSdkOverrides";
import { useMetaTx } from "../../../hooks/useMetaTx";

type Props<T> = CtaButtonProps<T> & {
  defaultLabel?: ReactNode;
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
  coreSdkConfig,
  ...rest
}: Props<T>) {
  const coreSdk = useCoreSdkOverrides({ coreSdkConfig });
  const { isMetaTx } = useMetaTx(coreSdk);

  const { clickHandler, isLoading } = useCtaClickHandler<T>({
    waitBlocks,
    coreSdk,
    useMetaTx: isMetaTx,
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
      onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (!isLoading) {
          clickHandler(e);
        }
      }}
      {...rest}
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
