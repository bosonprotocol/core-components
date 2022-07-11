import React from "react";

import Button from "../../buttons/Button";
import { useCoreSdk, CoreSdkConfig } from "../../../hooks/useCoreSdk";
import { ExtraInfo } from "../styles/common.styles";

type RevokeButtonProps = CoreSdkConfig & {
  exchangeId: string;
  disabled?: boolean;
  extraInfo?: string;
  waitBlocks?: number;
  onPendingUserConfirmation: ({
    exchangeId,
    isLoading
  }: {
    exchangeId: string;
    isLoading: boolean;
  }) => void;
  onPendingTransactionConfirmation: (txHash: string) => void;
  onSuccess: ({
    exchangeId,
    txHash
  }: {
    exchangeId: string;
    txHash: string;
  }) => void;
  onError: ({
    exchangeId,
    message,
    error
  }: {
    exchangeId: string;
    message: string;
    error: unknown;
  }) => void;
  children?: React.ReactNode;
};

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
}: RevokeButtonProps) => {
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
      {children || "Revoke"}
      {extraInfo && <ExtraInfo>{extraInfo}</ExtraInfo>}
    </Button>
  );
};

export default RevokeButton;
