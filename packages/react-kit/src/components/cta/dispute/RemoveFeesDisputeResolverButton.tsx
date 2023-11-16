import React, { useState } from "react";
import { BigNumberish, providers } from "ethers";

import { Button } from "../../buttons/Button";
import { useCoreSdk } from "../../../hooks/useCoreSdk";
import { ButtonTextWrapper, ExtraInfo, LoadingWrapper } from "../common/styles";
import { CtaButtonProps } from "../common/types";
import { Loading } from "../../Loading";
import { CreateSellerArgs, TransactionResponse } from "@bosonprotocol/common";
import { ButtonSize } from "../../ui/buttonSize";
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
  const coreSdk = useCoreSdk(coreSdkConfig.coreSdkConfig);
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

            txResponse = await coreSdk.removeFeesFromDisputeResolver(
              disputeResolverId,
              feeTokenAddresses
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
