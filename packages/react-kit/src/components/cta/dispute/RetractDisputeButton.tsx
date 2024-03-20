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

export type IRetractDisputeButton = AdditionalProps &
  CtaButtonProps<SuccessPayload>;

export const RetractDisputeButton = withQueryClientProvider(
  ({
    exchangeId,
    variant = "primaryFill",
    ...restProps
  }: IRetractDisputeButton) => {
    const coreSdk = useCoreSdkOverrides({
      coreSdkConfig: restProps.coreSdkConfig
    });

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
  }
);
