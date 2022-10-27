import { TransactionResponse } from "@bosonprotocol/common";
import { CoreSDK, metaTx } from "@bosonprotocol/core-sdk";
import { TransactionReceipt } from "@ethersproject/providers";
import { useState } from "react";

export function useCtaClickHandler<T>({
  waitBlocks,
  coreSdk,
  signerAddress,
  signMetaTxFn,
  writeContractFn,
  onPendingSignature,
  onPendingTransaction,
  onError,
  onSuccess,
  successPayload
}: {
  waitBlocks: number;
  coreSdk: CoreSDK;
  signerAddress?: string;
  signMetaTxFn?: () => Promise<metaTx.handler.SignedMetaTx>;
  writeContractFn: () => Promise<TransactionResponse>;
  onPendingSignature?: () => void;
  onPendingTransaction?: (txHash: string, isMetaTx?: boolean) => void;
  onSuccess?: (receipt: TransactionReceipt, payload: T) => void;
  onError?: (error: Error) => void;
  successPayload: T;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const clickHandler = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    try {
      setIsLoading(true);
      onPendingSignature?.();

      let txResponse;
      const isMetaTx = Boolean(
        coreSdk.isMetaTxConfigSet && signerAddress && signMetaTxFn
      );

      if (isMetaTx && signMetaTxFn) {
        const nonce = Date.now();

        const { r, s, v, functionName, functionSignature } =
          await signMetaTxFn();

        txResponse = await coreSdk.relayMetaTransaction({
          functionName,
          functionSignature,
          sigR: r,
          sigS: s,
          sigV: v,
          nonce
        });
      } else {
        txResponse = await writeContractFn();
      }

      onPendingTransaction?.(txResponse.hash, isMetaTx);
      const receipt = await txResponse.wait(waitBlocks);

      onSuccess?.(receipt as TransactionReceipt, successPayload);
    } catch (error) {
      onError?.(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return { clickHandler, isLoading };
}
