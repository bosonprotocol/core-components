import React, { useState } from "react";
import { BigNumberish, providers } from "ethers";
import { TransactionResponse } from "@bosonprotocol/common";

import { Button } from "../../buttons/Button";
import { ButtonTextWrapper, ExtraInfo, LoadingWrapper } from "../common/styles";
import { CtaButtonProps } from "../common/types";
import { Loading } from "../../ui/loading/Loading";
import { ButtonSize } from "../../ui/buttonSize";
import { useCoreSdkOverrides } from "../../../hooks/core-sdk/useCoreSdkOverrides";
import { useMetaTx } from "../../../hooks/useMetaTx";
import { withQueryClientProvider } from "../../queryClient/withQueryClientProvider";

type Props = {
  /**
   * ID of offer to reserve range for.
   */
  offerId: BigNumberish;
  /**
   * Length of the range to reserve.
   */
  length: number;
  /**
   * To whom the range is being reserved: "seller" or "contract".
   */
  to: "seller" | "contract";
} & CtaButtonProps<{
  offerId: BigNumberish;
  length: number;
  to: "seller" | "contract";
}>;

export const ReserveRangeButton = withQueryClientProvider(
  ({
    offerId,
    length,
    to,
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
                  await coreSdk.signMetaTxReserveRange({
                    offerId,
                    length,
                    to,
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
                txResponse = await coreSdk.reserveRange(offerId, length, to);
              }

              onPendingTransaction?.(txResponse.hash, isMetaTx);
              const receipt = await txResponse.wait(waitBlocks);

              onSuccess?.(receipt as providers.TransactionReceipt, {
                offerId,
                length,
                to
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
          {children || "Reserve Range"}
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
);
