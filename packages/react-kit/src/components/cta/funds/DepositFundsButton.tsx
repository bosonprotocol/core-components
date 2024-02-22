import React from "react";
import { BigNumber, BigNumberish, constants, ethers } from "ethers";

import { CtaButtonProps } from "../common/types";
import { CtaButton } from "../common/CtaButton";
import { TransactionReceipt } from "@bosonprotocol/common";
import { useCoreSdkOverrides } from "../../../hooks/core-sdk/useCoreSdkOverrides";
import { useMetaTx } from "../../../hooks/useMetaTx";

type AdditionalProps = {
  exchangeToken: string;
  accountId: string;
  amountToDeposit: BigNumberish;
};

type SuccessPayload = TransactionReceipt;

export type IDepositFundsButton = AdditionalProps &
  CtaButtonProps<SuccessPayload>;

export const DepositFundsButton = ({
  exchangeToken,
  accountId,
  variant = "primaryFill",
  amountToDeposit,
  ...restProps
}: IDepositFundsButton) => {
  const coreSdk = useCoreSdkOverrides({
    coreSdkConfig: restProps.coreSdkConfig
  });
  const { isMetaTx, signerAddress } = useMetaTx(coreSdk);

  const actions = [
    // Approve exchange token
    {
      name: "approveExchangeToken" as const,
      writeContractFn: () =>
        coreSdk.approveExchangeToken(exchangeToken, constants.MaxInt256),
      nativeMetaTxContract: exchangeToken,
      signMetaTxFn: () =>
        coreSdk.signNativeMetaTxApproveExchangeToken(
          exchangeToken,
          constants.MaxInt256
        ),
      additionalMetaTxCondition:
        coreSdk.checkMetaTxConfigSet({ contractAddress: exchangeToken }) &&
        !!signerAddress,
      shouldActionRun: async () => {
        const isNativeCoin = constants.AddressZero === exchangeToken;
        if (isNativeCoin) {
          return false;
        }
        const allowance = await coreSdk.getProtocolAllowance(exchangeToken);

        return BigNumber.from(allowance).lt(amountToDeposit);
      }
    },
    // Deposit funds
    {
      name: "depositFunds" as const,
      writeContractFn: () =>
        coreSdk.depositFunds(accountId, amountToDeposit, exchangeToken),
      signMetaTxFn: () =>
        coreSdk.signMetaTxDepositFunds({
          sellerId: accountId,
          fundsTokenAddress: exchangeToken,
          fundsAmount: amountToDeposit,
          nonce: Date.now()
        }),
      additionalMetaTxCondition: Boolean(
        isMetaTx && exchangeToken !== ethers.constants.AddressZero
      )
    }
  ];

  return (
    <CtaButton
      variant={variant}
      defaultLabel="Deposit"
      successPayload={(receipt) => receipt}
      actions={actions}
      {...restProps}
    />
  );
};
