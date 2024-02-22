import React, { useState } from "react";
import { BigNumberish, providers } from "ethers";
import { TransactionResponse } from "@bosonprotocol/common";

import { Button } from "../../buttons/Button";
import { ButtonTextWrapper, ExtraInfo, LoadingWrapper } from "../common/styles";
import { CtaButtonProps } from "../common/types";
import { Loading } from "../../Loading";
import { ButtonSize } from "../../ui/buttonSize";
import { useCoreSdkOverrides } from "../../../hooks/core-sdk/useCoreSdkOverrides";
import { useMetaTx } from "../../../hooks/useMetaTx";

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
  coreSdkConfig,
  ...rest
}: Props) => {
  const coreSdk = useCoreSdkOverrides({ coreSdkConfig });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { isMetaTx } = useMetaTx(coreSdk);

  return (
    <Button
      variant={variant}
      disabled={disabled}
      size={size}
      onClick={async () => {
        if (!isLoading) {
          let txResponse: TransactionResponse | undefined = undefined;
          try {
            setIsLoading(true);
            onPendingSignature?.();

            if (isMetaTx) {
              const nonce = Date.now();

              const { r, s, v, functionName, functionSignature } =
                await coreSdk.signMetaTxVoidOffer({
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
              txResponse = await coreSdk.voidOffer(offerId);
            }

            onPendingTransaction?.(txResponse.hash, isMetaTx);
            const receipt = await txResponse.wait(waitBlocks);

            onSuccess?.(receipt as providers.TransactionReceipt, { offerId });
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
        {children || "Void"}
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
