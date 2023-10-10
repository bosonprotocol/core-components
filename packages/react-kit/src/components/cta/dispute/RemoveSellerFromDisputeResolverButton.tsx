import React, { useState } from "react";
import { BigNumberish, providers } from "ethers";

import { Button } from "../../buttons/Button";
import { useCoreSdk } from "../../../hooks/useCoreSdk";
import { ButtonTextWrapper, ExtraInfo, LoadingWrapper } from "../common/styles";
import { CtaButtonProps } from "../common/types";
import { Loading } from "../../Loading";
import { CreateSellerArgs } from "@bosonprotocol/common";
import { DisputeResolutionFee } from "@bosonprotocol/core-sdk/dist/cjs/accounts";
import { ButtonSize } from "../../ui/buttonSize";
export type IRemoveSellerFromDisputeResolverButton = {
  exchangeId: BigNumberish;
  createSellerArgs: CreateSellerArgs;
  buyerPercent: string;
  disputeResolverId: BigNumberish;
  sellerAllowList: string[];

  fees: DisputeResolutionFee[];
} & CtaButtonProps<{
  exchangeId: BigNumberish;
}>;

export const RemoveSellerFromDisputeResolverButton = ({
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
  sellerAllowList,
  coreSdkConfig,
  ...rest
}: IRemoveSellerFromDisputeResolverButton) => {
  const coreSdk = useCoreSdk(coreSdkConfig);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <Button
      variant={variant}
      size={size}
      disabled={disabled}
      onClick={async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        if (!isLoading) {
          try {
            setIsLoading(true);
            onPendingSignature?.();

            const txResponse =
              await coreSdk.removeSellersFromDisputeResolverAllowList(
                disputeResolverId,
                sellerAllowList
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
      {...rest}
    >
      <ButtonTextWrapper>
        {children || "Remove Seller"}
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
