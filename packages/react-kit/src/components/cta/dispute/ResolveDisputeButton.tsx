import React from "react";
import { BigNumberish, utils } from "ethers";

import { useCoreSdk } from "../../../hooks/useCoreSdk";
import { CtaButtonProps } from "../common/types";
import { CtaButton } from "../common/CtaButton";

type AdditionalProps = {
  exchangeId: BigNumberish;
  proposal: {
    signature: string;
    percentageAmount: string;
    type: string;
  };
};

type SuccessPayload = {
  exchangeId: BigNumberish;
};

export type IResolveDisputeButton = AdditionalProps &
  CtaButtonProps<SuccessPayload>;

export const ResolveDisputeButton = ({
  exchangeId,
  proposal,
  variant = "primaryFill",
  ...restProps
}: IResolveDisputeButton) => {
  const coreSdk = useCoreSdk(restProps);
  const signature = utils.splitSignature(proposal.signature);

  const actions = [
    {
      writeContractFn: () =>
        coreSdk.resolveDispute({
          exchangeId: exchangeId,
          buyerPercentBasisPoints: proposal.percentageAmount,
          sigR: signature.r,
          sigS: signature.s,
          sigV: signature.v
        }),
      signMetaTxFn: async () =>
        coreSdk.signMetaTxResolveDispute({
          exchangeId,
          buyerPercent: proposal.percentageAmount,
          counterpartySig: signature,
          nonce: Date.now()
        })
    }
  ];

  return (
    <CtaButton
      variant={variant}
      defaultLabel="Resolve"
      successPayload={{ exchangeId }}
      actions={actions}
      {...restProps}
    />
  );
};
