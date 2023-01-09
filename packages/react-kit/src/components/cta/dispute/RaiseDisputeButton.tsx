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

export type IRaiseDisputeButton = AdditionalProps &
  CtaButtonProps<SuccessPayload>;

export const RaiseDisputeButton = ({
  variant = "secondaryFill",
  exchangeId,
  ...restProps
}: IRaiseDisputeButton) => {
  const coreSdk = useCoreSdk(restProps);

  const actions = [
    {
      writeContractFn: () => coreSdk.raiseDispute(exchangeId),
      signMetaTxFn: async () =>
        coreSdk.signMetaTxRaiseDispute({
          nonce: Date.now(),
          exchangeId
        })
    }
  ];

  return (
    <CtaButton
      variant={variant}
      defaultLabel="Raise"
      successPayload={{ exchangeId }}
      actions={actions}
      {...restProps}
    />
  );
};
