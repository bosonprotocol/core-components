import React from "react";
import { BigNumberish } from "ethers";

import { useCoreSdk } from "../../../hooks/useCoreSdk";
import { CtaButtonProps } from "../common/types";
import { CtaButton } from "../common/CtaButton";
import { hooks } from "../../../stories/helpers/connect-wallet";
import { TransactionResponse } from "@bosonprotocol/common";
import { CoreSDK } from "@bosonprotocol/core-sdk";
import { Exchange } from "@bosonprotocol/core-sdk/dist/cjs/subgraph";

type AdditionalProps = {
  exchange: Exchange;
};

type SuccessPayload = {
  exchangeId: BigNumberish;
};

export type IExpireButton = AdditionalProps & CtaButtonProps<SuccessPayload>;

export const RaiseDisputeButton = ({
  exchange,
  variant = "secondaryFill",
  ...restProps
}: IExpireButton) => {
  const coreSdk = useCoreSdk(restProps);
  const address = hooks.useAccount();
  const exchangeId = exchange.id;

  async function raiseDisputeWithMetaTx(
    coreSdk: CoreSDK,
    exchangeId: BigNumberish
  ): Promise<TransactionResponse> {
    const nonce = Date.now();
    const { r, s, v, functionName, functionSignature } =
      await coreSdk.signMetaTxRaiseDispute({
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
          tx = await raiseDisputeWithMetaTx(coreSdk, exchangeId);
        } else {
          tx = await coreSdk.raiseDispute(exchangeId);
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
