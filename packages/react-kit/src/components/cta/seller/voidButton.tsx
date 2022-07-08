import React, { useState } from "react";

import Button from "../../buttons/Button";
import { useCoreSdk, CoreSdkConfig } from "../../../hooks/useCoreSdk";

type VoidButtonProps = CoreSdkConfig & {
  offerId: string;
  metaTransactionsApiKey?: string;
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
  onPending,
  onSuccess,
  onError,
  ...coreSdkConfig
}: VoidButtonProps) => {
  const coreSdk = useCoreSdk(coreSdkConfig);

  const [isLoading, setIsLoading] = useState(false);

  return (
    <Button
      variant="primary"
      onClick={async () => {
        try {
          setIsLoading(true);
          onPending({ offerId, isLoading });

          const txResponse = await coreSdk.voidOffer(offerId);
          await txResponse.wait(1);
          const txHash = txResponse.hash;

          onSuccess({ offerId, txHash });
          setIsLoading(false);
          onPending({ offerId, isLoading });
        } catch (error) {
          setIsLoading(false);
          onPending({ offerId, isLoading });
          onError({ offerId, message: "error voiding the item", error });
        }
      }}
    >
      Void Offer {offerId}
    </Button>
  );
};

export default VoidButton;
