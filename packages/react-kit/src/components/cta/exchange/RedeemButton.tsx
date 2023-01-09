import React from "react";
import { BigNumberish } from "ethers";

import { useCoreSdk } from "../../../hooks/useCoreSdk";
import { CtaButtonProps } from "../common/types";
import { CtaButton } from "../common/CtaButton";

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
  const coreSdk = useCoreSdk(restProps);

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
