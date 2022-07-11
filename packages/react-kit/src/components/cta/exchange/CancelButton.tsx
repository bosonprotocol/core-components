import React from "react";

import Button from "../../buttons/Button";
import { useCoreSdk, CoreSdkConfig } from "../../../hooks/useCoreSdk";
import { useSignerAddress } from "../../../hooks/useSignerAddress";
import { useMetaTxHandlerContract } from "../../../hooks/meta-tx/useMetaTxHandlerContract";
import { ExtraInfo } from "../styles/common.styles";

type CancelButtonProps = CoreSdkConfig & {
  exchangeId: string;
  metaTransactionsApiKey?: string;
  disabled?: boolean;
  waitBlocks?: number;
  extraInfo?: string;
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

const CancelButton = ({
  exchangeId,
  metaTransactionsApiKey,
  disabled = false,
  extraInfo,
  onSuccess,
  onError,
  onPending,
  waitBlocks = 1,
  children,
  ...coreSdkConfig
}: CancelButtonProps) => {
  const coreSdk = useCoreSdk(coreSdkConfig);

  const signerAddress = useSignerAddress(coreSdkConfig.web3Provider);
  const metaTxContract = useMetaTxHandlerContract({
    chainId: coreSdkConfig.chainId,
    metaTransactionsApiKey,
    web3Provider: coreSdkConfig.web3Provider
  });

  return (
    <Button
      variant="primary"
      disabled={disabled}
      onClick={async () => {
        try {
          onPending({ exchangeId, isLoading: true });

          let txResponse;

          if (metaTransactionsApiKey && metaTxContract && signerAddress) {
            const nonce = Date.now();

            const { r, s, v } = await coreSdk.signExecuteMetaTxCancelVoucher({
              chainId: coreSdkConfig.chainId,
              exchangeId,
              nonce
            });

            txResponse = await metaTxContract.executeMetaTxCancelVoucher(
              signerAddress,
              {
                exchangeId
              },
              nonce,
              r,
              s,
              v
            );
          } else {
            txResponse = await coreSdk.cancelVoucher(exchangeId);
          }

          await txResponse.wait(waitBlocks);

          onSuccess({ exchangeId, txHash: txResponse.hash });
          onPending({ exchangeId, isLoading: false });
        } catch (error) {
          onPending({ exchangeId, isLoading: false });
          onError({ exchangeId, message: "error canceling the item", error });
        }
      }}
    >
      {children || "Cancel"}
      {extraInfo && <ExtraInfo>{extraInfo}</ExtraInfo>}
    </Button>
  );
};

export default CancelButton;
