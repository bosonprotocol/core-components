import React from "react";
import { BigNumberish } from "ethers";

import { CtaButtonProps } from "../common/types";
import { CtaButton } from "../common/CtaButton";
import { useCoreSdkOverrides } from "../../../hooks/core-sdk/useCoreSdkOverrides";
import { withQueryClientProvider } from "../../queryClient/withQueryClientProvider";

type AdditionalProps = {
  /**
   * IDs of exchange to complete.
   */
  exchangeIds: BigNumberish[];
};

type SuccessPayload = {
  exchangeIds: BigNumberish[];
};

type Props = AdditionalProps & CtaButtonProps<SuccessPayload>;

export const BatchCompleteButton = withQueryClientProvider(
  ({ exchangeIds, variant = "primaryFill", ...restProps }: Props) => {
    const coreSdk = useCoreSdkOverrides({
      coreSdkConfig: restProps.coreSdkConfig
    });

    const actions = [
      {
        writeContractFn: () => coreSdk.completeExchangeBatch(exchangeIds),
        signMetaTxFn: () =>
          coreSdk.signMetaTxCompleteExchangeBatch({
            nonce: Date.now(),
            exchangeIds
          })
      }
    ];

    return (
      <CtaButton
        variant={variant}
        defaultLabel="Batch Complete"
        successPayload={{ exchangeIds }}
        actions={actions}
        {...restProps}
      />
    );
  }
);
