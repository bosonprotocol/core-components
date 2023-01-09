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

export type IRefuseDisputeButton = AdditionalProps &
  CtaButtonProps<SuccessPayload>;

export const RefuseDisputeButton = ({
  exchangeId,
  variant = "secondaryFill",
  ...restProps
}: IRefuseDisputeButton) => {
  const coreSdk = useCoreSdk(restProps);
  const actions = [
    {
      writeContractFn: () => coreSdk.refuseEscalatedDispute(exchangeId)
      // TODO: ADD signMetaTxFn - has not been implemented in coreSDK yet.
    }
  ];

  return (
    <CtaButton
      variant={variant}
      defaultLabel="Refuse"
      successPayload={{ exchangeId }}
      actions={actions}
      {...restProps}
    />
  );
};
