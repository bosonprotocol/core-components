import React from "react";
import { BigNumberish, providers } from "ethers";

import { Button } from "../../buttons/Button";
import { useCoreSdk } from "../../../hooks/useCoreSdk";
import { ExtraInfo } from "../common/styles";
import { CtaButtonProps } from "../common/types";

type Props = { offerId: BigNumberish } & CtaButtonProps<{
  offerId: BigNumberish;
}>;

export const VoidButton = ({
  offerId,
  metaTransactionsApiKey,
  disabled = false,
  extraInfo,
  onSuccess,
  onError,
  onPendingSignature,
  onPendingTransaction,
  waitBlocks = 1,
  children,
  ...coreSdkConfig
}: Props) => {
  const coreSdk = useCoreSdk(coreSdkConfig);

  return (
    <Button
      variant="primary"
      disabled={disabled}
      onClick={async () => {
        try {
          onPendingSignature();
          const txResponse = await coreSdk.voidOffer(offerId);

          onPendingTransaction(txResponse.hash);
          const receipt = await txResponse.wait(waitBlocks);

          onSuccess(receipt as providers.TransactionReceipt, { offerId });
        } catch (error) {
          onError(error as Error);
        }
      }}
    >
      <>
        {children || "Void"}
        {extraInfo && <ExtraInfo>{extraInfo}</ExtraInfo>}
      </>
    </Button>
  );
};
