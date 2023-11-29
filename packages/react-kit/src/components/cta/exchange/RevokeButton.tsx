import React from "react";
import { BigNumberish } from "ethers";

import { CtaButtonProps } from "../common/types";
import { CtaButton } from "../common/CtaButton";
import { useCoreSdkOverrides } from "../../../hooks/core-sdk/useCoreSdkOverrides";

type AdditionalProps = {
  exchangeId: BigNumberish;
};

type SuccessPayload = {
  exchangeId: BigNumberish;
};

type IRevokeButton = AdditionalProps & CtaButtonProps<SuccessPayload>;

export const RevokeButton = ({
  exchangeId,
  variant = "secondaryFill",
  ...restProps
}: IRevokeButton) => {
  const coreSdk = useCoreSdkOverrides({
    coreSdkConfig: restProps.coreSdkConfig
  });

  const actions = [
    {
      writeContractFn: () => coreSdk.revokeVoucher(exchangeId),
      signMetaTxFn: () =>
        coreSdk.signMetaTxRevokeVoucher({
          nonce: Date.now(),
          exchangeId
        })
    }
  ];

  return (
    <CtaButton
      variant={variant}
      defaultLabel="Revoke"
      successPayload={{ exchangeId }}
      actions={actions}
      {...restProps}
    />
  );
};
