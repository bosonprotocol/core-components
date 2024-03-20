import React, { useState } from "react";
import { BigNumberish, providers } from "ethers";

import { Button } from "../../buttons/Button";
import { ButtonTextWrapper, ExtraInfo, LoadingWrapper } from "../common/styles";
import { CtaButtonProps } from "../common/types";
import { Loading } from "../../Loading";
import { CreateSellerArgs, TransactionResponse } from "@bosonprotocol/common";
import { ButtonSize } from "../../ui/buttonSize";
import { useCoreSdkOverrides } from "../../../hooks/core-sdk/useCoreSdkOverrides";
import { useMetaTx } from "../../../hooks/useMetaTx";
import { withQueryClientProvider } from "../../queryClient/withQueryClientProvider";
export type ICreateSellerButton = {
  exchangeId: BigNumberish;
  createSellerArgs: CreateSellerArgs;
} & CtaButtonProps<{
  exchangeId: BigNumberish;
}>;

export const CreateSellerButton = withQueryClientProvider(
  ({
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
    createSellerArgs,
    coreSdkConfig,
    ...rest
  }: ICreateSellerButton) => {
    const coreSdk = useCoreSdkOverrides({ coreSdkConfig });
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { isMetaTx } = useMetaTx(coreSdk);

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

              if (isMetaTx) {
                const nonce = Date.now();

                const { r, s, v, functionName, functionSignature } =
                  await coreSdk.signMetaTxCreateSeller({
                    createSellerArgs,
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
                txResponse = await coreSdk.createSeller(createSellerArgs);
              }

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
          {children || "Create Seller"}
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
