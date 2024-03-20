import React, { useMemo } from "react";
import { BigNumber, BigNumberish } from "ethers";

import { CtaButtonProps } from "../common/types";
import { CtaButton } from "../common/CtaButton";
import { TransactionReceipt } from "@bosonprotocol/common";
import { useCoreSdkOverrides } from "../../../hooks/core-sdk/useCoreSdkOverrides";
import { useMetaTx } from "../../../hooks/useMetaTx";
import { withQueryClientProvider } from "../../queryClient/withQueryClientProvider";

type AdditionalProps = {
  accountId: string;
  tokensToWithdraw: {
    address: string;
    amount: BigNumberish;
  }[];
};

type SuccessPayload = TransactionReceipt;

export type IWithdrawFundsButton = AdditionalProps &
  CtaButtonProps<SuccessPayload>;

export const WithdrawFundsButton = withQueryClientProvider(
  ({
    accountId,
    variant = "primaryFill",
    tokensToWithdraw,
    ...restProps
  }: IWithdrawFundsButton) => {
    const coreSdk = useCoreSdkOverrides({
      coreSdkConfig: restProps.coreSdkConfig
    });
    const { isMetaTx } = useMetaTx(coreSdk);
    const tokenList = useMemo(
      () => tokensToWithdraw.map((t) => t.address),
      [tokensToWithdraw]
    );
    const tokenAmounts = useMemo(
      () => tokensToWithdraw.map((t) => BigNumber.from(t.amount).toString()),
      [tokensToWithdraw]
    );
    const actions = [
      // Withdraw funds
      {
        writeContractFn: () => {
          return coreSdk.withdrawFunds(accountId, tokenList, tokenAmounts);
        },
        signMetaTxFn: async () =>
          coreSdk.signMetaTxWithdrawFunds({
            entityId: accountId,
            tokenList,
            tokenAmounts,
            nonce: Date.now()
          }),
        additionalMetaTxCondition: isMetaTx
      }
    ];

    return (
      <CtaButton
        variant={variant}
        defaultLabel="Withdraw"
        successPayload={(receipt) => receipt}
        actions={actions}
        {...restProps}
      />
    );
  }
);
