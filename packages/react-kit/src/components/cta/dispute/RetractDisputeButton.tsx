import React from "react";
import { BigNumberish, utils } from "ethers";

import { usecoreSdk } from "../../../hooks/useCoreSdk";
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

export const RetractDisputeButton = ({
  exchange,
  proposal,
  variant = "secondaryFill",
  ...restProps
}: IExpireButton) => {
  const address = hooks.useAccount();
  const exchangeId = exchange.id;
  const coreSdk = usecoreSdk(restProps);

  async function retractDisputeWithMetaTx(
    coreSdk: CoreSDK,
    exchangeId: BigNumberish
  ): Promise<TransactionResponse> {
    const nonce = Date.now();
    const { r, s, v, functionName, functionSignature } =
      await coreSdk.signMetaTxRetractDispute({
        exchangeId,
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
        if (isMetaTx) {
          tx = await retractDisputeWithMetaTx(coreSdk, exchangeId);
        } else {
          tx = await coreSdk.retractDispute(exchangeId);
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
