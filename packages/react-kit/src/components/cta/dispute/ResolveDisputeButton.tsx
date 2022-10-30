import React from "react";
import { BigNumberish, utils } from "ethers";

import { useCoreSdk } from "../../../hooks/useCoreSdk";
import { CtaButtonProps } from "../common/types";
import { CtaButton } from "../common/CtaButton";
import { hooks } from "../../../stories/helpers/connect-wallet";
import { TransactionResponse } from "@bosonprotocol/common";
import { Exchange } from "@bosonprotocol/core-sdk/dist/cjs/subgraph";
import { CoreSDK } from "@bosonprotocol/core-sdk";

type AdditionalProps = {
  exchange: Exchange;
  proposal: any;
};

type SuccessPayload = {
  exchangeId: BigNumberish;
};

export type IExpireButton = AdditionalProps & CtaButtonProps<SuccessPayload>;

export const ResolveDisputeButton = ({
  exchange,
  proposal,
  variant = "secondaryFill",
  ...restProps
}: IExpireButton) => {
  const address = hooks.useAccount();
  const exchangeId = exchange.id;
  const coreSdk = useCoreSdk(restProps);

  async function resolveDisputeWithMetaTx(
    coreSdk: CoreSDK,
    exchangeId: BigNumberish,
    buyerPercent: BigNumberish,
    counterpartySig: {
      r: string;
      s: string;
      v: number;
    }
  ): Promise<TransactionResponse> {
    const nonce = Date.now();
    const { r, s, v, functionName, functionSignature } =
      await coreSdk.signMetaTxResolveDispute({
        exchangeId,
        buyerPercent,
        counterpartySig,
        nonce
      });
    return coreSdk.relayMetaTransaction({
      functionName,
      functionSignature,
      sigR: r,
      sigS: s,
      sigV: v,
      nonce
    });
  }

  const actions = [
    {
      writeContractFn: () => coreSdk.expireVoucher(exchangeId),
      signMetaTxFn: async () => {
        let tx: TransactionResponse;
        const isMetaTx = Boolean(coreSdk?.isMetaTxConfigSet && address);
        const signature = utils.splitSignature(proposal.signature);
        if (isMetaTx) {
          tx = await resolveDisputeWithMetaTx(
            coreSdk,
            exchange.id,
            proposal.percentageAmount,
            signature
          );
        } else {
          tx = await coreSdk.resolveDispute({
            exchangeId: exchange.id,
            buyerPercentBasisPoints: proposal.percentageAmount,
            sigR: signature.r,
            sigS: signature.s,
            sigV: signature.v
          });
        }
      }
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
};
