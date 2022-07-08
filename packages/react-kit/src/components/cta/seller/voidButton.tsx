import React from "react";

import Button from "../../buttons/button";
import { useCoreSdk, CoreSdkConfig } from "../../../hooks/useCoreSdk";

type VoidButtonProps = CoreSdkConfig & {
  offerId: string;
  metaTransactionsApiKey?: string;
  disabled?: boolean;
  onPending: ({
    offerId,
    isLoading
  }: {
    offerId: string;
    isLoading: boolean;
  }) => void;
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
};

const VoidButton = ({
  offerId,
  metaTransactionsApiKey,
  disabled = false,
  onPending,
  onSuccess,
  onError,
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
          await txResponse.wait(1);
          const txHash = txResponse.hash;

          onSuccess({ offerId, txHash });
          onPending({ offerId, isLoading: false });
        } catch (error) {
          onPending({ offerId, isLoading: false });
          onError({ offerId, message: "error voiding the item", error });
        }
      }}
    >
      Void Offer
    </Button>
  );
};

export default VoidButton;
