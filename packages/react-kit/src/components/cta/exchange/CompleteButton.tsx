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

type Props = AdditionalProps & CtaButtonProps<SuccessPayload>;

export const CompleteButton = ({
  exchangeId,
  variant = "primaryFill",
  ...restProps
}: Props) => {
  const coreSdk = useCoreSdk(restProps);

  return (
    <CtaButton
      variant={variant}
      defaultLabel="Complete"
      successPayload={{ exchangeId }}
      writeContractFn={() => coreSdk.completeExchange(exchangeId)}
      {...restProps}
    />
  );
};
