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

export type IEscalateDisputeButton = AdditionalProps &
  CtaButtonProps<SuccessPayload>;

export const EscalateDisputeButton = withQueryClientProvider(
  ({
    variant = "secondaryFill",
    exchangeId,
    ...restProps
  }: IEscalateDisputeButton) => {
    const coreSdk = useCoreSdkOverrides({
      coreSdkConfig: restProps.coreSdkConfig
    });

    const actions = [
      {
        writeContractFn: () => coreSdk.escalateDispute(exchangeId),
        signMetaTxFn: () =>
          coreSdk.signMetaTxEscalateDispute({
            exchangeId,
            nonce: Date.now()
          })
      }
    ];

    return (
      <CtaButton
        variant={variant}
        defaultLabel="Escalate"
        successPayload={{ exchangeId }}
        actions={actions}
        {...restProps}
      />
    );
  }
);
