import React from "react";
import { BigNumberish, utils } from "ethers";

import { CtaButtonProps } from "../common/types";
import { CtaButton } from "../common/CtaButton";
import { useCoreSdkOverrides } from "../../../hooks/core-sdk/useCoreSdkOverrides";

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
  const coreSdk = useCoreSdkOverrides({
    coreSdkConfig: restProps.coreSdkConfig
  });
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
