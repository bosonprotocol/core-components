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
  offerId: BigNumberish;
  reserveLength: BigNumberish;
  preMintAmount: BigNumberish;
} & CtaButtonProps<{
  offerId: BigNumberish;
  reserveLength: BigNumberish;
  preMintAmount: BigNumberish;
}>;

export const PremintButton = withQueryClientProvider(
  ({
    offerId,
    reserveLength,
    preMintAmount,
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

              let receipt;
              if (reserveLength) {
                if (isMetaTx) {
                  const nonce = Date.now();

                  const { r, s, v, functionName, functionSignature } =
                    await coreSdk.signMetaTxReserveRange({
                      offerId,
                      length: reserveLength,
                      to: "seller",
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
                  txResponse = await coreSdk.reserveRange(
                    offerId,
                    reserveLength,
                    "seller"
                  );
                }

                onPendingTransaction?.(txResponse.hash, isMetaTx);
                receipt = await txResponse.wait(waitBlocks);

                onPendingSignature?.();
              }

              // if (isMetaTx) {
              //   const nonce = Date.now();

              //   const { to, r, s, v, functionSignature } =
              //     await coreSdk.signMetaTxPreMint({
              //       offerId,
              //       amount: length
              //     });

              //   txResponse = await coreSdk.relayNativeMetaTransaction({
              //     to,
              //     {
              //       functionSignature,
              //       sigR: r,
              //       sigS: s,
              //       sigV: v
              //     }
              //   });
              // } else {
              txResponse = await coreSdk.preMint(offerId, preMintAmount);
              // }

              onPendingTransaction?.(txResponse.hash, isMetaTx);
              receipt = await txResponse.wait(waitBlocks);

              onSuccess?.(receipt as providers.TransactionReceipt, {
                offerId,
                reserveLength,
                preMintAmount
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
          {children || "Premint"}
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
