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

export type ICancelButton = AdditionalProps & CtaButtonProps<SuccessPayload>;

export const CancelButton = ({
  variant = "secondaryFill",
  exchangeId,
  ...restProps
}: ICancelButton) => {
  const coreSdk = useCoreSdk(restProps);

  const actions = [
    {
      writeContractFn: () => coreSdk.cancelVoucher(exchangeId),
      signMetaTxFn: () =>
        coreSdk.signMetaTxCancelVoucher({
          nonce: Date.now(),
          exchangeId
        })
    }
  ];

  return (
    <CtaButton
      variant={variant}
      defaultLabel="Cancel"
      successPayload={{ exchangeId }}
      actions={actions}
      {...restProps}
    />
  );
};
