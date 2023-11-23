import React, { useState } from "react";
import { BigNumberish, providers } from "ethers";

import { Button } from "../../buttons/Button";
import { ButtonTextWrapper, ExtraInfo, LoadingWrapper } from "../common/styles";
import { CtaButtonProps } from "../common/types";
import { Loading } from "../../Loading";
import { TransactionResponse } from "@bosonprotocol/common";
import { accounts } from "@bosonprotocol/core-sdk";
import { ButtonSize } from "../../ui/buttonSize";
import { useCoreSdkOverrides } from "../../../hooks/useCoreSdkOverrides";
export type ICreateDisputeResolverButton = {
  exchangeId: BigNumberish;
  disputeResolverToCreate: accounts.CreateDisputeResolverArgs;
} & CtaButtonProps<{
  exchangeId: BigNumberish;
}>;

export const CreateDisputeResolverButton = ({
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
  variant = "primaryFill",
  disputeResolverToCreate,
  coreSdkConfig,
  ...rest
}: ICreateDisputeResolverButton) => {
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

            txResponse = await coreSdk.createDisputeResolver(
              disputeResolverToCreate
            );

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
        {children || "Create Dispute"}
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
