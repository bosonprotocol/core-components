import { TransactionResponse } from "@bosonprotocol/common";
import { providers } from "ethers";
import { CoreSDK, metaTx } from "@bosonprotocol/core-sdk";
import { useState } from "react";

type WriteContractFn = () => Promise<TransactionResponse>;
type SignMetaTxFn = () => Promise<metaTx.handler.SignedMetaTx>;
type MetaTxCondition = boolean;
export type Action = {
  signMetaTxFn?: SignMetaTxFn;
  writeContractFn: WriteContractFn;
  additionalMetaTxCondition?: MetaTxCondition;
  nativeMetaTxContract?: string;
  shouldActionRun?: () => Promise<boolean>;
};

export function useCtaClickHandler<T>({
  waitBlocks,
  coreSdk,
  signerAddress,
  actions,
  onPendingSignature,
  onPendingTransaction,
  onError,
  onSuccess,
  successPayload
}: {
  waitBlocks: number;
  coreSdk: CoreSDK;
  signerAddress?: string;
  actions: Action[];
  onPendingSignature?: () => void;
  onPendingTransaction?: (txHash: string, isMetaTx?: boolean) => void;
  onSuccess?: (receipt: providers.TransactionReceipt, payload: T) => void;
  onError?: (error: Error) => void;
  successPayload: T | ((receipt: providers.TransactionReceipt) => T);
}) {
  const [isLoading, setIsLoading] = useState(false);

  const clickHandler = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();

    let txResponse, receipt;

    try {
      setIsLoading(true);

      for (const action of actions) {
        const {
          signMetaTxFn,
          writeContractFn,
          additionalMetaTxCondition = true,
          nativeMetaTxContract,
          shouldActionRun = () => Promise.resolve(true)
        } = action;

        if (!(await shouldActionRun())) {
          continue;
        }

        const isMetaTx =
          Boolean(coreSdk.isMetaTxConfigSet && signerAddress && signMetaTxFn) &&
          additionalMetaTxCondition;

        onPendingSignature?.();

        if (isMetaTx && signMetaTxFn) {
          const nonce = Date.now();

          const { r, s, v, functionName, functionSignature } =
            await signMetaTxFn();

          txResponse = nativeMetaTxContract
            ? await coreSdk.relayNativeMetaTransaction(nativeMetaTxContract, {
                functionSignature,
                sigR: r,
                sigS: s,
                sigV: v
              })
            : await coreSdk.relayMetaTransaction({
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

        if (txResponse) {
          onPendingTransaction?.(txResponse.hash, isMetaTx);
          receipt = await txResponse.wait(waitBlocks);
        }
      }

      if (receipt) {
        const payload =
          successPayload instanceof Function
            ? successPayload(receipt as providers.TransactionReceipt)
            : successPayload;
        onSuccess?.(receipt as providers.TransactionReceipt, payload);
      }
    } catch (error) {
      onError?.(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return { clickHandler, isLoading };
}
