import React from "react";
import { BigNumberish } from "ethers";

import { useCoreSdk } from "../../../hooks/useCoreSdk";
import { CtaButtonProps } from "../common/types";
import { CtaButton } from "../common/CtaButton";

type AdditionalProps = {
  exchangeId: BigNumberish;
  newDisputeTimeout: BigNumberish;
};

type SuccessPayload = {
  exchangeId: BigNumberish;
};

export type IExtendDisputeTimeoutButton = AdditionalProps &
  CtaButtonProps<SuccessPayload>;

export const ExtendDisputeTimeoutButton = ({
  variant = "primaryFill",
  exchangeId,
  newDisputeTimeout,
  ...restProps
}: IExtendDisputeTimeoutButton) => {
  const coreSdk = useCoreSdk(restProps);

  const actions = [
    {
      writeContractFn: () =>
        coreSdk.extendDisputeTimeout(exchangeId, newDisputeTimeout)
      // TODO: ADD signMetaTxFn - has not been implemented in coreSDK yet.
    }
  ];

  return (
    <CtaButton
      variant={variant}
      defaultLabel="Extend Time"
      successPayload={{ exchangeId }}
      actions={actions}
      {...restProps}
    />
  );
};
