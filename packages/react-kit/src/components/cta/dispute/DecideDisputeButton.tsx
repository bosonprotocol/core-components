import React from "react";
import { BigNumberish } from "ethers";

import { CtaButtonProps } from "../common/types";
import { CtaButton } from "../common/CtaButton";
import { useCoreSdkOverrides } from "../../../hooks/core-sdk/useCoreSdkOverrides";
import { withQueryClientProvider } from "../../queryClient/withQueryClientProvider";

type AdditionalProps = {
  exchangeId: BigNumberish;
  buyerPercent: BigNumberish;
};

type SuccessPayload = {
  exchangeId: BigNumberish;
};

export type IDecideDisputeButton = AdditionalProps &
  CtaButtonProps<SuccessPayload>;

export const DecideDisputeButton = withQueryClientProvider(
  ({
    exchangeId,
    buyerPercent,
    variant = "primaryFill",
    ...restProps
  }: IDecideDisputeButton) => {
    const coreSdk = useCoreSdkOverrides({
      coreSdkConfig: restProps.coreSdkConfig
    });
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
  }
);
