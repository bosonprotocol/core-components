import React from "react";
import { BigNumberish } from "ethers";

import { CtaButtonProps } from "../common/types";
import { CtaButton } from "../common/CtaButton";
import { useCoreSdkOverrides } from "../../../hooks/core-sdk/useCoreSdkOverrides";
import { withQueryClientProvider } from "../../queryClient/withQueryClientProvider";

type AdditionalProps = {
  exchangeId: BigNumberish;
};

type SuccessPayload = {
  exchangeId: BigNumberish;
};

export type IRaiseDisputeButton = AdditionalProps &
  CtaButtonProps<SuccessPayload>;

export const RaiseDisputeButton = withQueryClientProvider(
  ({
    variant = "secondaryFill",
    exchangeId,
    ...restProps
  }: IRaiseDisputeButton) => {
    const coreSdk = useCoreSdkOverrides({
      coreSdkConfig: restProps.coreSdkConfig
    });

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
  }
);
