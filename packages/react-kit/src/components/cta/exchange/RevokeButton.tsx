import React from "react";
import { BigNumberish } from "ethers";

import { useCoreSdk } from "../../../hooks/useCoreSdk";
import { CtaButtonProps } from "../common/types";
import { CtaButton } from "../common/CtaButton";

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
  const coreSdk = useCoreSdk(restProps);

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
