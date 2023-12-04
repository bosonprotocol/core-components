import React from "react";

import { CtaButtonProps } from "../common/types";
import { CtaButton } from "../common/CtaButton";
import { TransactionReceipt } from "@bosonprotocol/common";
import { useCoreSdkOverrides } from "../../../hooks/useCoreSdkOverrides";

type AdditionalProps = {
  accountId: string;
};

type SuccessPayload = TransactionReceipt;

export type IWithdrawAllFundsButton = AdditionalProps &
  CtaButtonProps<SuccessPayload>;

export const WithdrawAllFundsButton = ({
  accountId,
  variant = "primaryFill",
  ...restProps
}: IWithdrawAllFundsButton) => {
  const coreSdk = useCoreSdkOverrides({
    coreSdkConfig: restProps.coreSdkConfig
  });
  const actions = [
    // Withdraw all funds
    {
      writeContractFn: () => coreSdk.withdrawAllAvailableFunds(accountId)
    }
    // TODO: signMetaTxWithdrawAllFunds
  ];

  return (
    <CtaButton
      variant={variant}
      defaultLabel="Withdraw all funds"
      successPayload={(receipt) => receipt}
      actions={actions}
      {...restProps}
    />
  );
};
