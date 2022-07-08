import React from "react";

import Button from "../../buttons/Button";
import { useCoreSdk, CoreSdkConfig } from "../../../hooks/useCoreSdk";

type VoidButtonProps = CoreSdkConfig & {
  offerId: string;
  metaTransactionsApiKey?: string;
  disabled?: boolean;
  waitBlocks?: number;
  onPending: ({
    offerId,
    isLoading
  }: {
    offerId: string;
    isLoading: boolean;
  }) => void;
  onSuccess: ({ offerId, txHash }: { offerId: string; txHash: string }) => void;
  onPendingTransactionConfirmation: (txHash: string) => void;
  onPendingUserConfirmation: () => void;
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
  onPending,
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
          onPending({ offerId, isLoading: true });

          const txResponse = await coreSdk.voidOffer(offerId);
          onPendingUserConfirmation(); // This allows to handle pending wallet confirmation state
          await txResponse.wait(waitBlocks);
          const txHash: string = txResponse.hash;
          onPendingTransactionConfirmation(txHash); // This allows to handle pending block confirmations

          onSuccess({ offerId, txHash });
          onPending({ offerId, isLoading: false });
        } catch (error) {
          onPending({ offerId, isLoading: false });
          onError({ offerId, message: "error voiding the item", error });
        }
      }}
    >
      {children || "Void Offer"}
    </Button>
  );
};

export default VoidButton;
