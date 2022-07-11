import React from "react";

import Button from "../../buttons/Button";
import { useCoreSdk } from "../../../hooks/useCoreSdk";
import { ExtraInfo } from "../styles/common.styles";
import { ExchangeCtaProps } from "./common/types";

const RevokeButton = ({
  exchangeId,
  disabled = false,
  extraInfo = "",
  onSuccess,
  onError,
  onPendingUserConfirmation,
  onPendingTransactionConfirmation,
  waitBlocks = 1,
  children,
  ...coreSdkConfig
}: ExchangeCtaProps) => {
  const coreSdk = useCoreSdk(coreSdkConfig);

  return (
    <Button
      variant="secondary"
      disabled={disabled}
      onClick={async () => {
        try {
          onPendingUserConfirmation({ exchangeId, isLoading: true });

          const txResponse = await coreSdk.revokeVoucher(exchangeId);
          await txResponse.wait(waitBlocks);
          onPendingTransactionConfirmation(txResponse.hash);

          onSuccess({ exchangeId, txHash: txResponse.hash });
          onPendingUserConfirmation({ exchangeId, isLoading: false });
        } catch (error) {
          onPendingUserConfirmation({ exchangeId, isLoading: false });
          onError({ exchangeId, message: "error revoking the item", error });
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

export default RevokeButton;
