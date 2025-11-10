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
import { forwarder } from "@bosonprotocol/core-sdk";

type Props = {
  /**
   * ID of offer to premint vouchers for.
   */
  offerId: BigNumberish;
  /**
   * Amount of vouchers to premint.
   */
  amount: number;
  metaTxApiId?: string;
} & CtaButtonProps<{
  offerId: BigNumberish;
  amount: number;
  metaTxApiId?: string;
}>;

export const PreMintButton = withQueryClientProvider(
  ({
    offerId,
    amount,
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
    metaTxApiId,
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
                const { to, signature, domainSeparator, request } =
                  await coreSdk.signMetaTxPreMint({
                    offerId,
                    amount
                  });

                txResponse = await coreSdk.relayBiconomyMetaTransaction(
                  to,
                  {
                    request: request as forwarder.biconomy.ERC20ForwardRequest,
                    domainSeparator:
                      domainSeparator ??
                      "0x305def757d40eaccb764a44e4a9d5ec89af56886451ff9348822884eb7a9674a",
                    signature
                  },
                  {
                    metaTxConfig: {
                      apiId: metaTxApiId
                    }
                  }
                );
              } else {
                txResponse = await coreSdk.preMint(offerId, amount);
              }

              onPendingTransaction?.(txResponse.hash, isMetaTx);
              const receipt = await txResponse.wait(waitBlocks);

              onSuccess?.(receipt as providers.TransactionReceipt, {
                offerId,
                amount
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
          {children || "PreMint Vouchers"}
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
