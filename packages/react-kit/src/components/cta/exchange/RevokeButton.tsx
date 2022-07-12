import React from "react";
import { BigNumberish, providers } from "ethers";

import { Button, ButtonSize } from "../../buttons/Button";
import { useCoreSdk } from "../../../hooks/useCoreSdk";
import { ExtraInfo } from "../common/styles";
import { CtaButtonProps } from "../common/types";

type Props = { exchangeId: BigNumberish } & CtaButtonProps<{
  exchangeId: BigNumberish;
}>;
export const RevokeButton = ({
  exchangeId,
  disabled = false,
  extraInfo = "",
  onSuccess,
  onError,
  onPendingSignature,
  onPendingTransaction,
  waitBlocks = 1,
  children,
  size = ButtonSize.Large,
  ...coreSdkConfig
}: Props) => {
  const coreSdk = useCoreSdk(coreSdkConfig);

  return (
    <Button
      variant="secondary"
      size={size}
      disabled={disabled}
      onClick={async () => {
        try {
          onPendingSignature();
          const txResponse = await coreSdk.revokeVoucher(exchangeId);

          onPendingTransaction(txResponse.hash);
          const receipt = await txResponse.wait(waitBlocks);

          onSuccess(receipt as providers.TransactionReceipt, { exchangeId });
        } catch (error) {
          onError(error as Error);
        }
      }}
    >
      <>
        {children || "Revoke"}
        {extraInfo && <ExtraInfo>{extraInfo}</ExtraInfo>}
      </>
    </Button>
  );
};
