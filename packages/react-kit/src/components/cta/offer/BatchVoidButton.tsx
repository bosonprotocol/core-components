import React, { useState } from "react";
import { BigNumberish, providers } from "ethers";

import { Button } from "../../buttons/Button";
import { ButtonTextWrapper, ExtraInfo, LoadingWrapper } from "../common/styles";
import { CtaButtonProps } from "../common/types";
import { Loading } from "../../Loading";
import { ButtonSize } from "../../ui/buttonSize";
import { TransactionResponse } from "@bosonprotocol/common";
import { useCoreSdkOverrides } from "../../../hooks/core-sdk/useCoreSdkOverrides";
import { useMetaTx } from "../../../hooks/useMetaTx";
import { withQueryClientProvider } from "../../queryClient/withQueryClientProvider";

type Props = {
  /**
   * IDs of offer to voided.
   */
  offerIds: BigNumberish[];
} & CtaButtonProps<{
  offerIds: BigNumberish[];
}>;

export const BatchVoidButton = withQueryClientProvider(
  ({
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
                  await coreSdk.signMetaTxVoidOfferBatch({
                    offerIds,
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
                txResponse = await coreSdk.voidOfferBatch(offerIds);
              }

              onPendingTransaction?.(txResponse.hash, isMetaTx);
              const receipt = await txResponse.wait(waitBlocks);

              onSuccess?.(receipt as providers.TransactionReceipt, {
                offerIds
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
  }
);
