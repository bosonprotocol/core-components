import { AddressZero } from "@ethersproject/constants";
import { BigNumber, BigNumberish } from "ethers";
import React, { useEffect } from "react";

import { Action } from "../../../hooks/useCtaClickHandler";
import { useSignerAddress } from "../../../hooks/useSignerAddress";
import { CtaButton } from "../common/CtaButton";
import { CtaButtonProps } from "../common/types";
import { useCoreSdkOverrides } from "../../../hooks/core-sdk/useCoreSdkOverrides";
import { withQueryClientProvider } from "../../queryClient/withQueryClientProvider";

type AdditionalProps = {
  /**
   * ID of offer to commit to.
   */
  offerId: BigNumberish;
  exchangeToken: string;
  price: BigNumberish;
  isPauseCommitting?: boolean;
  onGetSignerAddress?: (
    signerAddress: string | undefined
  ) => string | undefined;
};

type SuccessPayload = {
  exchangeId: BigNumberish;
};

type Props = AdditionalProps & CtaButtonProps<SuccessPayload>;

export const CommitButton = withQueryClientProvider(
  ({
    offerId,
    exchangeToken,
    price,
    isPauseCommitting = false,
    variant = "primaryFill",
    onGetSignerAddress,
    ...restProps
  }: Props) => {
    const coreSdk = useCoreSdkOverrides({
      coreSdkConfig: restProps.coreSdkConfig
    });
    const { signerAddress } = useSignerAddress(coreSdk.web3Lib);

    useEffect(() => {
      if (onGetSignerAddress) {
        onGetSignerAddress(signerAddress);
      }
    }, [signerAddress, onGetSignerAddress]);

    const actions: Action[] = [
      // Approve exchange token action
      {
        name: "approveExchangeToken",
        writeContractFn: () =>
          coreSdk.approveExchangeToken(exchangeToken, price),
        nativeMetaTxContract: exchangeToken,
        signMetaTxFn: () =>
          coreSdk.signNativeMetaTxApproveExchangeToken(exchangeToken, price),
        additionalMetaTxCondition: coreSdk.checkMetaTxConfigSet({
          contractAddress: exchangeToken
        }),
        shouldActionRun: async () => {
          // only approve exchange token if
          // - erc20 token
          // - insufficient allowance of protocol
          if (exchangeToken === AddressZero) {
            return false;
          }
          const currentAllowance =
            await coreSdk.getProtocolAllowance(exchangeToken);
          return BigNumber.from(currentAllowance).lt(price);
        }
      },
      // Commit action
      {
        name: "commit",
        writeContractFn: () => coreSdk.commitToOffer(offerId),
        signMetaTxFn: () =>
          coreSdk.signMetaTxCommitToOffer({
            offerId,
            nonce: Date.now()
          }),
        additionalMetaTxCondition:
          exchangeToken !== AddressZero || BigNumber.from(price).eq(0)
      }
    ];

    return (
      <CtaButton
        variant={variant}
        defaultLabel="Commit to Buy"
        successPayload={(receipt) => ({
          exchangeId: coreSdk.getCommittedExchangeIdFromLogs(
            receipt.logs
          ) as string
        })}
        actions={actions}
        {...restProps}
      />
    );
  }
);
