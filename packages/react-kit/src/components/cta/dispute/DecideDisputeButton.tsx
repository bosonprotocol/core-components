import React from "react";
import { BigNumberish } from "ethers";

import { useCoreSdk } from "../../../hooks/useCoreSdk";
import { CtaButtonProps } from "../common/types";
import { CtaButton } from "../common/CtaButton";

type AdditionalProps = {
  exchangeId: BigNumberish;
  buyerPercent: BigNumberish;
};

type SuccessPayload = {
  exchangeId: BigNumberish;
};

export type IDecideDisputeButton = AdditionalProps &
  CtaButtonProps<SuccessPayload>;

export const DecideDisputeButton = ({
  exchangeId,
  buyerPercent,
  variant = "primaryFill",
  ...restProps
}: IDecideDisputeButton) => {
  const coreSdk = useCoreSdk(restProps);
  const actions = [
    {
      writeContractFn: () => coreSdk.decideDispute(exchangeId, buyerPercent)
      // TODO: ADD signMetaTxFn - has not been implemented in coreSDK yet.
    }
  ];

  return (
    <CtaButton
      variant={variant}
      defaultLabel="Decide"
      successPayload={{ exchangeId }}
      actions={actions}
      {...restProps}
    />
  );
};
