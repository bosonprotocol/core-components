import React, { useMemo } from "react";
import { BigNumber, BigNumberish } from "ethers";

import { useCoreSdk } from "../../../hooks/useCoreSdk";
import { CtaButtonProps } from "../common/types";
import { CtaButton } from "../common/CtaButton";
import { useSignerAddress } from "../../../hooks/useSignerAddress";
import { TransactionReceipt } from "@bosonprotocol/common";

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

export const WithdrawFundsButton = ({
  accountId,
  variant = "primaryFill",
  tokensToWithdraw,
  ...restProps
}: IWithdrawFundsButton) => {
  const coreSdk = useCoreSdk(restProps);
  const signerAddress = useSignerAddress(restProps.web3Provider);
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
      additionalMetaTxCondition: Boolean(
        coreSdk.isMetaTxConfigSet && signerAddress
      )
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
};
