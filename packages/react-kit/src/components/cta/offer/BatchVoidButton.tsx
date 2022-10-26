import React, { useState } from "react";
import { BigNumberish, providers } from "ethers";

import { Button, ButtonSize } from "../../buttons/Button";
import { useCoreSdk } from "../../../hooks/useCoreSdk";
import { ButtonTextWrapper, ExtraInfo, LoadingWrapper } from "../common/styles";
import { useSignerAddress } from "../../../hooks/useSignerAddress";
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

  const signerAddress = useSignerAddress(coreSdkConfig.web3Provider);

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

            let txResponse;
            const isMetaTx = Boolean(
              coreSdk.isMetaTxConfigSet && signerAddress
            );

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
