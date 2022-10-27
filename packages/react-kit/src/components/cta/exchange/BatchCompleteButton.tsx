import React from "react";
import { BigNumberish } from "ethers";

import { useCoreSdk } from "../../../hooks/useCoreSdk";
import { CtaButtonProps } from "../common/types";
import { CtaButton } from "../common/CtaButton";

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

export const BatchCompleteButton = ({
  exchangeIds,
  variant = "primaryFill",
  ...restProps
}: Props) => {
  const coreSdk = useCoreSdk(restProps);

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
};
