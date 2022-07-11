import React from "react";

import Button from "../../buttons/Button";
import { useCoreSdk, CoreSdkConfig } from "../../../hooks/useCoreSdk";
import { ExtraInfo } from "../styles/common.styles";

type RevokeButtonProps = CoreSdkConfig & {
  exchangeId: string;
  disabled?: boolean;
  extraInfo?: string;
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
  extraInfo = "",
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
      variant="secondary"
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
      {children || "Revoke"}
      {extraInfo && <ExtraInfo>{extraInfo}</ExtraInfo>}
    </Button>
  );
};

export default RevokeButton;
