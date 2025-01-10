import { AddressZero } from "@ethersproject/constants";
import { BigNumber, BigNumberish } from "ethers";
import React, { useEffect } from "react";

import { Action } from "../../../hooks/useCtaClickHandler";
import { useSignerAddress } from "../../../hooks/useSignerAddress";
import { CtaButton } from "../common/CtaButton";
import { CtaButtonProps } from "../common/types";
import { useCoreSdkOverrides } from "../../../hooks/core-sdk/useCoreSdkOverrides";
import { withQueryClientProvider } from "../../queryClient/withQueryClientProvider";
import styled from "styled-components";
import { Button } from "../../buttons/Button";
import { CommitView } from "../../buttons/commit/CommitView";
import { CommitButtonViewProps } from "../../buttons/commit/types";
import { AddDollarPrefixToKeys } from "../../../types/helpers";

const StyledButton = styled(Button)<{
  $color: CommitButtonViewProps["color"];
}>`
  svg * {
    fill: black;
  }
  &:not(:disabled) svg * {
    fill: ${({ $color }) => ($color === "black" ? "white" : "black")};
  }
  &:hover:not(:disabled) * {
    fill: ${({ $color }) => ($color === "black" ? "black" : "white")};
  }
`;

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
export type CommitButtonStylingProps = Omit<
  CommitButtonViewProps,
  "shape" | "color"
> &
  AddDollarPrefixToKeys<Required<Pick<CommitButtonViewProps, "color">>>;
export type CommitButtonProps = AdditionalProps &
  Omit<CtaButtonProps<SuccessPayload>, "variant" | "theme"> &
  CommitButtonStylingProps;

export const CommitButton = withQueryClientProvider(
  ({
    offerId,
    exchangeToken,
    price,
    isPauseCommitting = false,
    onGetSignerAddress,
    minHeight,
    minWidth,
    layout,
    ...restProps
  }: CommitButtonProps) => {
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
        variant={null}
        buttonComponent={StyledButton}
        style={{
          minWidth,
          minHeight
        }}
        defaultLabel={<CommitView layout={layout || "horizontal"} />}
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
