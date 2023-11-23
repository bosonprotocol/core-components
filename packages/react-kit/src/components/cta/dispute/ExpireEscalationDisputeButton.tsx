import React from "react";
import { BigNumberish } from "ethers";

import { CtaButtonProps } from "../common/types";
import { CtaButton } from "../common/CtaButton";
import { useCoreSdkOverrides } from "../../../hooks/useCoreSdkOverrides";

type AdditionalProps = {
  exchangeId: BigNumberish;
};

type SuccessPayload = {
  exchangeId: BigNumberish;
};

export type IExpireEscalationDisputeButton = AdditionalProps &
  CtaButtonProps<SuccessPayload>;

export const ExpireEscalationDisputeButton = ({
  exchangeId,
  variant = "secondaryFill",
  ...restProps
}: IExpireEscalationDisputeButton) => {
  const coreSdk = useCoreSdkOverrides({
    coreSdkConfig: restProps.coreSdkConfig
  });
  const actions = [
    {
      writeContractFn: () => coreSdk.expireEscalatedDispute(exchangeId)
      // TODO: ADD signMetaTxFn - has not been implemented in coreSDK yet.
    }
  ];

  return (
    <CtaButton
      variant={variant}
      defaultLabel="Expire Escalation"
      successPayload={{ exchangeId }}
      actions={actions}
      {...restProps}
    />
  );
};
