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

export type IExpireButton = AdditionalProps & CtaButtonProps<SuccessPayload>;

export const ExpireButton = withQueryClientProvider(
  ({ exchangeId, variant = "secondaryFill", ...restProps }: IExpireButton) => {
    const coreSdk = useCoreSdkOverrides({
      coreSdkConfig: restProps.coreSdkConfig
    });

    const actions = [
      {
        writeContractFn: () => coreSdk.expireVoucher(exchangeId),
        signMetaTxFn: () =>
          coreSdk.signMetaTxExpireVoucher({
            nonce: Date.now(),
            exchangeId
          })
      }
    ];

    return (
      <CtaButton
        variant={variant}
        defaultLabel="Expire"
        successPayload={{ exchangeId }}
        actions={actions}
        {...restProps}
      />
    );
  }
);
