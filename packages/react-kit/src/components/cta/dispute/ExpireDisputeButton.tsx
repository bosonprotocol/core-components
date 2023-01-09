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

export type IExpireDisputeButton = AdditionalProps &
  CtaButtonProps<SuccessPayload>;

export const ExpireDisputeButton = ({
  variant = "secondaryFill",
  exchangeId,
  ...restProps
}: IExpireDisputeButton) => {
  const coreSdk = useCoreSdk(restProps);

  const actions = [
    {
      writeContractFn: () => coreSdk.expireDispute(exchangeId)
      // TODO: ADD signMetaTxFn - has not been implemented in coreSDK yet.
    }
  ];

  return (
    <CtaButton
      variant={variant}
      defaultLabel="Expire Dispute"
      successPayload={{ exchangeId }}
      actions={actions}
      {...restProps}
    />
  );
};
