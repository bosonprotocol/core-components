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

export type IRetractDisputeButton = AdditionalProps &
  CtaButtonProps<SuccessPayload>;

export const RetractDisputeButton = ({
  exchangeId,
  variant = "primaryFill",
  ...restProps
}: IRetractDisputeButton) => {
  const coreSdk = useCoreSdk(restProps);

  const actions = [
    {
      writeContractFn: () => coreSdk.retractDispute(exchangeId),
      signMetaTxFn: async () =>
        coreSdk.signMetaTxRetractDispute({
          nonce: Date.now(),
          exchangeId
        })
    }
  ];

  return (
    <CtaButton
      variant={variant}
      defaultLabel="Retract"
      successPayload={{ exchangeId }}
      actions={actions}
      {...restProps}
    />
  );
};
