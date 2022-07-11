import React from "react";

import Button from "../../buttons/Button";
import { useCoreSdk, CoreSdkConfig } from "../../../hooks/useCoreSdk";
import { ExtraInfo } from "../styles/common.styles";

type VoidButtonProps = CoreSdkConfig & {
  offerId: string;
  metaTransactionsApiKey?: string;
  disabled?: boolean;
  waitBlocks?: number;
  extraInfo?: string;
  onPendingUserConfirmation: ({
    offerId,
    isLoading
  }: {
    offerId: string;
    isLoading: boolean;
  }) => void;
  onPendingTransactionConfirmation: (txHash: string) => void;
  onSuccess: ({ offerId, txHash }: { offerId: string; txHash: string }) => void;
  onError: ({
    offerId,
    message,
    error
  }: {
    offerId: string;
    message: string;
    error: unknown;
  }) => void;
  children?: React.ReactNode;
};

const VoidButton = ({
  offerId,
  metaTransactionsApiKey,
  disabled = false,
  extraInfo,
  onSuccess,
  onError,
  onPendingUserConfirmation,
  onPendingTransactionConfirmation,
  waitBlocks = 1,
  children,
  ...coreSdkConfig
}: VoidButtonProps) => {
  const coreSdk = useCoreSdk(coreSdkConfig);

  return (
    <Button
      variant="primary"
      disabled={disabled}
      onClick={async () => {
        try {
          onPendingUserConfirmation({ offerId, isLoading: true });

          const txResponse = await coreSdk.voidOffer(offerId);
          await txResponse.wait(waitBlocks);
          const txHash: string = txResponse.hash;
          onPendingTransactionConfirmation(txHash); // This allows to handle pending block confirmations

          onSuccess({ offerId, txHash });
          onPendingUserConfirmation({ offerId, isLoading: false });
        } catch (error) {
          onPendingUserConfirmation({ offerId, isLoading: false });
          onError({ offerId, message: "error voiding the item", error });
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

export default VoidButton;
