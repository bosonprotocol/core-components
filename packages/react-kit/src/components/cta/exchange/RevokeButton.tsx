import React from "react";

import Button from "../../buttons/Button";
import { useCoreSdk, CoreSdkConfig } from "../../../hooks/useCoreSdk";

type RevokeButtonProps = CoreSdkConfig & {
  exchangeId: string;
  disabled?: boolean;
  waitBlocks?: number;
  onPending: ({
    exchangeId,
    isLoading
  }: {
    exchangeId: string;
    isLoading: boolean;
  }) => void;
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
  onSuccess,
  onError,
  onPending,
  waitBlocks = 1,
  children,
  ...coreSdkConfig
}: RevokeButtonProps) => {
  const coreSdk = useCoreSdk(coreSdkConfig);

  return (
    <Button
      variant="primary"
      disabled={disabled}
      onClick={async () => {
        try {
          onPending({ exchangeId, isLoading: true });

          const txResponse = await coreSdk.revokeVoucher(exchangeId);
          await txResponse.wait(waitBlocks);

          onSuccess({ exchangeId, txHash: txResponse.hash });
          onPending({ exchangeId, isLoading: false });
        } catch (error) {
          onPending({ exchangeId, isLoading: false });
          onError({ exchangeId, message: "error revoking the item", error });
        }
      }}
    >
      {children || "Revoke exchange"}
    </Button>
  );
};

export default RevokeButton;
