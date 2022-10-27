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

export type IExpireButton = AdditionalProps & CtaButtonProps<SuccessPayload>;

export const ExpireButton = ({
  exchangeId,
  variant = "secondaryFill",
  ...restProps
}: IExpireButton) => {
  const coreSdk = useCoreSdk(restProps);

  const actions = [
    {
      writeContractFn: () => coreSdk.expireVoucher(exchangeId),
      signMetaTxFn: () =>
        coreSdk.signMetaTxExpireVoucher({
          nonce: Date.now(),
          exchangeId
        })
    }
  ];

  return (
    <CtaButton
      variant={variant}
      defaultLabel="Expire"
      successPayload={{ exchangeId }}
      actions={actions}
      {...restProps}
    />
  );
};
