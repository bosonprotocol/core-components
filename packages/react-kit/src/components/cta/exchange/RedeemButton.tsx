import React from "react";
import { BigNumberish } from "ethers";

import { CtaButtonProps } from "../common/types";
import { CtaButton } from "../common/CtaButton";
import { useCoreSdkOverrides } from "../../../hooks/core-sdk/useCoreSdkOverrides";

type AdditionalProps = {
  exchangeId: BigNumberish;
};

type SuccessPayload = {
  exchangeId: BigNumberish;
};

export type IRedeemButton = AdditionalProps & CtaButtonProps<SuccessPayload>;

export const RedeemButton = ({
  exchangeId,
  variant = "primaryFill",
  ...restProps
}: IRedeemButton) => {
  const coreSdk = useCoreSdkOverrides({
    coreSdkConfig: restProps.coreSdkConfig
  });

  const actions = [
    {
      writeContractFn: () => coreSdk.redeemVoucher(exchangeId),
      signMetaTxFn: () =>
        coreSdk.signMetaTxRedeemVoucher({
          nonce: Date.now(),
          exchangeId
        })
    }
  ];

  return (
    <CtaButton
      variant={variant}
      defaultLabel="Redeem"
      successPayload={{ exchangeId }}
      actions={actions}
      {...restProps}
    />
  );
};
