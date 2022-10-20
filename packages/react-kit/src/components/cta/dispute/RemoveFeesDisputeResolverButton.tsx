import React, { useState } from "react";
import { BigNumberish, providers } from "ethers";

import { Button, ButtonSize } from "../../buttons/Button";
import { useCoreSdk } from "../../../hooks/useCoreSdk";
import { ButtonTextWrapper, ExtraInfo, LoadingWrapper } from "../common/styles";
import { CtaButtonProps } from "../common/types";
import { Loading } from "../../Loading";
import { CreateSellerArgs } from "@bosonprotocol/common";
export type IRemoveFeesDisputeResolver = {
  exchangeId: BigNumberish;
  createSellerArgs: CreateSellerArgs;
  buyerPercent: string;
  disputeResolverId: BigNumberish;
  feeTokenAddresses: string[];
} & CtaButtonProps<{
  exchangeId: BigNumberish;
}>;

export const RemoveFeesDisputeResolver = ({
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
  createSellerArgs,
  buyerPercent,
  disputeResolverId,
  feeTokenAddresses,
  ...coreSdkConfig
}: IRemoveFeesDisputeResolver) => {
  const coreSdk = useCoreSdk(coreSdkConfig);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <Button
      variant={variant}
      size={size}
      disabled={disabled}
      onClick={async (e) => {
        e.stopPropagation();
        if (!isLoading) {
          try {
            setIsLoading(true);
            onPendingSignature?.();

            const txResponse = await coreSdk.removeFeesFromDisputeResolver(
              disputeResolverId,
              feeTokenAddresses
            );

            onPendingTransaction?.(txResponse.hash);
            const receipt = await txResponse.wait(waitBlocks);

            onSuccess?.(receipt as providers.TransactionReceipt, {
              exchangeId
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
        {children || "Remove Fees"}
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
