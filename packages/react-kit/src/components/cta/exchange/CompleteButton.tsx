import React from "react";
import { BigNumberish } from "ethers";

import { CtaButtonProps } from "../common/types";
import { CtaButton } from "../common/CtaButton";
import { useCoreSdkOverrides } from "../../../hooks/useCoreSdkOverrides";

type AdditionalProps = {
  exchangeId: BigNumberish;
};

type SuccessPayload = {
  exchangeId: BigNumberish;
};

type Props = AdditionalProps & CtaButtonProps<SuccessPayload>;

export const CompleteButton = ({
  exchangeId,
  variant = "primaryFill",
  ...restProps
}: Props) => {
  const coreSdk = useCoreSdkOverrides({
    coreSdkConfig: restProps.coreSdkConfig
  });

  const actions = [
    {
      writeContractFn: () => coreSdk.completeExchange(exchangeId),
      signMetaTxFn: () =>
        coreSdk.signMetaTxCompleteExchange({
          nonce: Date.now(),
          exchangeId
        })
    }
  ];

  return (
    <CtaButton
      variant={variant}
      defaultLabel="Complete"
      successPayload={{ exchangeId }}
      actions={actions}
      {...restProps}
    />
  );
};
