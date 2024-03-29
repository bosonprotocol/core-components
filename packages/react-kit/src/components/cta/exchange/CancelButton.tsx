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

export type ICancelButton = AdditionalProps & CtaButtonProps<SuccessPayload>;

export const CancelButton = withQueryClientProvider(
  ({ variant = "secondaryFill", exchangeId, ...restProps }: ICancelButton) => {
    const coreSdk = useCoreSdkOverrides({
      coreSdkConfig: restProps.coreSdkConfig
    });

    const actions = [
      {
        writeContractFn: () => coreSdk.cancelVoucher(exchangeId),
        signMetaTxFn: () =>
          coreSdk.signMetaTxCancelVoucher({
            nonce: Date.now(),
            exchangeId
          })
      }
    ];

    return (
      <CtaButton
        variant={variant}
        defaultLabel="Cancel"
        successPayload={{ exchangeId }}
        actions={actions}
        {...restProps}
      />
    );
  }
);
